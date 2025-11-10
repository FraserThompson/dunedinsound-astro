import { fdir } from 'fdir'
import * as path from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import Database from 'better-sqlite3'
import { ResponsiveImage } from './ResponsiveImage'

const CACHE_DB = '.astro/image-cache.db'
const CACHE_VERSION = 1 // Increment to invalidate all caches

// In-memory caches (for current build)
const cachedResponsiveImage: Record<string, ResponsiveImage | undefined> = {}
const cachedResponsiveImages: Record<string, { [id: string]: ResponsiveImage } | undefined> = {}
const cachedImages: Record<string, { [id: string]: string }> = {}

// Cache statistics
const stats = {
	responsiveImage: { memoryHits: 0, sqliteHits: 0, misses: 0, totalTime: 0 },
	responsiveImages: { memoryHits: 0, sqliteHits: 0, misses: 0, totalTime: 0 },
	images: { memoryHits: 0, sqliteHits: 0, misses: 0, totalTime: 0 }
}

const STATS_LOG_INTERVAL = 100 // Log every N requests
const CACHE_BUILD_LOG_INTERVAL = 10 // Log cache building progress more frequently
let cacheBuilding = false
let cacheBuildStartTime = 0

function logCacheEvent(type: keyof typeof stats, event: 'memory' | 'sqlite' | 'miss', time: number) {
	const data = stats[type]
	
	if (event === 'memory') data.memoryHits++
	else if (event === 'sqlite') data.sqliteHits++
	else data.misses++
	
	data.totalTime += time
	
	const total = data.memoryHits + data.sqliteHits + data.misses
	
	// Detect if we're building cache (high miss rate early on)
	if (!cacheBuilding && data.misses === 1) {
		cacheBuilding = true
		cacheBuildStartTime = performance.now()
		console.log(`\n🔨 Building image cache for ${type}...`)
	}
	
	// More frequent logging during cache build
	const interval = cacheBuilding && data.misses < 50 ? CACHE_BUILD_LOG_INTERVAL : STATS_LOG_INTERVAL
	
	// Log every N requests or on first miss
	if (total % interval === 0 || (event === 'miss' && data.misses <= 5)) {
		const memPct = ((data.memoryHits / total) * 100).toFixed(1)
		const sqlitePct = ((data.sqliteHits / total) * 100).toFixed(1)
		const missPct = ((data.misses / total) * 100).toFixed(1)
		const avgTime = (data.totalTime / total).toFixed(2)
		
		const elapsed = ((performance.now() - cacheBuildStartTime) / 1000).toFixed(1)
		const prefix = cacheBuilding && data.misses > 5 ? `  [${elapsed}s] ` : ''
		
		console.log(`${prefix}[${type}] ${total} reqs | Mem: ${memPct}% | SQLite: ${sqlitePct}% | Miss: ${missPct}% | Avg: ${avgTime}ms`)
		
		// Stop "building" mode when hit rate improves
		if (cacheBuilding && data.sqliteHits > data.misses) {
			console.log(`✅ Cache built for ${type} (${elapsed}s)\n`)
			cacheBuilding = false
		}
	}
}

// Initialize SQLite database
const cacheDir = path.dirname(CACHE_DB)
if (!existsSync(cacheDir)) {
	mkdirSync(cacheDir, { recursive: true })
}

const db = new Database(CACHE_DB)

// Create tables if they don't exist
db.exec(`
	CREATE TABLE IF NOT EXISTS cache (
		path TEXT PRIMARY KEY,
		type TEXT NOT NULL,
		data TEXT NOT NULL,
		version INTEGER NOT NULL
	);
	
	CREATE INDEX IF NOT EXISTS idx_cache_type ON cache(type);
	CREATE INDEX IF NOT EXISTS idx_cache_version ON cache(version);
`)

// Prepared statements for performance
const getStmt = db.prepare('SELECT data, version FROM cache WHERE path = ? AND type = ?')
const setStmt = db.prepare(`
	INSERT OR REPLACE INTO cache (path, type, data, version)
	VALUES (?, ?, ?, ?)
`)
const deleteOldVersionsStmt = db.prepare('DELETE FROM cache WHERE version != ?')

// Clean up old cache versions on startup
deleteOldVersionsStmt.run(CACHE_VERSION)

/**
 * Returns a responsive image object from a responsive image directory.
 *
 * @param imageDir
 * @returns ResponsiveImage object
 */
