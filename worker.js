// --- Helper Functions ---

const getTTL = (url) => {
	// Cache big static files
	if (url.pathname.match(/(.*\.(jpg|jpeg|png|bmp|pict|tif|tiff|webp|gif|heif|mp3|json))/)) {
		return 31556952;
	} else if (url.pathname.match(/\/_astro\/.*/)) {
		return 31556952;
	} else if (url.pathname.match(/(.*\.(html))/)) {
		return 0;
	} else {
		return 3600;
	}
};

// Serve assets from the static ASSETS binding
async function serveAssetRequest(normalizedReq, env, url, method) {
	if (method === 'HEAD') {
		const resp = await env.ASSETS.fetch(normalizedReq);
		if (resp && resp.status === 404) {
			const nf = await fetchSite404(env, url, false);
			if (nf) return nf;
		}
		return new Response(null, {
			status: resp ? resp.status : 404,
			headers: resp ? resp.headers : new Headers()
		});
	}
	const resp = await env.ASSETS.fetch(normalizedReq);
	if (resp && resp.status === 404) {
		const nf = await fetchSite404(env, url, true);
		if (nf) return nf;
	}
	return resp;
}

// Create a normalized GET Request
function makeNormalizedGetRequest(url) {
	return new Request(url.toString(), { method: 'GET', headers: new Headers({}) });
}

// Try to fetch the site's /404.html
async function fetchSite404(env, url, wantBody = true) {
	try {
		const notFoundReq = makeNormalizedGetRequest(new URL('/404.html', url));
		const notFoundResp = await env.ASSETS.fetch(notFoundReq);
		if (notFoundResp && notFoundResp.status === 200) {
			return wantBody
				? new Response(notFoundResp.body, { status: 404, headers: notFoundResp.headers })
				: new Response(null, { status: 404, headers: notFoundResp.headers });
		}
	} catch (e) { /* ignore */ }
	return null;
}

// Parse a Range header
function parseRangeHeader(rangeHeader) {
	if (!rangeHeader) return null;
	const r = rangeHeader.trim();
	let m = /^bytes=(\d+)-(\d+)?$/.exec(r);
	if (m) {
		const start = Number(m[1]);
		const end = m[2] !== undefined ? Number(m[2]) : undefined;
		return { type: 'range', start, end };
	}
	m = /^bytes=-(\d+)$/.exec(r);
	if (m) {
		const suffixLength = Number(m[1]);
		return { type: 'suffix', suffixLength };
	}
	return null;
}

// Apply Content-Range headers
function applyRangeHeaders(headers, start, end, totalSize) {
	const finalEnd = (typeof end === 'number') ? end : (totalSize - 1);
	const chunkLength = finalEnd - start + 1;
	headers.set('Content-Range', `bytes ${start}-${finalEnd}/${totalSize}`);
	headers.set('Content-Length', String(chunkLength));
}

