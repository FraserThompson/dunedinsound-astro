import { globSync } from 'glob'
import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import parallelLimit from 'async/parallelLimit.js'

const DIST_MEDIA_DIR = 'dist_media'
const inputDir = 'media'
const outputDir = DIST_MEDIA_DIR

const media = globSync(`${inputDir}/**/**/**/*`)

const widths = [400, 800, 1600, 3200]

const quality = 80

/**
 * Checks if a file exists.
 * @param {*} path
 * @returns true/false
 */
async function fileExists(path) {
	try {
		await fs.promises.access(path)
		return true
	} catch (error) {
		return false
	}
}

/**
 * Gets the mtime from one of our generated image files.
 * @param {*} filename
 * @returns the mtime
 */
function getMtimeFromFilename(filename) {
	const existingFileName = path.parse(filename)
	return existingFileName.name.split('.')[1]
}

/**
 * Determines if a generated image proxy has changed compared to another one.
 *
 * @param {*} path path to glob
 * @param {*} mTime mtime of comparison file
 * @returns tuple of found file path and whether it's changed.
 */
function hasImageProxyChanged(path, mTime) {
	const globResult = globSync(path)
	if (globResult.length) {
		// Extract the mtime string from the filename
		const existingPath = globResult[0]
		const existingMtime = getMtimeFromFilename(existingPath)

		// If the existing file is older return true
		if (existingMtime < mTime) {
			return [existingPath, true]
		} else {
			return [existingPath, false]
		}
	}

	return [null, false]
}

/**
 * Media processing tasks.
 *
 * Converts each input image into:
 *  - proxies for each filesize
 *  - a full image converted to mozjpeg
 *
 * Copies over all other files as is.
 */
const tasks = media.map((inputPath) => {
	async function thing() {
		const parsedPath = path.parse(inputPath)
		const splitPath = parsedPath.dir.split('\\')
		const relativePath = splitPath.slice(1).join('/')

		const basePath = `${outputDir}/${relativePath}`

		// Ensure output directory exists
		await fs.mkdir(basePath, { recursive: true })

		// Create proxies from input images
		if (parsedPath.ext === '.jpg') {
			const inputStats = await fs.stat(inputPath)

			// We use this for cache busting and determining when the file has changed
			const mtime = Math.round(inputStats.mtimeMs)
			const contentDigest = `${inputStats.ino}.${mtime}`

			const outputPath = `${basePath}/${parsedPath.name}`

			// Ensure output directory exists
			await fs.mkdir(outputPath, { recursive: true })

			// Find existing full size image if it exists
			const [existingPath, changed] = hasImageProxyChanged(`${outputPath}/${parsedPath.name}.*.jpg`, mtime)

			// If it hasn't changed we don't need to do anything
			if (existingPath && !changed) return

			// Delete full image if there already
			if (existingPath) {
				await fs.unlink(existingPath)
			}

			const inputBuffer = await fs.readFile(inputPath)

			// Path to the full image
			const fullImagePath = `${outputPath}/${parsedPath.name}.${mtime}.jpg`

			// Copy and compress the full image using mozjpeg to save a few bucks
			const pipeline = sharp(inputBuffer)
			pipeline.jpeg({ mozjpeg: true, quality: 90 })
			const outputBuffer = await pipeline.toBuffer()
			await fs.outputFile(fullImagePath, outputBuffer)

			console.log(fullImagePath)

			// Process into width proxies
			for (const width of widths) {
				const outputFile = `${contentDigest}.${width}.webp`

				// Find existing proxy if it exists (we already know the input changed so we don't need to check that)
				const [existingPath] = hasImageProxyChanged(`${outputPath}/${inputStats.ino}.*.${width}.webp`, mtime)

				// Delete if already there
				if (existingPath) {
					await fs.unlink(existingPath)
				}

				// Resize and compress the image
				const pipeline = sharp(inputBuffer)
				pipeline.resize(width)
				pipeline.webp({ quality, smartSubsample: true, preset: 'photo' })

				console.log(`${outputPath}/${outputFile}`)

				const outputBuffer = await pipeline.toBuffer()

				await fs.outputFile(`${outputPath}/${outputFile}`, outputBuffer)
			}
		} else if (parsedPath.ext) {
			// For all other files just copy them as is if they've changed
			const outputPath = `${basePath}/${parsedPath.base}`

			if (await fileExists(outputPath)) {
				const inputStats = await fs.stat(inputPath)
				const outputStats = await fs.stat(outputPath)

				if (outputStats.mtimeMs >= inputStats.mtimeMs) {
					// Skip because it hasn't changed
					return
				}
			}

			await fs.copyFile(inputPath, outputPath)
			console.log(outputPath)
		}
	}

	return thing
})

parallelLimit(tasks, 24)
