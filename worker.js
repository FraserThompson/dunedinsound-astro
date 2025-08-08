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
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);
    const decodedKey = decodeURIComponent(key)

    const ttl = getTTL(url)

    const cf = {
      cacheEverything: true,
      cacheTtlByStatus: {
        "200-299": ttl,
        404: 1,
        "500-599": 0
      }
    }

    // Get files from R2 bucket if not found
    switch (request.method) {
      case "GET":
        const object = await env.STATIC.get(decodedKey);

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

        if (object.range && typeof object.range.offset === "number" && typeof object.range.size === "number") {
          const start = object.range.offset;
          const end = start + object.range.size - 1;
          headers.set("Content-Range", `bytes ${start}-${end}/${object.size}`);
          return new Response(object.body, {
            status: 206,
            headers,
            cf
          });
        }

        return new Response(object.body, {
          headers,
          cf
        });

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