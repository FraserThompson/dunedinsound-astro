import { globSync } from 'glob'
import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import parallelLimit from 'async/parallelLimit.js'
import Database from 'better-sqlite3'

const INPUT_DIR = 'media'
const OUTPUT_DIR = 'dist_media'
const MEDIA_DB = '.astro/media-generation.db'

// These are the widths of the image proxies generated
const widths = [400, 800, 1600, 3200]
const quality = 80
const concurrency = 30

// Dry run mode - set to true to see what would happen without actually doing it
const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('-n')
const BUILD_DB = process.argv.includes('--build-db')

// Validate mutually exclusive flags
if (DRY_RUN && BUILD_DB) {
	console.error('ERROR: --dry-run and --build-db cannot be used together')
	console.error('Use --build-db first to populate the database, then --dry-run to preview changes\n')
	process.exit(1)
}

if (DRY_RUN) {
	console.log('DRY RUN MODE - No files will be created or deleted\n')
}

if (BUILD_DB) {
	console.log('BUILD DATABASE MODE - Indexing existing output files without generating\n')
}

// Initialize SQLite database for tracking generated media
const db = new Database(MEDIA_DB)

db.exec(`
	CREATE TABLE IF NOT EXISTS generated_media (
		input_path TEXT PRIMARY KEY,
		output_dir TEXT NOT NULL,
		mtime REAL NOT NULL,
		ino INTEGER NOT NULL,
		last_generated INTEGER NOT NULL
	);
	
	CREATE INDEX IF NOT EXISTS idx_last_generated ON generated_media(last_generated);
`)

// Prepared statements
const getGenerated = db.prepare('SELECT * FROM generated_media WHERE input_path = ?')
const setGenerated = db.prepare(`
	INSERT OR REPLACE INTO generated_media (input_path, output_dir, mtime, ino, last_generated)
	VALUES (?, ?, ?, ?, ?)
`)
const deleteGenerated = db.prepare('DELETE FROM generated_media WHERE input_path = ?')

const media = globSync(`${INPUT_DIR}/**/**/**/*`)

// Build a set of current input paths for orphan detection
const currentInputPaths = new Set(media)

// Counter for dry run statistics
let regenerationCount = 0

/**
 * Checks if a file exists.
 * @param {string} path
 * @returns {Promise<boolean>}
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
 * Record existing output in database without regenerating
 * Trust that existing output is correct for current input state
 * @param {string} inputPath 
 * @param {string} outputPath 
 * @param {string} imageName
 * @param {number} mtime - Current mtime of input file
 * @param {number} ino - Current ino of input file
 * @returns {boolean} True if successfully recorded
 */
async function recordExistingInDatabase(inputPath, outputPath, imageName, mtime, ino) {
	try {
		// Check if output directory exists and has files
		const files = await fs.readdir(outputPath).catch(() => [])
		if (files.length === 0) {
			console.log(`[BUILD DB] No output files found for: ${inputPath}`)
			return false
		}
		
		// Check if we have a full JPG image (with any mtime)
		const jpgPattern = new RegExp(`^${imageName}\\.(\\d+)\\.jpg$`)
		const hasJpg = files.some(f => jpgPattern.test(f))
		
		if (!hasJpg) {
			console.log(`[BUILD DB] No JPG found for: ${inputPath}`)
			return false
		}
		
		// Check for webp files (with any inode/mtime)
		const webpPattern = /^\d+\.\d+\.\d+\.webp$/
		const webpFiles = files.filter(f => webpPattern.test(f))
		
		if (webpFiles.length < widths.length) {
			console.log(`[BUILD DB] Incomplete webp files for: ${inputPath} (found ${webpFiles.length}, expected ${widths.length})`)
			return false
		}
		
		// Trust that output is correct, record current input state
		console.log(`[BUILD DB] Recording current input state: ${inputPath}`)
		setGenerated.run(
			inputPath,
			outputPath,
			mtime,
			ino,
			Date.now()
		)
		return true
	} catch (e) {
		console.log(`[BUILD DB] Error checking output for: ${inputPath}`, e.message)
		return false
	}
}

/**
 * Clean up old output files
 * @param {string} outputPath 
 */
