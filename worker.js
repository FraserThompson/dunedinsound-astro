// --- Helper Functions ---

const getTTL = (url) => {
	const path = url.pathname;
	if (path.endsWith('.html')) return 0; // No cache for HTML
	if (path.includes('/_astro/') || /\.(jpg|jpeg|png|webp|gif|mp3|json)$/i.test(path)) {
		return 31556952; // 1 year for static assets
	}
	return 3600; // 1 hour default
};

const FULL_FILE_CACHE_LIMIT = 10 * 1024 * 1024; // Only cache small files under 10MB in Workers cache

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

		// For range requests, check if we have the full file cached (only for small files)
		// If so, we can serve the range from cache instead of hitting R2
		if (parsedRange && request.method === 'GET') {
			const fullFileCached = await cache.match(makeNormalizedGetRequest(url));
			if (fullFileCached) {
				// Use the native Cache API range support instead of manual slicing
				const rangeRequest = new Request(url.toString(), {
					headers: { 'Range': rangeHeader }
				});
				const rangeFromCache = await cache.match(rangeRequest);
				if (rangeFromCache) {
					const headers = new Headers(rangeFromCache.headers);
					headers.set('X-Cache-Hit', 'true');
					return rangeFromCache;
				}
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
		// For small cacheable files with range requests, fetch the FULL file to cache it
		// For large files (like 100MB+ MP3s), always use range requests directly
		const shouldCacheFull = ttl > 0 && metadata.size < FULL_FILE_CACHE_LIMIT;
		const fetchRange = range && !shouldCacheFull;
		
		const object = await env.STATIC.get(key, fetchRange ? {
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
		const headers = buildCacheHeaders(ttl, object.httpEtag, range && fetchRange ? undefined : object.size);
		object.writeHttpMetadata(headers);

		// Handle 304 Not Modified for full requests
		if (!range && request.headers.get('if-none-match') === object.httpEtag) {
			return new Response(null, { status: 304, headers });
		}

		// If we fetched the full file but need to return a range, slice it
		if (range && !fetchRange) {
			const fullBody = await object.arrayBuffer();
			const end = range.end ?? metadata.size - 1;
			const rangeBody = fullBody.slice(range.start, end + 1);
			
			headers.set('Content-Range', `bytes ${range.start}-${end}/${metadata.size}`);
			headers.set('Content-Length', String(rangeBody.byteLength));
			
			const rangeResponse = new Response(rangeBody, { status: 206, headers });
			
			// Cache the full file for future range requests (only for small files)
			if (shouldCacheFull) {
				const fullResponse = new Response(fullBody, {
					status: 200,
					headers: buildCacheHeaders(ttl, object.httpEtag, metadata.size)
				});
				object.writeHttpMetadata(fullResponse.headers);
				context.waitUntil(cache.put(makeNormalizedGetRequest(url), fullResponse));
			}
			
			return rangeResponse;
		}

		// Set Content-Range for partial responses (large files doing range fetch)
		if (range && fetchRange) {
			const end = range.end ?? metadata.size - 1;
			headers.set('Content-Range', `bytes ${range.start}-${end}/${metadata.size}`);
			headers.set('Content-Length', String(end - range.start + 1));
		}

		const response = new Response(object.body, {
			status: range ? 206 : 200,
			headers,
			cf: !range ? { cacheTtlByStatus: { "200-299": ttl, 404: 1, "500-599": 0 } } : undefined
		});

		// Cache full files
		if (ttl > 0 && !range && object.size < FULL_FILE_CACHE_LIMIT) {
			context.waitUntil(cache.put(makeNormalizedGetRequest(url), response.clone()));
		}

		return response;
	},
};