export async function getResponsiveImage(imageDir: string): Promise<ResponsiveImage | undefined> {
	const startTime = performance.now()
	type CachedData = { srcs: string[], alt?: string } | null
	
	// Check in-memory cache first (stores ResponsiveImage objects)
	if (imageDir in cachedResponsiveImage) {
		const time = performance.now() - startTime
		logCacheEvent('responsiveImage', 'memory', time)
		return cachedResponsiveImage[imageDir]
	}

	// Check SQLite cache (stores serializable data)
	try {
		const cached = getStmt.get(imageDir, 'responsiveImage') as { data: string; version: number } | undefined
		
		if (cached && cached.version === CACHE_VERSION) {
			const data = JSON.parse(cached.data) as CachedData
			
			if (!data) {
				cachedResponsiveImage[imageDir] = undefined
				const time = performance.now() - startTime
				logCacheEvent('responsiveImage', 'sqlite', time)
				return undefined
			}
			
			// Validate and reconstruct
			if (!data.srcs || !Array.isArray(data.srcs) || data.srcs.length === 0) {
				console.warn(`Invalid cached image data for ${imageDir}, regenerating`)
			} else {
				const result = new ResponsiveImage(data.srcs, data.alt)
				cachedResponsiveImage[imageDir] = result
				const time = performance.now() - startTime
				logCacheEvent('responsiveImage', 'sqlite', time)
				return result
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
	
	// Store in memory cache (ResponsiveImage) and SQLite (serializable data)
	cachedResponsiveImage[imageDir] = result
	
	try {
		setStmt.run(imageDir, 'responsiveImage', JSON.stringify(cacheData), CACHE_VERSION)
	} catch (e) {
		console.warn(`Cache write error for ${imageDir}:`, e)
	}
	
	const time = performance.now() - startTime
	logCacheEvent('responsiveImage', 'miss', time)
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
	
	// Check in-memory cache first (stores ResponsiveImage objects)
	if (dir in cachedResponsiveImages) {
		const time = performance.now() - startTime
		logCacheEvent('responsiveImages', 'memory', time)
		return cachedResponsiveImages[dir]
	}

	// Check SQLite cache (stores serializable data)
	try {
		const cached = getStmt.get(dir, 'responsiveImages') as { data: string; version: number } | undefined
		
		if (cached && cached.version === CACHE_VERSION) {
			const data = JSON.parse(cached.data) as CachedData
			
			if (!data) {
				cachedResponsiveImages[dir] = undefined
				const time = performance.now() - startTime
				logCacheEvent('responsiveImages', 'sqlite', time)
				return undefined
			}
			
			// Handle empty object (directory with no valid images)
			if (Object.keys(data).length === 0) {
				cachedResponsiveImages[dir] = undefined
				const time = performance.now() - startTime
				logCacheEvent('responsiveImages', 'sqlite', time)
				return undefined
			}
			
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
				cachedResponsiveImages[dir] = undefined
				const time = performance.now() - startTime
				logCacheEvent('responsiveImages', 'sqlite', time)
				return undefined
			}
			
			cachedResponsiveImages[dir] = images
			const time = performance.now() - startTime
			logCacheEvent('responsiveImages', 'sqlite', time)
			return images
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
		cachedResponsiveImages[dir] = undefined
		
		try {
			setStmt.run(dir, 'responsiveImages', JSON.stringify(null), CACHE_VERSION)
		} catch (e) {
			console.warn(`Cache write error for ${dir}:`, e)
		}
		
		const time = performance.now() - startTime
		logCacheEvent('responsiveImages', 'miss', time)
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

	// Store in memory cache (ResponsiveImage objects) and SQLite (serializable data)
	cachedResponsiveImages[dir] = images
	
	try {
		setStmt.run(dir, 'responsiveImages', JSON.stringify(cacheData), CACHE_VERSION)
	} catch (e) {
		console.warn(`Cache write error for ${dir}:`, e)
	}
	
	const time = performance.now() - startTime
	logCacheEvent('responsiveImages', 'miss', time)
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
	
	// Check in-memory cache first (stores final result objects)
	if (imageDir in cachedImages) {
		const time = performance.now() - startTime
		logCacheEvent('images', 'memory', time)
		return cachedImages[imageDir]
	}

	// Check SQLite cache (stores same data since it's already serializable)
	try {
		const cached = getStmt.get(imageDir, 'images') as { data: string; version: number } | undefined
		if (cached && cached.version === CACHE_VERSION) {
			const data = JSON.parse(cached.data) as CachedData
			cachedImages[imageDir] = data
			const time = performance.now() - startTime
			logCacheEvent('images', 'sqlite', time)
			return data
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

	// Store in memory cache and SQLite (same format since already serializable)
	cachedImages[imageDir] = images
	
	try {
		setStmt.run(imageDir, 'images', JSON.stringify(images), CACHE_VERSION)
	} catch (e) {
		console.warn(`Cache write error for ${imageDir}:`, e)
	}
	
	const time = performance.now() - startTime
	logCacheEvent('images', 'miss', time)
	return images
}
