import { fdir } from 'fdir'
import * as path from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import Database from 'better-sqlite3'
import { ResponsiveImage } from './ResponsiveImage'

const CACHE_DB = '.astro/image-cache.db'
const CACHE_VERSION = 1 // Increment to invalidate all caches

// Simple stats tracking
type CacheStats = {
	hits: number
	misses: number
	totalTime: number
}

const stats: Record<string, CacheStats> = {
	responsiveImage: { hits: 0, misses: 0, totalTime: 0 },
	responsiveImages: { hits: 0, misses: 0, totalTime: 0 },
	images: { hits: 0, misses: 0, totalTime: 0 }
}

let statsLoggedAt = 0
const STATS_LOG_INTERVAL = 100 // Log every N requests

function logCacheEvent(type: string, event: 'hit' | 'miss', time: number) {
	const data = stats[type]
	
	if (event === 'hit') data.hits++
	else data.misses++
	
	data.totalTime += time
	
	const total = data.hits + data.misses
	
	// Log every N requests to avoid spam in dev mode
	if (total - statsLoggedAt >= STATS_LOG_INTERVAL) {
		const hitPct = ((data.hits / total) * 100).toFixed(1)
		const missPct = ((data.misses / total) * 100).toFixed(1)
		const avgTime = (data.totalTime / total).toFixed(2)
		
		console.log(`[${type}] ${total} reqs | Hit: ${hitPct}% | Miss: ${missPct}% | Avg: ${avgTime}ms`)
		statsLoggedAt = total
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
		path TEXT NOT NULL,
		type TEXT NOT NULL,
		data TEXT NOT NULL,
		version INTEGER NOT NULL,
		PRIMARY KEY (path, type)
	);
	
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

// Helper to map a cached src (string like '/audio/artist/cover.jpg') -> file system path
function cachedSrcToFsPath(src: string) {
	// Remove leading slash if present
	const trimmed = src.replace(/^\//, '')

	// Resolve against project root so both relative and absolute paths work
	return path.resolve(process.cwd(), trimmed)
}

// Given a cached src, return a list of likely file-system paths to try
function cachedSrcCandidates(src: string) {
	const trimmed = src.replace(/^\//, '')
	const candidates = [
		path.resolve(process.cwd(), trimmed),
		// Also try under public/ in case src is referenced without public
		path.resolve(process.cwd(), 'public', trimmed),
		// Try the literal trimmed path as provided
		path.resolve(trimmed)
	]
	return candidates
}

// Validate all given srcs exist on disk
function validateSrcsExist(srcs: string[]) {
	for (const src of srcs) {
		let found = false
		for (const cand of cachedSrcCandidates(src)) {
			if (existsSync(cand)) {
				found = true
				break
			}
		}
		if (!found) return false
	}
	return true
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
		const cached = getStmt.get(imageDir, 'responsiveImage') as { data: string; version: number } | undefined
		
		if (cached && cached.version === CACHE_VERSION) {
			const data = JSON.parse(cached.data) as CachedData
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
					logCacheEvent('responsiveImage', 'hit', time)
					return undefined
				}
			} else {
				// Validate and reconstruct (need > 1 image for responsive image)
				if (!data.srcs || !Array.isArray(data.srcs) || data.srcs.length <= 1) {
					console.warn(`Invalid cached image data for ${imageDir}, regenerating`)
					// Fall through to regenerate
				} else if (!validateSrcsExist(data.srcs)) {
					// If any of the cached image files no longer exist, invalidate the cache and regenerate
					console.warn(`Cached image files missing for ${imageDir}, regenerating`)
				} else {
					const result = new ResponsiveImage(data.srcs, data.alt)
					logCacheEvent('responsiveImage', 'hit', time)
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

	// Check SQLite cache
	try {
		const cached = getStmt.get(dir, 'responsiveImages') as { data: string; version: number } | undefined
		
		if (cached && cached.version === CACHE_VERSION) {
			const data = JSON.parse(cached.data) as CachedData
			const time = performance.now() - startTime

			if (!data) {
				// No images previously found. Check if files exist now on disk; if so, regenerate cache.
				const mediaDirs = await new fdir({
					pathSeparator: '/',
					includeBasePath: true
				})
					.group()
					.glob(`**/**@(jpg|webp)`)
					.crawl(dir)
					.withPromise()

				if (mediaDirs.length <= 1) {
					logCacheEvent('responsiveImages', 'hit', time)
					return undefined
				}
				// Fall through to regenerate
			} else {
				// Handle empty object (directory with no valid images)
				if (Object.keys(data).length === 0) {
					logCacheEvent('responsiveImages', 'hit', time)
					return undefined
				}

				// Reconstruct ResponsiveImage objects from cached data
				const images: { [id: string]: ResponsiveImage } = {}
				let invalidCachedData = false
				for (const [key, imgData] of Object.entries(data)) {
					// Validate cached data structure
					if (!imgData?.srcs || !Array.isArray(imgData.srcs) || imgData.srcs.length === 0) {
						console.warn(`Invalid cached image data for ${key} in ${dir}, skipping`)
						continue
					}
					if (!validateSrcsExist(imgData.srcs)) {
						console.warn(`Cached image files missing for ${key} in ${dir}, regenerating directory cache`)
						invalidCachedData = true
						break
					}
					images[key] = new ResponsiveImage(imgData.srcs, imgData.alt)
				}

				if (invalidCachedData) {
					// some cached files are missing; fall through to regenerate
				} else {
					// If no valid images after reconstruction, return undefined
					if (Object.keys(images).length === 0) {
						logCacheEvent('responsiveImages', 'hit', time)
						return undefined
					}
					logCacheEvent('responsiveImages', 'hit', time)
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

	// Store in SQLite
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

	// Check SQLite cache
	try {
		const cached = getStmt.get(imageDir, 'images') as { data: string; version: number } | undefined
		if (cached && cached.version === CACHE_VERSION) {
			const data = JSON.parse(cached.data) as CachedData
			const time = performance.now() - startTime

			// Validate that each cached image file still exists on disk
			const srcs = Object.values(data)
			if (!validateSrcsExist(srcs)) {
				console.warn(`Cached images for ${imageDir} contain missing files; regenerating`)
			} else {
				logCacheEvent('images', 'hit', time)
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
		setStmt.run(imageDir, 'images', JSON.stringify(images), CACHE_VERSION)
	} catch (e) {
		console.warn(`Cache write error for ${imageDir}:`, e)
	}
	
	const time = performance.now() - startTime
	logCacheEvent('images', 'miss', time)
	return images
}
