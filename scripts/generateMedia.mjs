import { globSync } from 'glob'
import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import parallelLimit from 'async/parallelLimit.js'

const inputDir = './media'
const outputDir = './public/media'

const media = globSync(`${inputDir}/**/**/**/*`)

const widths = [
	400,
	800,
	1600,
	3200
]

const quality = 70

/**
 * Gets the mtime from one of our generated image files.
 * @param {*} filename 
 * @returns the mtime
 */
function getMtimeFromFilename(filename) {
	const existingFileName =  path.parse(filename)
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
 * Image processing tasks.
 */
const tasks = media.map((filePath) => {
	async function thing() {
		const parsedPath = path.parse(filePath)

		if (parsedPath.ext === '.jpg') {

			const inputStats = await fs.stat(filePath)

			// We use this for cache busting and determining when the file has changed
			const mtime = Math.round(inputStats.mtimeMs)
			const contentDigest = `${inputStats.ino}.${mtime}`

			const splitPath = parsedPath.dir.split('\\')
			const relativePath = splitPath.slice(1).join('/')
			
			const outputPath = `${outputDir}/${relativePath}/${parsedPath.name}`

			// Find existing full size image if it exists
			const [existingPath, changed] = hasChanged(`${outputPath}/${parsedPath.name}.*.jpg`, mtime)

			// Delete and copy if changed or not already there
			const fullImagePath = `${outputPath}/${parsedPath.name}.${mtime}.jpg`
			if (existingPath && changed) {
				await fs.unlink(existingPath)
				await fs.copyFile(filePath, fullImagePath)
				console.log(fullImagePath)
			} else if (!existingPath) {
				await fs.copyFile(filePath, fullImagePath)
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
				const inputBuffer = await fs.readFile(filePath)
				const pipeline = sharp(inputBuffer)
		
				pipeline.resize(width)
				pipeline.webp({ quality })

				console.log(`${outputPath}/${outputFile}`)

				const outputBuffer = await pipeline.toBuffer()

				await fs.outputFile(`${outputPath}/${outputFile}`, outputBuffer)

			}
		}
	}
	return thing;
})

parallelLimit(tasks, 16);