// --- Main Worker Entrypoint ---
export default {
	async fetch(request, env, context) {
		const url = new URL(request.url);
		const encodedKey = url.pathname.slice(1);

		let key;
		try {
			key = decodeURIComponent(encodedKey);
		} catch (e) {
			return new Response("Invalid URI", { status: 400 });
		}

		const cache = caches.default;
		const ttl = getTTL(url);

		const cacheKey = makeNormalizedGetRequest(url);

		switch (request.method) {
			case "GET":
			case "HEAD": {
				// Serve non-R2 assets first
				if (!url.pathname.startsWith("/dist_media/")) {
					const normalized = makeNormalizedGetRequest(url);
					const handled = await serveAssetRequest(normalized, env, url, request.method);
					if (handled) return handled;
				}

				// --- R2 Logic for /dist_media/ ---
				const rangeHeader = request.headers.get('range');
				const parsedRange = parseRangeHeader(rangeHeader);

				// Check cache for non-range requests only
				if (!parsedRange && request.method === 'GET') {
					const cacheResponse = await cache.match(cacheKey);
					if (cacheResponse) {
						const newHeaders = new Headers(cacheResponse.headers);
						newHeaders.set('X-Cache-Hit', 'true');
						return new Response(cacheResponse.body, {
							status: cacheResponse.status,
							statusText: cacheResponse.statusText,
							headers: newHeaders
						});
					}
				}

				// For range requests, we need the total file size to set Content-Range correctly
				// Strategy: Try to get it from cache, or do HEAD
				let totalSize;
				let objectMetadata;

				// Always check size cache first if we need totalSize
				if (parsedRange || request.method === 'HEAD') {
					const sizeCacheKey = new Request(url.toString() + '?__size__', { 
						method: 'HEAD', 
						headers: new Headers({}) 
					});
					const cachedSize = await cache.match(sizeCacheKey).catch(() => null);
					if (cachedSize) {
						const sizeHeader = cachedSize.headers.get('X-Object-Size');
						if (sizeHeader) {
							totalSize = Number(sizeHeader);
							console.log('Cache hit for file size', { 
								key: key.substring(key.lastIndexOf('/') + 1),
								size: totalSize 
							});
						}
					}
				
					// Do HEAD if we don't have cached size
					if (!totalSize) {
						const headStart = Date.now();
						objectMetadata = await env.STATIC.head(key);
						const headTime = Date.now() - headStart;
						
						if (headTime > 500) {
							console.warn('Slow R2 HEAD', { 
								key: key.substring(key.lastIndexOf('/') + 1), 
								ms: headTime 
							});
						} else if (headTime > 100) {
							console.log('R2 HEAD', { 
								key: key.substring(key.lastIndexOf('/') + 1), 
								ms: headTime 
							});
						}
						
						if (objectMetadata === null) {
							const nf = await fetchSite404(env, url, request.method === 'GET');
							if (nf) return nf;
							return new Response("Object Not Found", { status: 404 });
						}
						
						totalSize = objectMetadata.size;
						
						// Cache size for future range requests (longer TTL for size metadata)
						if (ttl > 0) {
							const sizeCacheKey = new Request(url.toString() + '?__size__', { 
								method: 'HEAD', 
								headers: new Headers({}) 
							});
							const sizeResp = new Response(null, { 
								headers: new Headers({ 
									'X-Object-Size': String(totalSize),
									'Cache-Control': `public, max-age=${ttl}`
								}) 
							});
							context.waitUntil(cache.put(sizeCacheKey, sizeResp).catch(() => {}));
						}
					}
				}

				// Handle suffix ranges by converting to standard ranges
				if (parsedRange?.type === 'suffix') {
					const suffix = parsedRange.suffixLength;
					const start = Math.max(0, totalSize - suffix);
					const end = totalSize - 1;
					parsedRange.type = 'range';
					parsedRange.start = start;
					parsedRange.end = end;
				}

				// Handle HEAD requests
				if (request.method === 'HEAD') {
					const headers = new Headers();
					objectMetadata.writeHttpMetadata(headers);
					headers.set("etag", objectMetadata.httpEtag);
					headers.set("Accept-Ranges", "bytes");
					headers.set('X-Cache-Hit', 'false');

					if (ttl === 0) {
						headers.set("Cache-Control", `public, max-age=0, must-revalidate`);
					} else {
						headers.set("Cache-Control", `public, max-age=${ttl}`);
					}

					if (parsedRange) {
						applyRangeHeaders(headers, parsedRange.start, parsedRange.end, totalSize);
						return new Response(null, { status: 206, headers });
					} else {
						headers.set('Content-Length', totalSize.toString());
						return new Response(null, { status: 200, headers });
					}
				}

				// Handle GET requests
				let object;
				let options;
				
				if (parsedRange) {
					// For open-ended ranges (bytes=START-), only set offset
					// For specific ranges (bytes=START-END), set offset and length
					options = parsedRange.end !== undefined
						? { range: { offset: parsedRange.start, length: parsedRange.end - parsedRange.start + 1 } }
						: { range: { offset: parsedRange.start } };
				}

				const getStart = Date.now();
				object = await env.STATIC.get(key, options);
				const getTime = Date.now() - getStart;
				
				// Log slow requests
				if (parsedRange) {
					const logData = {
						key: key.substring(key.lastIndexOf('/') + 1),
						range: rangeHeader,
						ms: getTime,
						size: object?.size || 'unknown'
					};
					if (getTime > 1000) {
						console.error('VERY SLOW R2 range GET', logData);
					} else if (getTime > 200) {
						console.warn('Slow R2 range GET', logData);
					}
				} else if (getTime > 1000) {
					console.warn('Slow R2 full GET', { key, ms: getTime });
				}

				if (object === null) {
					const nf = await fetchSite404(env, url, true);
					if (nf) return nf;
					return new Response("Object Not Found", { status: 404 });
				}

				// Build Response Headers
				const headers = new Headers();
				object.writeHttpMetadata(headers);
				headers.set("etag", object.httpEtag);
				headers.set("Accept-Ranges", "bytes");
				headers.set('X-Cache-Hit', 'false');
				
				// Add timing hints for better mobile performance
				headers.set('Timing-Allow-Origin', '*');

				if (ttl === 0) {
					headers.set("Cache-Control", `public, max-age=0, must-revalidate`);
				} else {
					headers.set("Cache-Control", `public, max-age=${ttl}`);
				}

				// Handle conditional requests (304 Not Modified) - only for full requests
				if (!parsedRange) {
					const ifNoneMatch = request.headers.get('if-none-match');
					if (ifNoneMatch && object.httpEtag && ifNoneMatch === object.httpEtag) {
						return new Response(null, { status: 304, headers });
					}
					const ifModifiedSince = request.headers.get('if-modified-since');
					if (!object.httpEtag && ifModifiedSince) {
						const lastMod = headers.get('last-modified');
						if (lastMod && new Date(ifModifiedSince).getTime() >= new Date(lastMod).getTime()) {
							return new Response(null, { status: 304, headers });
						}
					}
				}

				// Set status and range headers
				const status = parsedRange ? 206 : 200;

				if (parsedRange) {
					applyRangeHeaders(headers, parsedRange.start, parsedRange.end, totalSize);
				} else {
					headers.set('Content-Length', object.size.toString());
					
					// Cache the file size for future range requests
					if (ttl > 0) {
						const sizeCacheKey = new Request(url.toString() + '?__size__', { 
							method: 'HEAD', 
							headers: new Headers({}) 
						});
						const sizeResp = new Response(null, { 
							headers: new Headers({ 
								'X-Object-Size': String(object.size),
								'Cache-Control': `public, max-age=${ttl}`
							}) 
						});
						context.waitUntil(cache.put(sizeCacheKey, sizeResp).catch(() => {}));
					}
				}

				// Cloudflare edge caching: only cache full (200) responses
				// Range responses (206) bypass edge cache to avoid serving wrong ranges
				const cf = status === 200 ? {
					cacheTtlByStatus: { "200-299": ttl, 404: 1, "500-599": 0 }
				} : undefined;

				// Cache full responses under 50MB in Workers cache
				if (ttl > 0 && !parsedRange && object.size < 50 * 1024 * 1024) {
					const response = new Response(object.body, { headers, status, cf });
					context.waitUntil(
						cache.put(cacheKey, response.clone()).catch((e) => 
							console.warn('Cache put failed', { key, error: e.message })
						)
					);
					return response;
				}

				return new Response(object.body, { headers, status, cf });
			}

			default:
				return new Response("Method Not Allowed", {
					status: 405,
					headers: {
						Allow: "GET, HEAD",
					},
				});
		}
	},
};
