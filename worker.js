const getTTL = (url) => {
	// Cache big static files for ages
	if (url.pathname.match(/(.*\.(jpg|jpeg|png|bmp|pict|tif|tiff|webp|gif|heif|mp3|json))/)) {
		return 31556952
		// Cache astro files for ages
	} else if (url.pathname.match(/\/_astro\/.*/)) {
		return 31556952
		// HTML no cache
	} else if (url.pathname.match(/(.*\.(html))/)) {
		return 0
		// Everything else sort of cache
	} else {
		return 3600
	}
}


export default {
	async fetch(request, env, context) {
		const url = new URL(request.url);
		const encodedKey = url.pathname.slice(1);
		const key = decodeURIComponent(encodedKey)

		const cache = caches.default;

		const ttl = getTTL(url)

		const cf = {
			cacheEverything: true,
			cacheTtlByStatus: {
				"200-299": ttl,
				404: 1,
				"500-599": 0
			}
		}

		// create a normalized cache key (strip headers that vary per-user)
		const cacheKey = new Request(url.toString(), {
			method: 'GET',
			headers: new Headers({}) // empty headers => avoid cookie/authorization fragmentation
		});

		// Get files from R2 bucket if not found
		switch (request.method) {
			case "GET":

				// If this is a range request, handle it directly (don't cache)
				const isRange = request.headers.has('range');

				// Fast path: check edge cache first and return immediately if present
				// Skip cache lookup for range requests so we don't accidentally serve/store partial responses
				let cacheResponse = null;
				if (!isRange) {
					cacheResponse = await cache.match(cacheKey);
					if (cacheResponse) return cacheResponse;
				}

				// Cache miss -> fetch object from R2
				const object = await env.STATIC.get(key);
				if (object === null) {
					return new Response("Object Not Found", { status: 404 });
				}

				const headers = new Headers();
				object.writeHttpMetadata(headers);
				headers.set("etag", object.httpEtag);
				headers.set("Accept-Ranges", "bytes");

				// Revalidate files we don't want cached
				if (ttl === 0) {
					headers.set("Cache-Control", `public, max-age=0, must-revalidate`);
				} else {
					headers.set("Cache-Control", `public, max-age=${ttl}`);
				}

				// This is so Range requests for MP3 playback work
				if (object.range && typeof object.range.offset === "number" && typeof object.range.size === "number") {
					const start = object.range.offset;
					const end = start + object.range.size - 1;

					headers.set("Content-Range", `bytes ${start}-${end}/${object.size}`);

					const response = new Response(object.body, {
						status: 206,
						headers,
						cf
					});
					return response;
				}

				const response = new Response(object.body, {
					headers,
					cf
				});

				// Store the fetched response
				// Use waitUntil so you can return the response without blocking on
				// writing to cache
				if (ttl !== 0) {
					context.waitUntil(cache.put(cacheKey, response.clone()));
				}

				return response;

			default:
				return new Response("Method Not Allowed", {
					status: 405,
					cf,
					headers: {
						Allow: "GET",
					},
				});
		}
	},
};
