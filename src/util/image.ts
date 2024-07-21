import fg from 'fast-glob'
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

		const parsedImages = images.reduce((acc: any, src: string) => {
			const pathComponents = src.split('.')
			if (pathComponents.length > 2) {
				const w = pathComponents[pathComponents.length - 2]
				acc[0] += `${src} ${w}w,`
				acc[1][w.toString()] = src
			} else {
				this.src = src
			}
			return acc
		}, ['', {}] as any)

		this.srcset = parsedImages[0]
		this.images = parsedImages[1]
	}

}


/**
 * Gets all image paths from a directory and returns a ResponsiveImage object containing those.
 * 
 * @param imageDir
 * @returns ResponsiveImage object
 */
export async function getResponsiveImages(imageDir: string): Promise<ResponsiveImage> {
	const srcs = (await fg.glob(`${imageDir}/*.{jpg,webp}`)).map((img) => img.replace('public/', '/'))
	return new ResponsiveImage(srcs)
}

/**
 * Gets all responsive images from a directory of responsive image directories.
 * 
 * @param dir Dir to look in
 * @returns Key/value array keyed by image name of ResponsiveImage objects.
 */
export async function getResponsiveImagesByDir(dir: string) {
	let images: { [id: string]: ResponsiveImage } = {}

	// Find media dirs for this entry (if it exists)
	const mediaDirs = await fg.glob(`${dir}/*`, {
		onlyDirectories: true
	})

	// Get all responsive image entities
	for (const dir of mediaDirs) {
		const filename = path.basename(dir)
		images[filename] = await getResponsiveImages(dir)
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
	const srcs = await (await fg.glob(`${imageDir}/*.{jpg,webp}`)).map((img) => img.replace('public/', '/'))

	const images: { [id: string]: string } = {}

	for (const src of srcs) {
		const filename = path.basename(src, path.extname(src))
		images[filename] = src
	}

	console.log(images)

	return images
}
