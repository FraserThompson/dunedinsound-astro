import { getCollection } from 'astro:content'
import type { CollectionEntry, CollectionKey, DataEntryMap } from 'astro:content'
import { toMachineName } from 'src/util/names'
import { fdir } from 'fdir'
import { getEntry } from 'astro:content'
import * as path from 'node:path'
import { getResponsiveImage, getResponsiveImagesByDir } from './image'
import type { ResponsiveImage } from './ResponsiveImage'
import { epochYear, monthMap, type Month } from './constants'
import { getCollectionMetaDescription } from './seo'
import { DIST_MEDIA_DIR } from './constants'
import { existsSync } from 'node:fs'

type EntryExtraCommon = {
	slug: string
	absolutePath: string
	metaDescription?: string
	cover?: ResponsiveImage[]
	coverVertical?: ResponsiveImage[]
}

interface Track {
	title: string
	time: string
}

export type ArtistAudio = {
	title: string
	files: string[]
	tracklist?: Track[]
}

export type EntryExtraMap = {
	gig: EntryExtraCommon & {
		artists: ProcessedEntry<'artist'>[]
		series?: ProcessedEntry<'series'>
		venue?: CollectionEntry<'venue'>
		relatedBlogs?: CollectionEntry<'blog'>[]
	}
	series: EntryExtraCommon & {
		gigCount: number
	}
	artist: EntryExtraCommon & {
		gigCount: number
		lastGig?: number
		lifetimeString?: string
	}
	venue: EntryExtraCommon & {
		gigCount: number
		lifetimeString?: string
	}
	vaultsession: EntryExtraCommon & {
		artist?: CollectionEntry<'artist'>
		audio: ArtistAudio
	}
	blog: EntryExtraCommon & {
		coverVid?: string
		relatedGigs?: CollectionEntry<'gig'>[]
		relatedArtists?: CollectionEntry<'artist'>[]
		relatedVenues?: CollectionEntry<'venue'>[]
	}
	page: EntryExtraCommon
}

export interface ProcessedEntry<C extends CollectionKey> {
	entry: CollectionEntry<C>
	extra: EntryExtraMap[C]
	next?: CollectionEntry<C>
	prev?: CollectionEntry<C>
}

/**
 * Simple in-memory cache for processed entries.
 * 
 * Two-level cache:
 * 1. cachedCollection[collection] = Full sorted array of all entries in a collection
 * 2. cachedIndividual[collection][id] = Individual processed entry lookup
 * 
 * Note: Collection data is computed from Astro content entries (not file-based like images),
 * so in-memory caching is appropriate. Module will be reloaded on content changes anyway.
 */
type CachedIndividual = {
	[collection: string]: {
		[id: string]: ProcessedEntry<any>
	}
}

const cachedCollection: { [collection: string]: ProcessedEntry<any>[] } = {}
const cachedIndividual: CachedIndividual = {}

/**
 * Clear collection caches. Useful for dev mode when content changes.
 */
export function clearCollectionCache() {
	Object.keys(cachedCollection).forEach(key => delete cachedCollection[key])
	Object.keys(cachedIndividual).forEach(key => delete cachedIndividual[key])
	console.log('🔄 Collection cache cleared')
}

/**
 * Loads a collection and adds extra generated fields to each entry.
 *
 * Which fields are added depends on the collection type.
 *
 * It also caches the result so a collection will only ever be processed once.
 *
 * @param name Name of the collection to load
 * @returns Array of ProcessedEntry's.
 */
export async function loadAndFormatCollection<C extends CollectionKey>(
	name: C,
	filter?: (arg: ProcessedEntry<C>) => void
): Promise<ProcessedEntry<C>[]> {
	if (!cachedCollection[name]) {
		const entries = await getCollection(name)
		const sortedEntries = sortCollectionByDate(entries).filter((thing) =>
			'hidden' in thing.data ? !thing.data.hidden : true
		)
		const processedEntries = await Promise.all(
			sortedEntries.map(async (entry, i) => await processEntry(entry, sortedEntries, i))
		)
		cachedCollection[name] = processedEntries

		// Also populate individual entry cache for quick lookups
		if (!cachedIndividual[name]) {
			cachedIndividual[name] = {}
		}
		processedEntries.forEach((processed) => {
			cachedIndividual[name][processed.entry.id] = processed
		})
	}

	if (filter) {
		return cachedCollection[name].filter(filter)
	}

	return cachedCollection[name]
}

