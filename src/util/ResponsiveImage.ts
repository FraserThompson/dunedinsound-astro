/**
 * ResponsiveImage
 *
 * Takes an array of image paths and turns it into a helpful object we can
 * use to display a responsive image via srcset attributes.
 *
 * Expects the filenames to follow this format: [anything].[width].[webp]
 */
export class ResponsiveImage {
	// The filename without width or extension
	public name: string

	// Key value array of width => src
	public images: { [key: string]: string }

	// Srcset string to use on <img> element
	public srcset: string

	// Link to full image
	public src: string

	public alt?: string

	constructor(images: string[], alt?: string) {
		this.src = ''
		this.alt = alt
		this.name = images[0].split('.')[0]

		const parsedImages = images.reduce(
			(acc: any, src: string) => {
				const pathComponents = src.split('.')
				const ext = pathComponents[pathComponents.length - 1]
				if (pathComponents.length > 2 && ext === 'webp') {
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
