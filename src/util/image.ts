import { fdir } from 'fdir'
import * as path from 'node:path'

/**
 * ResponsiveImage
 *
 * Takes an array of image paths and turns it into a helpful object we can
 * use to display a responsive image via srcset attributes.
 *
 * Expects the filenames to follow this format: [anything].[width].[webp]
 */
export class ResponsiveImage {
	// Key value array of width => src
	public images: { [key: string]: string }

	// Srcset string to use on <img> element
	public srcset: string

	// Link to full image
	public src: string

	constructor(images: string[]) {
		this.src = ''

		const parsedImages = images.reduce(
			(acc: any, src: string) => {
				src = src.replace('public/', '/')
				const pathComponents = src.split('.')
				if (pathComponents.length > 2) {
					const w = pathComponents[pathComponents.length - 2]
					acc[0] += `${src} ${w}w,`
					acc[1][w.toString()] = src
				} else {
					this.src = src
				}
				return acc
			},
			['', {}] as any
		)

		this.srcset = parsedImages[0]
		this.images = parsedImages[1]
	}
}

/**
 * Returns a responsive image object from a responsive image directory.
 *
 * @param imageDir
 * @returns ResponsiveImage object
 */
export async function getResponsiveImages(imageDir: string): Promise<ResponsiveImage | undefined> {
	const srcs = (
		await new fdir({
			pathSeparator: '/',
			includeBasePath: true
		})
			.glob('**@(jpg|webp)')
			.crawl(imageDir)
			.withPromise()
	).map((img) => img.replace('public/', '/'))
	return srcs.length > 1 ? new ResponsiveImage(srcs) : undefined
}

/**
 * Gets all responsive images from a directory of responsive image directories.
 *
 * @param dir Dir to look in
 * @returns Key/value array keyed by image name of ResponsiveImage objects.
 */
export async function getResponsiveImagesByDir(dir: string): Promise<{ [id: string]: ResponsiveImage } | undefined> {
	// Find media dirs for this entry (if it exists)
	const mediaDirs = await new fdir({
		pathSeparator: '/',
		includeBasePath: true
	})
		.group()
		.glob(`**/**@(jpg|webp)`)
		.crawl(dir)
		.withPromise()

	// It always returns itself, so this is 1 not 0
	if (mediaDirs.length === 1) return

	let images: { [id: string]: ResponsiveImage } = {}

	// Get all responsive image entities
	for (const group of mediaDirs) {
		if (!group.files.length) continue
		const filename = path.basename(group.directory)
		images[filename] = new ResponsiveImage(group.files)
	}

	return images
}

/**
 * Gets raw image src's from a directory.
 *
 * @param imageDir
 * @returns Key value array of filename => src
 */
export async function getImagesByDir(imageDir: string) {
	const srcs = await (
		await new fdir({
			pathSeparator: '/',
			includeBasePath: true,
			maxDepth: 1
		})
			.glob(`**@(jpg|webp)`)
			.crawl(imageDir)
			.withPromise()
	).map((img) => img.replace('public/', '/'))

	const images: { [id: string]: string } = {}

	for (const src of srcs) {
		const filename = path.basename(src, path.extname(src))
		images[filename] = src
	}

	return images
}
