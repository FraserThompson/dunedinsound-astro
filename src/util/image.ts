import { fdir } from 'fdir'
import * as path from 'node:path'
import { ResponsiveImage } from './ResponsiveImage'

/**
 * Returns a responsive image object from a responsive image directory.
 *
 * @param imageDir
 * @returns ResponsiveImage object
 */
export async function getResponsiveImage(imageDir: string): Promise<ResponsiveImage | undefined> {
	const srcs = (
		await new fdir({
			pathSeparator: '/',
			includeBasePath: true
		})
			.glob('**@(jpg|webp)')
			.crawl(imageDir)
			.withPromise()
	).map((src) => `/${src}`)

	return srcs.length > 1 ? new ResponsiveImage(srcs) : undefined
}

/**
 * Gets all responsive images from a directory of responsive image directories.
 *
 * @param dir Dir to look in
 * @param alt Alt text (optional)
 * @returns Key/value array keyed by image name of ResponsiveImage objects.
 */
export async function getResponsiveImagesByDir(
	dir: string,
	alt?: string
): Promise<{ [id: string]: ResponsiveImage } | undefined> {
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
	if (mediaDirs.length <= 1) return

	let images: { [id: string]: ResponsiveImage } = {}

	// Get all responsive image entities
	for (const group of mediaDirs) {
		if (!group.files.length) continue
		const files = group.files.map((src) => `/${src}`)
		const filename = path.basename(group.directory)
		images[filename] = new ResponsiveImage(files, alt)
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
	const srcs = (
		await new fdir({
			pathSeparator: '/',
			includeBasePath: true,
			maxDepth: 1
		})
			.glob(`**@(jpg|webp)`)
			.crawl(imageDir)
			.withPromise()
	).map((src) => `/${src}`)

	const images: { [id: string]: string } = {}

	for (const src of srcs) {
		const filename = path.basename(src, path.extname(src))
		images[filename] = src
	}

	return images
}
