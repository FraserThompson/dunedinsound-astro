# Dunedinsound Astro

## Project Structure

Our media and content is kept seperately so we can avoid bogging down Astro with thousands of images.

We use Astro Collections for our content entries (eg. gigs, artists, venues)

### Collection Mutation System

Collections work well for static data in YML entries, but we want to calculate dynamic properties on each entry.

To resolve this, we use a custom function for loading collection entries (`loadAndFormatCollection()`). This function loads the entries using the built in Astro method, and then iterates each entry, adding various extra fields depending on the collection type.

This is also where media in the `media/[collection]/[entry_id]` (such as the cover or other images) is resolved and added to the entry so it can access them.

See `collection.ts` for more.

### Entry media directories

We keep large files like audio and images completely seperate from Astro/vite so we can avoid any importing/processing and just use them as URLs. To dynamically resolve these, we just use file system globs.

Raw media for each entry should be stored in `media/[collection_id]/[entry_id]`.

This media is then processed into `dist_media` and symlinked to `dist` on deploy.

#### Generating media

To generate responsive image aggregates for all entries, run `pnpm run media`.

This will copy the directory tree from `media` to `dist_media`, and process all full resolution JPGs into `ResponsiveImage` subdirectories (see ResponsiveImages section below). It will also copy any other files in that directory to `dist_media`.

#### Images

In each entry media directory there can be full resolution JPG images, and any other file.

#### Artist media

Gigs follow a slightly different convention: Media should be stored in `media/[collection]/[entry_id]/[artist_id]`.

#### Blog media

`remark-images-plugin.ts` is responsible for grabbing images associated with each blog and putting them into the frontmatter so we can use them in markdown.

It grabs responsive images from responsive image directories and puts them on `frontmatter.responsiveImages` keyed by the name of the file (minus the extension). It also grabs raw images from the entry media directory and puts them on the `frontmatter.images`.

#### Audio

MP3 and JSON files in a gig directory (ie. `media/gigs/[entry_id]`) will be copied as is.

## ResponsiveImages

We are rolling our own system for storing and displaying responsive images.

A responsive image is a directory named after the [image] name (without the extension) containing:

- Any number of image proxies which follow this naming convention: [image].[width].jpg/webp
- A full size image which follows this naming convention: [image].jpg/webp

We import these as `ResponsiveImage` objects and use the `Image2` component to display these.

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