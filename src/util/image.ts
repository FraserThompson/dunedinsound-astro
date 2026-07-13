import { fdir } from 'fdir'
import * as path from 'node:path'
import { ResponsiveImage } from './ResponsiveImage'
import {
	getImageCache,
	setImageCache,
	logImageCacheEvent,
	shouldValidateImageCacheThisSession,
	validateImageSrcsExist
} from './imageCache'


async function getResponsiveImageDirectoryKeys(dir: string): Promise<string[]> {
	const mediaDirs = await new fdir({
		pathSeparator: '/',
		includeBasePath: true,
		maxDepth: 2
	})
		.group()
		.glob(`**/**@(jpg|webp)`)
		.crawl(dir)
		.withPromise()

	const keys = new Set<string>()
	for (const group of mediaDirs) {
		if (!group.files.length) continue
		keys.add(path.basename(group.directory))
	}

	return [...keys]
}

/**
 * Returns a responsive image object from a responsive image directory.
 *
 * @param imageDir
 * @returns ResponsiveImage object
 */
export async function getResponsiveImage(imageDir: string): Promise<ResponsiveImage | undefined> {
	const startTime = performance.now()
	type CachedData = { srcs: string[], alt?: string } | null

	// Check SQLite cache
	try {
		const data = getImageCache<CachedData>(imageDir, 'responsiveImage')

		if (data !== undefined) {
			const time = performance.now() - startTime

			if (!data) {
				// No images previously found. Check if files exist now on disk; if so, regenerate cache.
				const existing = (
					await new fdir({
						pathSeparator: '/',
						includeBasePath: true,
						maxDepth: 1
					})
						.glob('**@(jpg|webp)')
						.crawl(imageDir)
						.withPromise()
				)
				if (existing.length > 0) {
					console.log(`New images found in ${imageDir}, regenerating cached null`)
					// Fall through to regenerate
				} else {
					logImageCacheEvent('responsiveImage', 'hit', time)
					return undefined
				}
			} else {
				// Validate and reconstruct (need > 1 image for responsive image)
				if (!data.srcs || !Array.isArray(data.srcs) || data.srcs.length <= 1) {
					console.warn(`Invalid cached image data for ${imageDir}, regenerating`)
					// Fall through to regenerate
				} else if (
					shouldValidateImageCacheThisSession(imageDir, 'responsiveImage') &&
					!validateImageSrcsExist(data.srcs)
				) {
					// If any of the cached image files no longer exist, invalidate the cache and regenerate
					console.warn(`Cached image files missing for ${imageDir}, regenerating`)
				} else {
					const result = new ResponsiveImage(data.srcs, data.alt)
					logImageCacheEvent('responsiveImage', 'hit', time)
					return result
				}
			}
		}
	} catch (e) {
		console.warn(`Cache read error for ${imageDir}:`, e)
	}

	// Generate fresh data
	const srcs = (
		await new fdir({
			pathSeparator: '/',
			includeBasePath: true
		})
			.glob('**@(jpg|webp)')
			.crawl(imageDir)
			.withPromise()
	).map((src) => `/${src}`)

	const result = srcs.length > 1 ? new ResponsiveImage(srcs) : undefined
	const cacheData: CachedData = result ? { srcs, alt: result.alt } : null

	// Store in SQLite
	try {
		setImageCache(imageDir, 'responsiveImage', cacheData)
	} catch (e) {
		console.warn(`Cache write error for ${imageDir}:`, e)
	}

	const time = performance.now() - startTime
	logImageCacheEvent('responsiveImage', 'miss', time)
	return result
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
	const startTime = performance.now()
	type CachedData = Record<string, { srcs: string[], alt?: string }> | null

	// Check SQLite cache
	try {
		const data = getImageCache<CachedData>(dir, 'responsiveImages')

		if (data !== undefined) {
			const time = performance.now() - startTime

			if (!data) {
				// No images previously found. Check if files exist now on disk; if so, regenerate cache.
				const mediaDirs = await new fdir({
					pathSeparator: '/',
					includeBasePath: true,
					maxDepth: 2
				})
					.group()
					.glob(`**/**@(jpg|webp)`)
					.crawl(dir)
					.withPromise()

				if (mediaDirs.length <= 1) {
					logImageCacheEvent('responsiveImages', 'hit', time)
					return undefined
				}
				// Fall through to regenerate
			} else {
				// Handle empty object (directory with no valid images)
				if (Object.keys(data).length === 0) {
					logImageCacheEvent('responsiveImages', 'hit', time)
					return undefined
				}

				const shouldValidate = shouldValidateImageCacheThisSession(dir, 'responsiveImages')

				if (shouldValidate) {
					const diskKeys = await getResponsiveImageDirectoryKeys(dir)
					const cachedKeys = new Set(Object.keys(data))
					const hasNewKeys = diskKeys.some((key) => !cachedKeys.has(key))
					const hasMissingKeys = Object.keys(data).some((key) => !diskKeys.includes(key))

					if (hasNewKeys) {
						console.warn(`New responsive image directories found for ${dir}, regenerating directory cache`)
					} else if (hasMissingKeys) {
						console.warn(`Some cached responsive image directories missing for ${dir}, regenerating directory cache`)
					}

					if (hasNewKeys || hasMissingKeys) {
						// directory set changed; fall through to regenerate
					} else {
						// Reconstruct ResponsiveImage objects from cached data
						const images: { [id: string]: ResponsiveImage } = {}
						let invalidCachedData = false
						for (const [key, imgData] of Object.entries(data)) {
							// Validate cached data structure
							if (!imgData?.srcs || !Array.isArray(imgData.srcs) || imgData.srcs.length === 0) {
								console.warn(`Invalid cached image data for ${key} in ${dir}, skipping`)
								continue
							}
							if (!validateImageSrcsExist(imgData.srcs)) {
								console.warn(`Cached image files missing for ${key} in ${dir}, regenerating directory cache`)
								invalidCachedData = true
								break
							}
							images[key] = new ResponsiveImage(imgData.srcs, imgData.alt)
						}

						if (!invalidCachedData) {
							if (Object.keys(images).length === 0) {
								logImageCacheEvent('responsiveImages', 'hit', time)
								return undefined
							}
							logImageCacheEvent('responsiveImages', 'hit', time)
							return images
						}
					}
				} else {
					// Reconstruct ResponsiveImage objects from cached data
					const images: { [id: string]: ResponsiveImage } = {}
					for (const [key, imgData] of Object.entries(data)) {
						// Validate cached data structure
						if (!imgData?.srcs || !Array.isArray(imgData.srcs) || imgData.srcs.length === 0) {
							console.warn(`Invalid cached image data for ${key} in ${dir}, skipping`)
							continue
						}
						images[key] = new ResponsiveImage(imgData.srcs, imgData.alt)
					}

					// If no valid images after reconstruction, return undefined
					if (Object.keys(images).length === 0) {
						logImageCacheEvent('responsiveImages', 'hit', time)
						return undefined
					}
					logImageCacheEvent('responsiveImages', 'hit', time)
					return images
				}
			}
		}
	} catch (e) {
		console.warn(`Cache read error for ${dir}:`, e)
	}

	// Generate fresh data
	const mediaDirs = await new fdir({
		pathSeparator: '/',
		includeBasePath: true
	})
		.group()
		.glob(`**/**@(jpg|webp)`)
		.crawl(dir)
		.withPromise()

	// It always returns itself, so this is 1 not 0
	if (mediaDirs.length <= 1) {
		try {
			setImageCache<CachedData>(dir, 'responsiveImages', null)
		} catch (e) {
			console.warn(`Cache write error for ${dir}:`, e)
		}

		const time = performance.now() - startTime
		logImageCacheEvent('responsiveImages', 'miss', time)
		return undefined
	}

	const images: { [id: string]: ResponsiveImage } = {}
	const cacheData: Record<string, { srcs: string[], alt?: string }> = {}

	// Get all responsive image entities
	for (const group of mediaDirs) {
		if (!group.files.length) continue
		const files = group.files.map((src) => `/${src}`)
		const filename = path.basename(group.directory)
		images[filename] = new ResponsiveImage(files, alt)
		cacheData[filename] = { srcs: files, alt }
	}

	// Store in SQLite
	try {
		setImageCache(dir, 'responsiveImages', cacheData)
	} catch (e) {
		console.warn(`Cache write error for ${dir}:`, e)
	}

	const time = performance.now() - startTime
	logImageCacheEvent('responsiveImages', 'miss', time)
	return images
}