async function cleanupOldFiles(outputPath) {
	try {
		const oldFiles = globSync(`${outputPath}/*`)
		for (const file of oldFiles) {
			await fs.unlink(file)
		}
	} catch (e) {
		// Directory might not exist, that's fine
	}
}

/**
 * Generate responsive image files
 * @param {string} inputPath 
 * @param {string} outputPath 
 * @param {string} parsedPath 
 * @param {number} mtime 
 * @param {number} ino 
 */
async function generateImageFiles(inputPath, outputPath, parsedPath, mtime, ino) {
	await cleanupOldFiles(outputPath)

	const inputBuffer = await fs.readFile(inputPath)
	const fullImagePath = `${outputPath}/${parsedPath.name}.${mtime}.jpg`

	// Generate full image with mozjpeg
	try {
		const pipeline = sharp(inputBuffer)
		pipeline.jpeg({ mozjpeg: true, quality: 90 })
		const outputBuffer = await pipeline.toBuffer()
		await fs.outputFile(fullImagePath, outputBuffer)
		console.log(fullImagePath)
	} catch (e) {
		console.log(`ERROR ON: ${inputPath}`)
		console.log(e)
		throw e // Propagate to skip database update
	}

	// Generate width proxies
	for (const width of widths) {
		const outputFile = `${ino}.${mtime}.${width}.webp`

		try {
			const pipeline = sharp(inputBuffer)
			pipeline.resize(width)
			pipeline.webp({ quality, smartSubsample: true, preset: 'photo' })

			console.log(`${outputPath}/${outputFile}`)

			const outputBuffer = await pipeline.toBuffer()
			await fs.outputFile(`${outputPath}/${outputFile}`, outputBuffer)
		} catch (e) {
			console.log(`ERROR generating ${width}px for: ${inputPath}`)
			console.log(e)
		}
	}

	// Update database with successful generation
	setGenerated.run(
		inputPath,
		outputPath,
		mtime,
		ino,
		Date.now()
	)
}

/**
 * Check if image needs regeneration
 * @param {string} inputPath 
 * @param {string} outputPath 
 * @param {string} imageName - The image name without extension (parsedPath.name)
 * @param {number} mtime 
 * @param {number} ino 
 * @returns {Promise<boolean>}
 */
async function needsRegeneration(inputPath, outputPath, imageName, mtime, ino) {
	const cached = getGenerated.get(inputPath)
	
	if (!cached) {
		console.log(`NEW IMAGE: ${inputPath}`)
		return true
	}
	
	if (cached.mtime !== mtime || cached.ino !== ino) {
		console.log(`INPUT CHANGED: ${inputPath}`)
		return true
	}
	
	// If cached metadata matches current input, trust the cache
	// (output files may have different ino/mtime in filenames from before --build-db was run)
	return false
}

/**
 * Process an image file
 * @param {string} inputPath 
 * @param {string} basePath 
 * @param {object} parsedPath 
 * @returns {Promise<boolean>} True if regeneration happened or would happen in dry-run
 */
async function processImage(inputPath, basePath, parsedPath) {
	const inputStats = await fs.stat(inputPath)
	const mtime = Math.round(inputStats.mtimeMs)
	const ino = inputStats.ino
	const outputPath = `${basePath}/${parsedPath.name}`

	// Ensure output directory exists
	if (!DRY_RUN && !BUILD_DB) {
		await fs.mkdir(outputPath, { recursive: true })
	}

	// In BUILD_DB mode, record existing files if not already in database
	if (BUILD_DB) {
		const cached = getGenerated.get(inputPath)
		if (cached) {
			// Already in database, skip
			return false
		}
		const wasRecorded = await recordExistingInDatabase(inputPath, outputPath, parsedPath.name, mtime, ino)
		return wasRecorded
	}

	const shouldRegenerate = await needsRegeneration(inputPath, outputPath, parsedPath.name, mtime, ino)

	if (!shouldRegenerate) {
		return false // Skip, everything is up to date
	}

	if (DRY_RUN) {
		console.log(`[DRY RUN] Would regenerate: ${inputPath}`)
		// Return true to signal regeneration would happen
		return true
	}

	// Generate the files
	await generateImageFiles(inputPath, outputPath, parsedPath, mtime, ino)
	return true // Signal that generation happened
}

