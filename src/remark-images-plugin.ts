import * as path from 'node:path'
import { getResponsiveImagesByDir } from './util/image'
import { DIST_MEDIA_DIR } from './util/constants'

/**
 * Adds images from media directories into the frontmatter for MDX.
 * responsiveImages: Key/value array of responsive image objects.
 * 
 * This is identical to entry.extra.images, but MDX can't see that.
 */
export function remarkImagesPlugin() {
	// All remark and rehype plugins return a separate function
	return async function (tree: any, file: any) {
		// This feels hacky but its the only place i could find the filename
		const filename = path.basename(file.history[0], '.mdx')

		// Media path
		const dir = `${DIST_MEDIA_DIR}/blog/${filename}`

		// Get images
		const responsiveImages = await getResponsiveImagesByDir(dir)

		// We get this in collection.ts instead
		responsiveImages && delete responsiveImages['cover']
		responsiveImages && delete responsiveImages['cover_vertical']

		file.data.astro.frontmatter.responsiveImages = responsiveImages
	}
}
