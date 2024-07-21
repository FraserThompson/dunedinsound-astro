import { globSync } from 'glob'
import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import parallelLimit from 'async/parallelLimit.js'

const inputDir = './media'
const outputDir = '.\\public\\media'

const media = globSync(`${inputDir}/**/**/**/*`)

const widths = [
	400,
	800,
	1600,
	3200
]

const quality = 70

const tasks = media.map((filePath) => {
	async function thing() {
		const parsedPath = path.parse(filePath)

		if (parsedPath.ext === '.jpg') {

			const inputStats = await fs.stat(filePath)

			const splitPath = parsedPath.dir.split('\\')
			const relativePath = splitPath.slice(1).join('\\')
			
			for (const width of widths) {
				const outputFile = `${parsedPath.name}.${width}`

				const outputPath = `${outputDir}\\${relativePath}\\${parsedPath.name}\\${outputFile}.webp`

				let fileExists = true;
				try {
					await fs.access(outputPath)
				} catch (error) {
					// File doesn't exist
					fileExists = false;
				}
		
				if (fileExists) {
					const existingStats = await fs.stat(outputPath)
					if (existingStats.mtimeMs >= inputStats.mtimeMs) return
				}

				console.log(outputPath)
		
				const inputBuffer = await fs.readFile(filePath)
				const pipeline = sharp(inputBuffer)
		
				pipeline.resize(width)
				pipeline.webp({ quality })
		
				const outputBuffer = await pipeline.toBuffer()
				await fs.outputFile(outputPath, outputBuffer)
			}
		}
	}
	return thing;
})

parallelLimit(tasks, 16);