/**
 * Gets raw image src's from a directory.
 *
 * @param imageDir
 * @returns Key value array of filename => src
 */
export async function getImagesByDir(imageDir: string) {
	const startTime = performance.now()
	type CachedData = { [id: string]: string }

	// Check SQLite cache
	try {
		const data = getImageCache<CachedData>(imageDir, 'images')
		if (data !== undefined) {
			const time = performance.now() - startTime

			// Empty cache entries can become stale if files were added later.
			if (Object.keys(data).length === 0) {
				const existing = await new fdir({
					pathSeparator: '/',
					includeBasePath: true,
					maxDepth: 1
				})
					.glob(`**@(jpg|webp)`)
					.crawl(imageDir)
					.withPromise()

				if (existing.length === 0) {
					logImageCacheEvent('images', 'hit', time)
					return data
				}

				console.log(`New images found in ${imageDir}, regenerating cached empty images`)
			}

			// Validate that each cached image file still exists on disk
			const srcs = Object.values(data)
			if (shouldValidateImageCacheThisSession(imageDir, 'images') && !validateImageSrcsExist(srcs)) {
				console.warn(`Cached images for ${imageDir} contain missing files; regenerating`)
			} else {
				logImageCacheEvent('images', 'hit', time)
				return data
			}
		}
	} catch (e) {
		console.warn(`Cache read error for ${imageDir}:`, e)
	}

	// Generate fresh data
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

	// Store in SQLite
	try {
		setImageCache(imageDir, 'images', images)
	} catch (e) {
		console.warn(`Cache write error for ${imageDir}:`, e)
	}

	const time = performance.now() - startTime
	logImageCacheEvent('images', 'miss', time)
	return images
}
