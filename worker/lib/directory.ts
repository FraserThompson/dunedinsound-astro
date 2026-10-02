import type { Env } from './types';
import { getR2Bucket, getR2KeyPrefix } from './r2';

// Escape untrusted text so directory names are safe to render in HTML.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Build a safe href for a child file or directory inside the current listing.
export function makeDirectoryEntryHref(currentPathname: string, entryName: string, isDirectory: boolean): string {
  const basePath = currentPathname.endsWith('/') ? currentPathname : `${currentPathname}/`;
  const encodedName = encodeURI(entryName).replace(/#/g, '%23');
  return `${basePath}${encodedName}${isDirectory ? '/' : ''}`;
}

// Render a simple HTML page containing links for each object in a directory.
export function renderDirectoryListing(
  currentPathname: string,
  entries: Array<{ name: string; href: string; isDirectory: boolean }>
): string {
  const escapedPath = escapeHtml(currentPathname);
  const items = entries
    .map((entry) => {
      const escapedName = escapeHtml(entry.name);
      const icon = entry.isDirectory ? '📁' : '📄';
      return `<li><a href="${escapeHtml(entry.href)}">${icon} ${escapedName}${entry.isDirectory ? '/' : ''}</a></li>`;
    })
    .join('');

  const parentHref = currentPathname === '/' ? '/' : currentPathname.replace(/\/[^/]*\/?$/, '/') || '/';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Index of ${escapedPath}</title>
    <style>
      body { font-family: sans-serif; margin: 2rem; color: #111827; }
      a { color: #0f172a; text-decoration: none; }
      a:hover { text-decoration: underline; }
      ul { list-style: none; padding-left: 0; }
      li { margin: 0.35rem 0; }
      .meta { color: #475569; margin-bottom: 1rem; }
    </style>
  </head>
  <body>
    <h1>Index of ${escapedPath}</h1>
    <div class="meta">Directory listing</div>
    <ul>
      <li><a href="${escapeHtml(parentHref)}">📁 ../</a></li>
      ${items || '<li>Empty directory</li>'}
    </ul>
  </body>
</html>`;
}

// Return an HTML directory index when a bucket path is a directory instead of a file.
export async function tryR2DirectoryListing(env: Env, url: URL): Promise<Response | null> {
  const bucket = getR2Bucket(env, url.pathname);
  if (!bucket) {
    return null;
  }

  const prefix = getR2KeyPrefix(url.pathname);
  if (!prefix) {
    return null;
  }

  if (url.pathname === '/shared' || url.pathname === '/dist_media') {
    return null;
  }

  const exactKey = prefix.replace(/\/$/, '');
  const exactObject = await bucket.head(exactKey);
  if (exactObject) {
    return null;
  }

  const listPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
  const listing = await bucket.list({ prefix: listPrefix, delimiter: '/' });
  const entries: Array<{ name: string; href: string; isDirectory: boolean }> = [];

  for (const dirname of listing.delimitedPrefixes) {
    const name = dirname.slice(listPrefix.length).replace(/\/$/, '');
    if (!name) {
      continue;
    }

    entries.push({
      name,
      href: makeDirectoryEntryHref(url.pathname, name, true),
      isDirectory: true,
    });
  }

  for (const object of listing.objects) {
    if (object.key === listPrefix.replace(/\/$/, '')) {
      continue;
    }

    const relativeName = object.key.slice(listPrefix.length);
    if (!relativeName || relativeName.includes('/')) {
      continue;
    }

    entries.push({
      name: relativeName,
      href: makeDirectoryEntryHref(url.pathname, relativeName, false),
      isDirectory: false,
    });
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));

  const hasEntries = entries.length > 0 || listing.delimitedPrefixes.length > 0 || listing.objects.length > 0 || url.pathname.endsWith('/');
  if (!hasEntries) {
    return null;
  }

  return new Response(renderDirectoryListing(url.pathname, entries), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
