export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);
    const decodedKey = decodeURIComponent(key)

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

        if (object.range && typeof object.range.offset === "number" && typeof object.range.size === "number") {
          const start = object.range.offset;
          const end = start + object.range.size - 1;
          headers.set("Content-Range", `bytes ${start}-${end}/${object.size}`);
          return new Response(object.body, {
            status: 206,
            headers,
          });
        }

        return new Response(object.body, {
          headers,
        });

      default:
        return new Response("Method Not Allowed", {
          status: 405,
          headers: {
            Allow: "GET",
          },
        });
    }
  },
};