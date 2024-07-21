import * as path from 'node:path'
import { getImagesByDir, getResponsiveImagesByDir } from './util/image'

/**
 * Adds images from media directories into the frontmatter for MDX.
 * 
 * responsiveImages: Key/value array of responsive image objects.
 * images: Key/value array of image src's.
 */
export function remarkImagesPlugin() {
	// All remark and rehype plugins return a separate function
	return async function (tree: any, file: any) {

		// This feels hacky but its the only place i could find the filename
		const filename = path.basename(file.history[0])

		// Media path
		const dir = `public/media/blog/${filename}`

		// Get media which is responsive
		const responsiveImages = await getResponsiveImagesByDir(dir)
		
		// Get media which isn't responsive
		const unresponsiveImages = await getImagesByDir(dir)
		
		file.data.astro.frontmatter.responsiveImages = responsiveImages;
		file.data.astro.frontmatter.images = unresponsiveImages;
	}
}
