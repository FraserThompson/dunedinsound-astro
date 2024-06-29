# Dunedinsound Astro

## Project Structure

### Gig media directories

Media for each gig is stored in `src/public/media/gigs/[gig id]`. This is so we can process images outside of Astro.

Under this directory there should be a directory per artist containing that artists media.

#### Images

In each artist directory there should be one directory per each image. This directory should contain the full image as a `jpg`, and any number of `webp` proxies used for responsive display.

The full-size image should follow this naming convention: [image].jpg

The proxies should follow this naming convention: [image].[width].jpg

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

We use PostCSS for CSS pre-processing. This allows us to use nesting, gives us autoprefixes, and other fun stuff.

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
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