/**
 * Loads and formats a single data entry.
 * @param entry
 * @returns
 */
export async function loadAndFormatEntry<C extends keyof DataEntryMap>(
	collection: C,
	id: string
): Promise<ProcessedEntry<C>> {
	// Check individual entry cache first
	if (cachedIndividual[collection]?.[id]) {
		return cachedIndividual[collection][id]
	}

	// Try find in collection cache
	if (cachedCollection[collection]) {
		//@ts-expect-error
		const cachedResult = cachedCollection[collection].find((entry) => entry.entry.id === id)
		if (cachedResult) {
			if (!cachedIndividual[collection]) {
				cachedIndividual[collection] = {}
			}
			cachedIndividual[collection][id] = cachedResult
			return cachedResult
		}
	}

	const fullEntry = await getEntry(collection, id)

	//@ts-expect-error
	const processedEntry: ProcessedEntry<C> = await processEntry(fullEntry)

	// Cache the result
	if (!cachedIndividual[collection]) {
		cachedIndividual[collection] = {}
	}
	cachedIndividual[collection][id] = processedEntry

	return processedEntry
}

/**
 * Processes an entry and adds extra fields.
 * Checks cache first to avoid reprocessing.
 * @param entry
 * @param entries
 * @param i
 * @returns
 */