/**
 * Process a non-image file (copy if changed)
 * @param {string} inputPath 
 * @param {string} basePath 
 * @param {object} parsedPath 
 */
async function processOtherFile(inputPath, basePath, parsedPath) {
	const outputPath = `${basePath}/${parsedPath.base}`

	if (await fileExists(outputPath)) {
		const inputStats = await fs.stat(inputPath)
		const outputStats = await fs.stat(outputPath)

		if (outputStats.mtimeMs >= inputStats.mtimeMs) {
			return // Skip because it hasn't changed
		}
	}

	if (DRY_RUN) {
		console.log(`[DRY RUN] Would copy: ${outputPath}`)
		return
	}

	await fs.copyFile(inputPath, outputPath)
	console.log(outputPath)
}

/**
 * Clean up orphaned database entries and output files
 */
function cleanupOrphans() {
	console.log('\nCleaning up orphaned files...')
	const allTracked = db.prepare('SELECT input_path, output_dir FROM generated_media').all()
	let orphansRemoved = 0
	
	for (const entry of allTracked) {
		if (!currentInputPaths.has(entry.input_path)) {
			if (DRY_RUN) {
				console.log(`[DRY RUN] Would remove orphaned output: ${entry.output_dir}`)
				orphansRemoved++
			} else {
				try {
					if (fs.existsSync(entry.output_dir)) {
						fs.removeSync(entry.output_dir)
						console.log(`Removed orphaned output: ${entry.output_dir}`)
					}
					deleteGenerated.run(entry.input_path)
					orphansRemoved++
				} catch (e) {
					console.warn(`Failed to remove orphan ${entry.output_dir}:`, e.message)
				}
			}
		}
	}
	
	if (orphansRemoved > 0) {
		console.log(`Removed ${orphansRemoved} orphaned entries`)
	}
}

/**
 * Print statistics about the run
 * @param {number} startTime 
 * @param {number} regenerationCount - Number of images that would be/were regenerated
 */
function printStats(startTime, regenerationCount) {
	const duration = ((Date.now() - startTime) / 1000).toFixed(2)
	console.log(`\nCompleted in ${duration}s`)
	
	const totalTracked = db.prepare('SELECT COUNT(*) as total FROM generated_media').get().total
	
	console.log(`\nTotal tracked images: ${totalTracked}`)
	
	if (DRY_RUN) {
		console.log(`Would regenerate: ${regenerationCount} images`)
	} else if (BUILD_DB) {
		console.log(`Indexed this run: ${regenerationCount}`)
	} else {
		console.log(`Generated this run: ${regenerationCount}`)
	}
}

/**
 * Create media processing task for a single file
 * @param {string} inputPath 
 * @returns {Function}
 */
function createProcessingTask(inputPath) {
	return async function() {
		const parsedPath = path.parse(inputPath)
		const splitPath = parsedPath.dir.split('\\')
		const relativePath = splitPath.slice(1).join('/')
		const basePath = `${OUTPUT_DIR}/${relativePath}`

		// Ensure output directory exists
		if (!DRY_RUN) {
			await fs.mkdir(basePath, { recursive: true })
		}

		const isImage = parsedPath.ext.toLowerCase() === '.jpg' || parsedPath.ext.toLowerCase() === '.png'
		
		if (isImage) {
			const wasRegenerated = await processImage(inputPath, basePath, parsedPath)
			if (wasRegenerated) {
				regenerationCount++
			}
		} else if (parsedPath.ext) {
			await processOtherFile(inputPath, basePath, parsedPath)
		}
	}
}

const tasks = media.map(createProcessingTask)

// Run tasks with concurrency limit
console.log(`Processing ${tasks.length} media files...`)
const startTime = Date.now()

parallelLimit(tasks, concurrency, (err) => {
	if (err) {
		console.error('Error processing media:', err)
		db.close()
		process.exit(1)
	}
	
	printStats(startTime, regenerationCount)
	cleanupOrphans()
	
	db.close()
})
