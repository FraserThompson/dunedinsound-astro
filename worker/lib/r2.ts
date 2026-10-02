import type { Env } from './types';

// Decide whether a pathname should be served from the bound R2 bucket instead of the static Astro site.
export function isR2Path(pathname: string): boolean {
  return (
    pathname === '/dist_media' ||
    pathname.startsWith('/dist_media/') ||
    pathname === '/shared' ||
    pathname.startsWith('/shared/')
  );
}

// Force a file download by setting the attachment filename from the requested path.
export function withAttachmentDisposition(response: Response, pathname: string): Response {
  const headers = new Headers(response.headers);
  const filename = pathname.split('/').filter(Boolean).at(-1);
  headers.set(
    'Content-Disposition',
    filename ? `attachment; filename="${filename}"` : 'attachment'
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Build a plain GET request without any client-specific defaults so asset fallback checks are consistent.
export function makeNormalizedGetRequest(url: URL): Request {
  return new Request(url.toString(), { method: 'GET', headers: new Headers({}) });
}

// Get the configured bucket for a shared or dist_media path.
export function getR2Bucket(env: Env, pathname: string): R2Bucket | null {
  if (pathname === '/shared' || pathname.startsWith('/shared/')) {
    return env.R2_BUCKET ?? null;
  }

  if (pathname === '/dist_media' || pathname.startsWith('/dist_media/')) {
    return env.R2_BUCKET ?? null;
  }

  return env.R2_BUCKET ?? null;
}

// Convert a browser pathname into the matching R2 object prefix for bucket lookups.
export function getR2KeyPrefix(pathname: string): string | null {
  const normalized = pathname.replace(/^\/+/, '');

  if (normalized === 'shared' || normalized.startsWith('shared/')) {
    return normalized === 'shared' ? 'shared/' : normalized;
  }

  if (normalized === 'dist_media' || normalized.startsWith('dist_media/')) {
    return normalized === 'dist_media' ? 'dist_media/' : normalized;
  }

  return null;
}
