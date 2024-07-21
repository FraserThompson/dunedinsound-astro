# Dunedinsound Astro

## ResponsiveImages

We are rolling our own system for storing and displaying responsive images.

A responsive image is:

- A directory named after the [image] name without the extension containing...
- Any number of image proxies which follow this naming convention: [image].[width].jpg/webp
- A full size image which follows this naming convention: [image].jpg/webp

We import these as `ResponsiveImage` objects and use the `Image2` component to display these.

## Project Structure

Our media and content is kept seperately so we can avoid bogging down Astro with thousands of images.

### Entry media directories

Media for each entry should be stored in `src/public/media/[collection_id]/[entry_id]`.

#### Images

In each entry media directory there should be ResponsiveImage subdirectories.

#### Artist media

Gigs follow a slightly different convention: Media should be stored in `src/public/media/[collection]/[entry_id]/[artist_id]`.

#### Blog media

`remark-images-plugin.ts` is responsible for grabbing images associated with each blog and putting them into the frontmatter so we can use them in markdown.

It grabs responsive images from responsive image directories and puts them on 'frontmatter.responsiveImages'. It also grabs raw images from the entry media directory and puts them on the 'frontmatter.images'

#### Audio

[todo]

## Media manifests

DEPRECATED - ended up not doing this

Rather than globbing the filesystem for thousands of files at build time, we have a seperate process which spits out a media manifest in JSON format which we can reference to display media.

These are part of the `manifest` content collection. The idea is thus:

* Every gig contains artists.
* Every artist contains a number of images.
* Each image comes with a number of variants for a number of screen sizes.
* Also, every artist contains a number of audio files.
* Each audio file comes with a JSON peaks file for WaveSurfer.

## CSS

We use PostCSS for CSS pre-processing of style tags in Astro components. This allows us to use nesting, gives us autoprefixes, and other fun stuff.

Additionally we use vanilla-extract for dynamic styles.

### Theme

CSS variables which are reused in lots of places are defined in `src/Theme.ts`.

### CSS Breakpoints

These are defined as CSS draft spec custom-media definitions and contained in `src/assets/media.css`. We have xs, md, and lg.

Use one like this:

```css
@media (--xs) { }
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |
