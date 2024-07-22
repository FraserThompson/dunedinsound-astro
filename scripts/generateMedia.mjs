import { globSync } from 'glob'
import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import parallelLimit from 'async/parallelLimit.js'

const inputDir = './media'
const outputDir = './public/media'

const media = globSync(`${inputDir}/**/**/**/*`)

const widths = [400, 800, 1600, 3200]

const quality = 70

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
 * Determins if a generated image has changed compared to another one.
 * @param {*} path path to glob
 * @param {*} mTime mtime of comparison file
 * @returns tuple of found file path and whether it's changed.
 */
function hasChanged(path, mTime) {
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
 */
const tasks = media.map((inputPath) => {
	async function thing() {
		const parsedPath = path.parse(inputPath)
		const splitPath = parsedPath.dir.split('\\')
		const relativePath = splitPath.slice(1).join('/')

		// Create proxies from input images
		if (parsedPath.ext === '.jpg') {
			const inputStats = await fs.stat(inputPath)

			// We use this for cache busting and determining when the file has changed
			const mtime = Math.round(inputStats.mtimeMs)
			const contentDigest = `${inputStats.ino}.${mtime}`

			const outputPath = `${outputDir}/${relativePath}/${parsedPath.name}`

			// Find existing full size image if it exists
			const [existingPath, changed] = hasChanged(`${outputPath}/${parsedPath.name}.*.jpg`, mtime)

			// Delete and copy if changed or not already there
			const fullImagePath = `${outputPath}/${parsedPath.name}.${mtime}.jpg`
			if (existingPath && changed) {
				await fs.unlink(existingPath)
				await fs.copyFile(inputPath, fullImagePath)
				console.log(fullImagePath)
			} else if (!existingPath) {
				await fs.copyFile(inputPath, fullImagePath)
				console.log(fullImagePath)
			}

			for (const width of widths) {
				const outputFile = `${contentDigest}.${width}.webp`

				// Find existing proxy if it exists
				const [existingPath, changed] = hasChanged(`${outputPath}/${inputStats.ino}.*.${width}.webp`, mtime)

				// Delete and re-copy if changed, else skip if it's there
				if (existingPath && changed) {
					await fs.unlink(existingFilePath)
				} else if (existingPath) {
					return
				}

				// Resize the image
				const inputBuffer = await fs.readFile(inputPath)
				const pipeline = sharp(inputBuffer)

				pipeline.resize(width)
				pipeline.webp({ quality })

				console.log(`${outputPath}/${outputFile}`)

				const outputBuffer = await pipeline.toBuffer()

				await fs.outputFile(`${outputPath}/${outputFile}`, outputBuffer)
			}
		} else if (parsedPath.ext) {
			// For all other files just copy them as is if they've changed
			const outputPath = `${outputDir}/${relativePath}/${parsedPath.base}`

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

parallelLimit(tasks, 16)