export async function processEntry<C extends CollectionKey>(
	entry: CollectionEntry<C>,
	entries?: any,
	i?: number
): Promise<ProcessedEntry<C>> {
	// Check if this specific entry is already cached
	if (cachedIndividual[entry.collection]?.[entry.id]) {
		return cachedIndividual[entry.collection][entry.id]
	}

	const extraCommon: EntryExtraCommon = await getCommonExtra(entry)

	const prev = i === undefined || i + 1 === entries.length ? undefined : entries[i + 1]
	const next = i === undefined || i === 0 ? undefined : entries[i - 1]

	let processedEntry: ProcessedEntry<C>

	switch (entry.collection) {
		case 'gig':
			processedEntry = {
				entry,
				prev,
				next,
				extra: (await getGigExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
			break
		case 'series':
			processedEntry = {
				entry,
				prev,
				next,
				extra: (await getSeriesExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
			break
		case 'blog':
			processedEntry = {
				entry,
				prev,
				next,
				extra: (await getBlogExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
			break
		case 'vaultsession':
			processedEntry = {
				entry,
				prev,
				next,
				extra: (await getVaultSessionExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
			break
		case 'artist':
			processedEntry = {
				entry,
				prev,
				next,
				extra: (await getArtistExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
			break
		case 'venue':
			processedEntry = {
				entry,
				prev,
				next,
				extra: (await getVenueExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
			break
		default:
			processedEntry = {
				entry,
				prev,
				next,
				extra: extraCommon as EntryExtraMap[C]
			}
	}

	// Cache the processed entry
	if (!cachedIndividual[entry.collection]) {
		cachedIndividual[entry.collection] = {}
	}
	cachedIndividual[entry.collection][entry.id] = processedEntry

	return processedEntry
}

/**
 * Returns the extra fields added to all entries regardless of type.
 *
 * @param entry
 * @returns
 */
async function getCommonExtra<C extends CollectionKey>(entry: CollectionEntry<C>): Promise<EntryExtraCommon> {
	const title = entry.data.title

	const metaDescription = getCollectionMetaDescription(entry)

	// To preserve URLs from old site
	const postSlug = getEntrySlug(title, entry.collection)

	return {
		slug: postSlug,
		metaDescription,
		absolutePath: getEntryPath(postSlug, entry.collection),
		cover: await getCover(entry),
		coverVertical: await getCover(entry, 'cover_vertical')
	}
}

/**
 * Extends extra fields for gigs:
 * - images: array of image srcsets
 * - artists: array of artist entries
 * - venue: the venue entry
 * @param entry: The gig entry.
 * @returns extras with gig fields.
 */
export async function getGigExtra(
	entry: CollectionEntry<'gig'>,
	extra: EntryExtraCommon
): Promise<EntryExtraMap['gig']> {
	const artists = await Promise.all(
		entry.data.artists.map(async (artist) => await loadAndFormatEntry('artist', artist.id.id))
	)

	// Get associated venue entry
	const venue = await getEntry('venue', entry.data.venue.id)

	// Get associated series entry
	const series = entry.data.series && (await loadAndFormatEntry('series', entry.data.series.id))

	// Find gigs which mention related artists
	const relatedBlogs = await getCollection('blog', (blog) =>
		blog.data.relatedGigs?.find((gig) => gig.id === entry.id)
	)

	return {
		...extra,
		relatedBlogs,
		artists,
		venue,
		series
	}
}

/**
 * Extends extra fields for series
 * - gigCount: number of gigs in this series.
 * @param entry: The series entry.
 * @returns extras with series fields.
 */
export async function getSeriesExtra(
	entry: CollectionEntry<'series'>,
	extra: EntryExtraCommon
): Promise<EntryExtraMap['series']> {

	const seriesGigs = await getCollection('gig', (gig) => gig.data.series && gig.data.series.id === entry.id)

	// Array of covers from last 4 gigs in this series
	//const cover = (await Promise.all(seriesGigs.slice(0, 4).map(async (gig) => await getCover(gig)))).filter((covers) => covers !== undefined).map((covers) => covers[0])

	return {
		...extra,
		gigCount: seriesGigs.length
	}
}

/**
 * Extends extra fields for blogs:
 * - relatedGigs: array of related gigs
 * - relatedArtists: array of artists
 * - relatedVenues: array of venues
 * @param entry: The blog entry.
 * @returns extras with blog fields.
 */
export async function getBlogExtra(
	entry: CollectionEntry<'blog'>,
	extra: EntryExtraCommon
): Promise<EntryExtraMap['blog']> {
	const relatedArtists = entry.data.relatedArtists
		? (
			await Promise.all(entry.data.relatedArtists.map(async (artist: any) => await getEntry('artist', artist.id)))
		).filter((thing) => thing !== undefined)
		: undefined

	const relatedVenues = entry.data.relatedVenues
		? (await Promise.all(entry.data.relatedVenues.map(async (venue: any) => await getEntry('venue', venue.id)))).filter(
			(thing) => thing !== undefined
		)
		: undefined

	// Find gigs which mention related artists
	const relatedGigsByArtist = await getCollection('gig', (gig) =>
		gig.data.artists?.find((artist) =>
			entry.data.relatedArtists?.find((relatedArtist) => relatedArtist.id === artist.id.id)
		)
	)

	// Filter out duplicates
	const relatedSpecifiedGigs =
		entry.data.relatedGigs?.filter((entry) => !relatedGigsByArtist.find((entry2) => entry.id === entry2.id)) || []

	// Get processed gig entries from relatedGigs
	const processedRelatedSpecifiedGigs = await Promise.all(
		relatedSpecifiedGigs.map(async (gig) => await getEntry(gig.collection, gig.id))
	)

	// Total related gigs
	const relatedGigs = [...relatedGigsByArtist, ...processedRelatedSpecifiedGigs.filter((gig) => gig !== undefined)]

	// Get video cover (if any)
	const type = entry.collection
	const dir = `${DIST_MEDIA_DIR}/${type}/${getEntryId(entry)}/cover.mp4`

	let coverVid: string | undefined = undefined
	if (existsSync(dir)) {
		coverVid = `/${dir}`
	}

	return {
		...extra,
		coverVid,
		relatedGigs: relatedGigs.length ? relatedGigs : undefined,
		relatedArtists,
		relatedVenues
	}
}

/**
 * Extends extra fields for vault sessions:
 * - artist: the full artist
 * @param entry: The vault session entry.
 * @returns extras with vault session fields.
 */
export async function getVaultSessionExtra(
	entry: CollectionEntry<'vaultsession'>,
	extra: EntryExtraCommon
): Promise<EntryExtraMap['vaultsession']> {
	const artist = await getEntry('artist', entry.data.artist.id)

	const type = entry.collection
	const dir = `${DIST_MEDIA_DIR}/${type}/${getEntryId(entry)}`

	// Get the audio
	const audioFiles = (
		await new fdir({
			pathSeparator: '/',
			includeBasePath: true
		})
			.glob(`**@(mp3|json)`)
			.crawl(dir)
			.withPromise()
	).map((src) => `/${src}`)

	const audio = {
		title: entry.data.title,
		files: audioFiles,
		tracklist: entry.data.tracklist
	}

	return {
		...extra,
		audio,
		artist
	}
}

/**
 * Helper function which takes an artist or venue and makes a handy string to summarize its lifetime.
 * 
 * For example, if it's born in 1990 and died in 2000 it'll return "1990 - 2000".
 * If it died at an unspecified date but was born in 1990 it'll return "1990".
 * Returns undefined if the entry is still alive.
 * 
 * @param entry 
 * @returns string
 */
function getLifetimeString(entry: CollectionEntry<'artist'> | CollectionEntry<'venue'>) {
	const openYear = entry.data.date?.getFullYear()
	const closeYear = entry.data.died?.getFullYear()

	let lifetimeString;

	// If it's still alive the lifetimeString is empty.
	if (closeYear) {
		lifetimeString = `${(openYear && openYear !== epochYear) ? openYear : ''}${(closeYear && closeYear !== epochYear ? (closeYear && openYear ? ' - ' : '') + closeYear : '')}`;
	}

	return lifetimeString
}

/**
 * Extends extra fields for artists:
 * - cover: override the default cover with an image of the artist from a gig.
 * - gigCount: number of gigs featuring this artist.
 * - absolutePath: override path to latest gig if there's only 1.
 * @param entry: The artist entry.
 * @returns extras with artist fields.
 */
export async function getArtistExtra(
	entry: CollectionEntry<'artist'>,
	extra: EntryExtraCommon
): Promise<EntryExtraMap['artist']> {
	const artistId = entry.id

	// Get the latest gig featuring this artist
	const artistGigs = (await getCollection('gig', (gig) => gig.data.artists.find((gigArtist) => gigArtist.id.id === artistId))).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);

	let cover: ResponsiveImage[] | undefined = undefined
	// Find an image of the artist
	for (const gig of artistGigs) {
		const dir = `${DIST_MEDIA_DIR}/gig/${gig.id}/${artistId}`
		const images = await getResponsiveImagesByDir(dir)
		if (images) {
			cover = [Object.values(images)[0]]
			break
		}
	}

	const latestGig = artistGigs.length ? artistGigs?.[0] : undefined

	return {
		...extra,
		lifetimeString: getLifetimeString(entry),
		absolutePath: artistGigs.length <= 1 && latestGig ? `${getEntryPath(latestGig.data.title, 'gig')}#${entry.id}` : extra.absolutePath,
		gigCount: artistGigs.length,
		lastGig: latestGig?.data.date.getTime(),
		cover
	}
}

/**
 * Extends extra fields for venues:
 * - gigCount: number of gigs at this venue.
 * @param entry: The venue entry.
 * @returns extras with venue fields.
 */
export async function getVenueExtra(
	entry: CollectionEntry<'venue'>,
	extra: EntryExtraCommon
): Promise<EntryExtraMap['venue']> {
	const venueId = entry.id
	const venueGigs = await getCollection('gig', (gig) => gig.data.venue.id === venueId)

	return {
		...extra,
		lifetimeString: getLifetimeString(entry),
		absolutePath: entry.data.series ? getEntryPath(entry.data.series.id, 'series') : extra.absolutePath,
		gigCount: venueGigs.length
	}
}

/**
 * Gets the cover(s) image srcset for an entry.
 * @param entry
 * @param name the name of the file (defualts to cover)
 * @returns ResponsiveImage array of cover images.
 */
export async function getCover(
	entry: CollectionEntry<CollectionKey>,
	name: string = 'cover'
): Promise<ResponsiveImage[] | undefined> {
	const type = entry.collection
	const dir = `${DIST_MEDIA_DIR}/${type}/${getEntryId(entry)}/${name}`

	// Try just getting the cover.jpg
	const singleImage = await getResponsiveImage(dir)
	if (singleImage) {
		return [singleImage]
	}

	// Otherwise, check for all images in 'cover' dir
	const imagesByDir = await getResponsiveImagesByDir(dir)
	if (imagesByDir) {
		const images = Object.values(imagesByDir).map((image) => {
			image.alt = `Cover image for ${entry.data.title}`
			return image
		})
		return images
	}
}

/**
 * Gets the slug for an entry (preserving URLs from old site)
 * @param title
 * @param collection
 * @returns the slug
 */
function getEntrySlug(title: string, collection?: string): string {
	return !collection || collection === 'gig' ? toMachineName(title, '-') : toMachineName(title, '_')
}

/**
 * Gets the full path for an entry.
 * @param title
 * @param collection
 * @returns The path.
 */
export function getEntryPath(title: string, collection: CollectionKey): string {
	const slug = getEntrySlug(title, collection)
	switch (collection) {
		case "blog":
			return '/' + collection + '/' + slug
		case "series":
			return '/gigs/' + collection + '/' + slug
		default:
			return '/' + collection + 's/' + slug
	}
}

/**
 * Sorts a collection of entries by date (descending)
 * @param entries
 * @returns
 */
export function sortCollectionByDate<C extends CollectionKey>(entries: CollectionEntry<C>[]) {
	return entries.toSorted((a, b) =>
		'date' in a.data && 'date' in b.data && a.data.date && b.data.date
			? b.data.date.getTime() - a.data.date.getTime()
			: 0
	)
}

type MonthsGroup = {
	[K in Month]?: ProcessedEntry<'gig'>[];
}

interface YearObj {
	count: number;
	gigs: MonthsGroup;
}

export interface SortedGigs {
	[year: string]: YearObj
}

/**
 * Sorts a collection of gigs by month and year
 * @param gigs
 * @returns
 */
export const sortGigs = (gigs: ProcessedEntry<'gig'>[]): SortedGigs =>
	gigs.reduce((acc, gig) => {
		const year = gig.entry.data.date.getFullYear()
		const month = monthMap[gig.entry.data.date.getMonth()]

		if (!acc[year]) {
			acc[year] = { count: 0, gigs: {} }
		}

		acc[year].count++

		if (!acc[year]['gigs'][month]) {
			acc[year]['gigs'][month] = []
		}

		acc[year]['gigs'][month].push(gig)

		return acc
	}, {} as SortedGigs)

/**
 * By default content collection IDs have the file extension.
 * This sucks so we'll strip it.
 * @param entry
 * @returns the ID for the entry
 */
export function getEntryId<C extends CollectionKey>(entry: CollectionEntry<C>) {
	return entry.id.replace('.mdx', '')
}

/**
 * Gets all images for an entry (excluding cover images).
 * @param entry The collection entry
 * @returns Object mapping image names to ResponsiveImage objects
 */
export async function getEntryImages<C extends CollectionKey>(
	entry: CollectionEntry<C>
): Promise<{ [id: string]: ResponsiveImage } | undefined> {
	const images = await getResponsiveImagesByDir(
		`${DIST_MEDIA_DIR}/${entry.collection}/${getEntryId(entry)}`,
		entry.data.title
	)
	if (images) {
		delete images['cover']
		delete images['cover_vertical']
	}
	return images
}

/**
 * Get all media for a gig.
 * This includes images sorted by artists, as well as audio.
 * @param entry 
 * @returns Array of [images, audio]
 */
export async function getGigMedia(entry: ProcessedEntry<'gig'>): Promise<[{ [id: string]: ResponsiveImage[] }, ArtistAudio[]]> {
	const entryData = entry.entry.data

	// This is used for sorting media into the correct order
	const artistIds: string[] = entryData.artists.map((artist) => artist.id.id)

	// Find artist subdirectories in this gig's dir
	const artistDirs = await new fdir({
		pathSeparator: '/',
		includeBasePath: true,
		maxDepth: 1
	})
		.onlyDirs()
		.crawl(`${DIST_MEDIA_DIR}/gig/${entry.entry.id}`)
		.withPromise()

	// We initialize this so they're in the right order.
	let artistImages: { [id: string]: ResponsiveImage[] } = {
		_uncategorized: [],
		...artistIds.reduce((acc: { [id: string]: ResponsiveImage[] }, artistId) => {
			acc[artistId] = []
			return acc
		}, {})
	}
	let audio: ArtistAudio[] = []

	artistDirs.sort((a, b) => artistIds.indexOf(path.basename(a)) - artistIds.indexOf(path.basename(b)))

	// Get all media from each subdirectory
	for (const artistDir of artistDirs) {
		const artistId = path.basename(artistDir)

		if (artistId === 'cover' || artistId === entry.entry.id) continue

		// Get all image paths in each responsive image dir
		const responsiveImages = await getResponsiveImagesByDir(artistDir, artistId)
		artistImages[artistId] = responsiveImages ? Object.values(responsiveImages) : []

		// Get the audio
		const audioFiles = (
			await new fdir({
				pathSeparator: '/',
				includeBasePath: true
			})
				.glob(`**@(mp3|json)`)
				.crawl(artistDir)
				.withPromise()
		).map((src) => `/${src}`)

		if (audioFiles.length) {
			audio.push({
				title: artistId,
				files: audioFiles,
				tracklist: entryData.artists.find((artist) => artist.id.id === artistId)?.tracklist
			})
		}
	}

	if (audio.length) {
		audio.sort((a, b) => artistIds.indexOf(a.title) - artistIds.indexOf(b.title))
	}

	return [artistImages, audio]
}
