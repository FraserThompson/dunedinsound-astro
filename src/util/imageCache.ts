import * as path from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import Database from 'better-sqlite3'

const CACHE_DB = '.astro/image-cache.db'
const CACHE_VERSION = 2
const STATS_LOG_INTERVAL = 10000

type CacheType = 'responsiveImage' | 'responsiveImages' | 'images'

type CacheItem<T = any> = {
	path: string;
	type: CacheType;
	data: T;
};

type CacheStats = {
	hits: number
	misses: number
	totalTime: number
}

type GlobalImageValidationState = {
	validatedKeys: Set<string>
}

const stats: Record<CacheType, CacheStats> = {
	responsiveImage: { hits: 0, misses: 0, totalTime: 0 },
	responsiveImages: { hits: 0, misses: 0, totalTime: 0 },
	images: { hits: 0, misses: 0, totalTime: 0 }
}

let statsLoggedAt = 0

const globalState = (globalThis as { __imageValidationState?: GlobalImageValidationState })
	.__imageValidationState
const imageValidationState: GlobalImageValidationState = globalState ?? {
	validatedKeys: new Set<string>()
}

	; (globalThis as { __imageValidationState?: GlobalImageValidationState }).__imageValidationState =
		imageValidationState

const cacheDir = path.dirname(CACHE_DB)
if (!existsSync(cacheDir)) {
	mkdirSync(cacheDir, { recursive: true })
}

const db = new Database(CACHE_DB)

db.pragma('journal_mode = WAL')

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

const getStmt = db.prepare('SELECT data, version FROM cache WHERE path = ? AND type = ?')
const setStmt = db.prepare(`
	INSERT OR REPLACE INTO cache (path, type, data, version)
	VALUES (?, ?, ?, ?)
`)
const deleteOldVersionsStmt = db.prepare('DELETE FROM cache WHERE version != ?')

deleteOldVersionsStmt.run(CACHE_VERSION)

function cachedSrcCandidates(src: string) {
	const trimmed = src.replace(/^\//, '')
	return [
		path.resolve(process.cwd(), trimmed),
		path.resolve(process.cwd(), 'public', trimmed),
		path.resolve(trimmed)
	]
}

export function logImageCacheEvent(type: CacheType, event: 'hit' | 'miss', time: number) {
	const data = stats[type]

	if (event === 'hit') data.hits++
	else data.misses++

	data.totalTime += time

	const total = data.hits + data.misses

	if (total - statsLoggedAt >= STATS_LOG_INTERVAL) {
		const hitPct = ((data.hits / total) * 100).toFixed(1)
		const missPct = ((data.misses / total) * 100).toFixed(1)
		const avgTime = (data.totalTime / total).toFixed(2)

		console.log(`[${type}] ${total} reqs | Hit: ${hitPct}% | Miss: ${missPct}% | Avg: ${avgTime}ms`)
		statsLoggedAt = total
	}
}

export function shouldValidateImageCacheThisSession(cachePath: string, cacheType: CacheType) {
	if (process.env.NODE_ENV !== 'development') {
		return true
	}

	const key = `${cacheType}:${cachePath}`
	if (imageValidationState.validatedKeys.has(key)) {
		return false
	}

	imageValidationState.validatedKeys.add(key)
	return true
}

export function validateImageSrcsExist(srcs: string[]) {
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

export function getImageCache<CachedData>(cachePath: string, cacheType: CacheType) {
	const cached = getStmt.get(cachePath, cacheType) as { data: string; version: number } | undefined
	if (!cached || cached.version !== CACHE_VERSION) return undefined

	return JSON.parse(cached.data) as CachedData
}

// Create a transaction function that loops over an array of items
const insertMany = db.transaction((items: CacheItem[]) => {
	for (const item of items) {
		setStmt.run(item.path, item.type, JSON.stringify(item.data), CACHE_VERSION);
	}
});

// Export a single, flexible function that handles both single items and arrays!
export function setImageCache<CachedData>(
	pathOrItems: string | CacheItem<CachedData>[],
	cacheType?: CacheType,
	data?: CachedData
) {
	// If an array was passed, pass it directly to the transaction
	if (Array.isArray(pathOrItems)) {
		insertMany(pathOrItems);
	}
	// If standard individual arguments were passed, wrap them in an array for the transaction
	else if (cacheType && data !== undefined) {
		insertMany([{ path: pathOrItems, type: cacheType, data }]);
	}
}
