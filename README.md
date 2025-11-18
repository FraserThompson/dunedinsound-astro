# Dunedinsound Astro

## Project Structure

Our media and content is kept seperately so we can avoid bogging down Astro with thousands of images, and also to avoid vendor lockin for if Astro ever becomes untenable.

We use Astro Collections for our content entries (eg. gigs, artists, venues) and custom architecture for our media.

### Collection Mutation System

Collections work well for static data in YML entries, but we want to calculate dynamic properties on each entry.

To resolve this, we use a custom function for loading collection entries (`loadAndFormatCollection()`). This function loads the entries using the built in Astro method, and then iterates each entry, adding various extra fields depending on the collection type.

We don't add heavy stuff here, just metadata (media related to entries is added on the `[...slug].astro` dynamic route for each entry).

See `collection.ts` for more.

### Collection media

We keep large files like audio and images completely seperate from Astro/vite so we can avoid any importing/processing and just use them as URLs at build time. To avoid slow filesystem lookups, we also cache these directory listings in a local SQLite DB at `.astro/image-cache.db` which is queried at build time. See `image.ts` for more on this.

Raw media for each entry should be stored in `media/[collection_id]/[entry_id]`, except for gigs which should be at `media/[collection]/[entry_id]/[artist_id]`.

This media is then processed into `dist_media` via `scripts/generateMedia.mjs`.

Cover images should be at `media/[collection_id]/[entry_id]/cover.jpg`, or `media/[collection_id]/[entry_id]/cover/[image].jpg` if there are multiple. These will automatically be processed as ResponsiveImage objects and put at `entry.extra.cover`.

#### Generating media

To generate responsive image aggregates for all entries, run `pnpm run media`.

This will copy the directory tree from `media` to `dist_media`, and process all full resolution JPGs into `ResponsiveImage` subdirectories (see ResponsiveImages section below). It will also copy any other files in that directory to `dist_media`.

We use a local SQLite DB to index what media needs to be generated and avoid slow file system lookups. It's located at `.astro/media-generation.db`.

You can run this script with `--dry-run` for a dry run or `--build-db` to just build the database from existing images without generating new ones (you will need to do this on first build if the database has been deleted).

#### Blog media

`remark-images-plugin.ts` is responsible for grabbing images associated with each blog and putting them into the frontmatter so we can use them in markdown.

It grabs responsive images from responsive image directories and puts them on `frontmatter.responsiveImages` keyed by the name of the file (minus the extension). It also grabs raw images from the entry media directory and puts them on the `frontmatter.images`.

## ResponsiveImages

We are rolling our own system for storing and displaying responsive images.

A responsive image is a directory named after the [image] name (without the extension) containing:

- Any number of image proxies which follow this naming convention: [ino].[mtime].[width].webp
- A full size image which follows this naming convention: [image].[mtime].jpg
- These are generated via `pnpm run media` (`scripts/generateMedia.mjs`)

We import these as `ResponsiveImage` objects and use the `Image2` component to display these.

Example: `Input File: \media\gig\2025-10-17-lines-of-flight-2025-friday\flesh_bug\P1090946_DxO.jpg > Output Directory: \dist_media\gig\2025-10-17-lines-of-flight-2025-friday\flesh_bug\P1090946_DxO\[responsive images]`

## CSS

We use PostCSS for CSS pre-processing of style tags in Astro components. This allows us to use nesting, gives us autoprefixes, and other fun stuff.

Most of our styles though are via vanilla-extract so we can have dynamic styles with zero runtime.

### Theme

CSS variables which are reused in lots of places are defined in `src/Theme.ts`.

### CSS Breakpoints

These are defined as CSS draft spec custom-media definitions and contained in `src/assets/media.css`. We have xs, md, and lg.

Use one like this:

```css
@media (--xs) { }
```

## Deploy

The static site ready for deployment is in `dist` once `pnpm run build` has been run, and the media is in `dist_media` once `pnpm run media` has been run.

To build and deploy the static code only, run `pnpm run code-deploy`.

To deploy everything including the media run `pnpm run full-deploy`.

We use `rclone` for deployment. This will need to be installed and configured on the system by following these instructions: https://developers.cloudflare.com/r2/examples/rclone/

### Production architecture

All requests go to a CloudFlare Worker which routes them appropriately.

The built Astro site in `dist` are deployed via Wrangler as static assets in the worker (see https://developers.cloudflare.com/workers/static-assets/).

The big JPG and MP3 files in `dist_media` are served from Cloudflare R2 which is bound to the worker (see `wrangler.jsonc`), which then routes requests for these files to R2 via `worker.js`.
