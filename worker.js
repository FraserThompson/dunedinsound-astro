// --- Helper Functions ---

const getTTL = (url) => {
	const path = url.pathname;
	if (path.endsWith('.html')) return 0; // No cache for HTML
	if (path.includes('/_astro/') || /\.(jpg|jpeg|png|webp|gif|mp3|json)$/i.test(path)) {
		return 31556952; // 1 year for static assets
	}
	return 3600; // 1 hour default
};

const RANGE_CACHE_THRESHOLD = 10 * 1024 * 1024; // Cache ranges in first 10MB
const FULL_FILE_CACHE_LIMIT = 50 * 1024 * 1024; // Cache full files under 50MB

function makeNormalizedGetRequest(url) {
	return new Request(url.toString(), { method: 'GET', headers: new Headers({}) });
}

async function fetchSite404(env, url, wantBody = true) {
	try {
		const notFoundReq = makeNormalizedGetRequest(new URL('/404.html', url));
		const notFoundResp = await env.ASSETS.fetch(notFoundReq);
		if (notFoundResp?.status === 200) {
			return wantBody
				? new Response(notFoundResp.body, { status: 404, headers: notFoundResp.headers })
				: new Response(null, { status: 404, headers: notFoundResp.headers });
		}
	} catch (e) { /* ignore */ }
	return null;
}

function parseRangeHeader(rangeHeader) {
	if (!rangeHeader) return null;
	const match = /^bytes=(\d+)-(\d*)$/.exec(rangeHeader.trim());
	if (match) {
		return { start: Number(match[1]), end: match[2] ? Number(match[2]) : undefined };
	}
	const suffixMatch = /^bytes=-(\d+)$/.exec(rangeHeader.trim());
	if (suffixMatch) {
		return { suffix: Number(suffixMatch[1]) };
	}
	return null;
}

function buildCacheHeaders(ttl, etag, size) {
	const headers = new Headers({
		'Accept-Ranges': 'bytes',
		'Cache-Control': ttl === 0 ? 'public, max-age=0, must-revalidate' : `public, max-age=${ttl}`
	});
	if (etag) headers.set('etag', etag);
	if (size !== undefined) headers.set('Content-Length', String(size));
	return headers;
}

// --- Main Worker Entrypoint ---
export default {
	async fetch(request, env, context) {
		const url = new URL(request.url);
		let key;
		try {
			key = decodeURIComponent(url.pathname.slice(1));
		} catch (e) {
			return new Response("Invalid URI", { status: 400 });
		}

		// Only GET and HEAD allowed
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			return new Response("Method Not Allowed", {
				status: 405,
				headers: { Allow: "GET, HEAD" }
			});
		}

		// Serve non-R2 assets (Astro app files)
		if (!url.pathname.startsWith("/dist_media/")) {
			const resp = await env.ASSETS.fetch(request);
			if (resp.status === 404) {
				const nf = await fetchSite404(env, url, request.method === 'GET');
				if (nf) return nf;
			}
			return resp;
		}

		// --- R2 Logic for /dist_media/ ---
		const cache = caches.default;
		const ttl = getTTL(url);
		const rangeHeader = request.headers.get('range');
		let parsedRange = parseRangeHeader(rangeHeader);

		// Check Workers cache for full file requests
		if (!parsedRange && request.method === 'GET') {
			const cached = await cache.match(makeNormalizedGetRequest(url));
			if (cached) {
				const headers = new Headers(cached.headers);
				headers.set('X-Cache-Hit', 'true');
				return new Response(cached.body, {
					status: cached.status,
					headers
				});
			}
		}

		// Check cache for range requests in the "hot zone" (first 10MB)
		if (parsedRange && !parsedRange.suffix && parsedRange.start < RANGE_CACHE_THRESHOLD) {
			const cached = await cache.match(new Request(url.toString(), {
				headers: { 'Range': rangeHeader }
			}));
			if (cached) {
				const headers = new Headers(cached.headers);
				headers.set('X-Cache-Hit', 'true');
				return new Response(cached.body, {
					status: cached.status,
					headers
				});
			}
		}

		// Get file metadata
		const metadata = await env.STATIC.head(key);
		if (!metadata) {
			const nf = await fetchSite404(env, url, request.method === 'GET');
			if (nf) return nf;
			return new Response("Object Not Found", { status: 404 });
		}

		// Convert suffix ranges to standard ranges
		if (parsedRange?.suffix) {
			parsedRange = {
				start: Math.max(0, metadata.size - parsedRange.suffix),
				end: metadata.size - 1
			};
		}

		const range = parsedRange;

		// Handle HEAD requests
		if (request.method === 'HEAD') {
			const headers = buildCacheHeaders(ttl, metadata.httpEtag, metadata.size);
			metadata.writeHttpMetadata(headers);
			
			if (range) {
				const end = range.end ?? metadata.size - 1;
				headers.set('Content-Range', `bytes ${range.start}-${end}/${metadata.size}`);
				headers.set('Content-Length', String(end - range.start + 1));
				return new Response(null, { status: 206, headers });
			}
			return new Response(null, { status: 200, headers });
		}

		// Fetch from R2
		const object = await env.STATIC.get(key, range ? {
			range: range.end !== undefined
				? { offset: range.start, length: range.end - range.start + 1 }
				: { offset: range.start }
		} : undefined);
		if (!object) {
			const nf = await fetchSite404(env, url, true);
			if (nf) return nf;
			return new Response("Object Not Found", { status: 404 });
		}

		// Build response headers
		const headers = buildCacheHeaders(ttl, object.httpEtag, range ? undefined : object.size);
		object.writeHttpMetadata(headers);

		// Handle 304 Not Modified for full requests
		if (!range && request.headers.get('if-none-match') === object.httpEtag) {
			return new Response(null, { status: 304, headers });
		}

		// Set Content-Range for partial responses
		if (range) {
			const end = range.end ?? metadata.size - 1;
			headers.set('Content-Range', `bytes ${range.start}-${end}/${metadata.size}`);
			headers.set('Content-Length', String(end - range.start + 1));
		}

		const response = new Response(object.body, {
			status: range ? 206 : 200,
			headers,
			cf: range ? undefined : { cacheTtlByStatus: { "200-299": ttl, 404: 1, "500-599": 0 } }
		});

		// Cache strategically in Workers cache
		if (ttl > 0) {
			if (!range && object.size < FULL_FILE_CACHE_LIMIT) {
				// Cache full files under 50MB
				context.waitUntil(cache.put(makeNormalizedGetRequest(url), response.clone()));
			} else if (range && range.start < RANGE_CACHE_THRESHOLD) {
				// Cache range requests in the "hot zone" (first 10MB of file)
				context.waitUntil(cache.put(
					new Request(url.toString(), { headers: { 'Range': rangeHeader } }),
					response.clone()
				));
			}
		}

		return response;
	},
};
