import { tryR2DirectoryListing } from './worker/lib/directory';
import { makeNormalizedGetRequest, isR2Path, withAttachmentDisposition } from './worker/lib/r2';
import type { CloudflareRequestInit, Env } from './worker/lib/types';

async function fetchSite404(env: Env, url: URL, wantBody = true): Promise<Response | null> {
  try {
    const notFoundReq = makeNormalizedGetRequest(new URL('/404.html', url));
    const notFoundResp = await env.ASSETS.fetch(notFoundReq);
    if (notFoundResp?.status === 200) {
      return wantBody
        ? new Response(notFoundResp.body, { status: 404, headers: notFoundResp.headers })
        : new Response(null, { status: 404, headers: notFoundResp.headers });
    }
  } catch {
    // Ignore 404 fallback errors and continue with default response.
  }

  return null;
}

export default {
  async fetch(request: Request, env: Env, _context: unknown): Promise<Response> {
    const url = new URL(request.url);

    // Redirect well-known WebFinger endpoints to Bridgy Fed.
    if (/^\/.well-known\/(host-meta|webfinger)/.test(url.pathname)) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `https://fed.brid.gy${url.pathname}${url.search}`,
        },
      });
    }

    // Only GET and HEAD are allowed.
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD' },
      });
    }

    // Serve non-R2 assets (Astro app files).
    if (!isR2Path(url.pathname)) {
      const resp = await env.ASSETS.fetch(request);
      if (resp.status === 404) {
        const nf = await fetchSite404(env, url, request.method === 'GET');
        if (nf) {
          return nf;
        }
      }

      return resp;
    }

    const maybeDirectoryListing = await tryR2DirectoryListing(env, url);
    if (maybeDirectoryListing) {
      return maybeDirectoryListing;
    }

    const r2Key = url.pathname.replace(/^\/+/, '');
    const object = env.R2_BUCKET && (r2Key === 'shared' || r2Key.startsWith('shared/') || r2Key === 'dist_media' || r2Key.startsWith('dist_media/'))
      ? await env.R2_BUCKET.get(r2Key)
      : null;

    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');

      const response = new Response(object.body, {
        status: 200,
        headers,
      });

      if (url.pathname.startsWith('/shared/')) {
        return withAttachmentDisposition(response, url.pathname);
      }

      return response;
    }

    // Fall back to the public media origin if the bound bucket does not have the object.
    const key = url.pathname;
    const r2PublicDomain = 'https://media.dunedinsound.com';
    const targetUrl = new URL(key, r2PublicDomain + (r2PublicDomain.endsWith('/') ? '' : '/'));
    const proxyRequest = new Request(targetUrl, request);

    // Fetch through Cloudflare edge cache.
    const response = await fetch(proxyRequest, {
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: {
          '200-299': 31556952,
          404: 1,
          '500-599': 0,
        },
      },
    } as CloudflareRequestInit);

    // Handle missing files gracefully.
    if (response.status === 404) {
      const nf = await fetchSite404(env, url, request.method === 'GET');
      if (nf) {
        return nf;
      }

      return new Response('Object Not Found', { status: 404 });
    }

    if (url.pathname.startsWith('/shared/')) {
      return withAttachmentDisposition(response, url.pathname);
    }

    return response;
  },
};
