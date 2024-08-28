import { getCollection } from 'astro:content'
import type { CollectionEntry, CollectionKey, DataEntryMap } from 'astro:content'
import { toMachineName } from 'src/util/names'
import { fdir } from 'fdir'
import { getEntry } from 'astro:content'
import * as path from 'node:path'
import { getResponsiveImage, getResponsiveImagesByDir } from './image'
import type { ResponsiveImage } from './ResponsiveImage'
import { monthMap } from './constants'
import { getCollectionMetaDescription } from './seo'
import { DIST_MEDIA_DIR } from './constants'

type EntryExtraCommon = {
	slug: string
	absolutePath: string
	metaDescription?: string
	cover?: ResponsiveImage
	coverVertical?: ResponsiveImage
	images?: { [id: string]: ResponsiveImage }
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
		artistImages: { [id: string]: ResponsiveImage[] }
		audio: ArtistAudio[]
		artists: ProcessedEntry<'artist'>[]
		venue: CollectionEntry<'venue'>
	}
	artist: EntryExtraCommon & {
		gigCount: number
		lastGig?: number
	}
	venue: EntryExtraCommon & {
		gigCount: number
	}
	vaultsession: EntryExtraCommon & {
		artist: CollectionEntry<'artist'>
		audio: ArtistAudio
	}
	blog: EntryExtraCommon & {
		relatedGigs: ProcessedEntry<'gig'>[]
		relatedArtists: CollectionEntry<'artist'>[]
		relatedVenues: CollectionEntry<'venue'>[]
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
 * So entries aren't processed multiple times, we cache full collection results.
 */
type CachedResults<C extends CollectionKey> = {
	[key: string]: ProcessedEntry<C>[]
}

const cachedResults: CachedResults<any> = {}

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
	if (!cachedResults[name]) {
		const entries = await getCollection(name)
		const sortedEntries = sortCollectionByDate(entries).filter((thing) =>
			'hidden' in thing.data ? !thing.data.hidden : true
		)
		const processedEntries = await Promise.all(
			sortedEntries.map(async (entry, i) => await processEntry(entry, sortedEntries, i))
		)
		cachedResults[name] = processedEntries
	}

	if (filter) {
		return cachedResults[name].filter(filter)
	}

	return cachedResults[name]
}

/**
 * Loads and formats a single data entry.
 * @param entry
 * @returns
 */
export async function loadAndFormatEntry<C extends keyof DataEntryMap>(collection: C, id: string) {
	// Try find a cached one if we've already gotten it
	if (cachedResults[collection]) {
		//@ts-expect-error
		const cachedResult = cachedResults[collection].find((entry) => entry.entry.id === id)
		if (cachedResult) return cachedResult
	}

	const fullEntry = await getEntry(collection, id)

	//@ts-expect-error
	const processedEntry: ProcessedEntry<C> = await processEntry(fullEntry)

	return processedEntry
}

/**
 * Processes an entry and adds extra fields.
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
	const extraCommon: EntryExtraCommon = await getCommonExtra(entry)

	const prev = i === undefined || i + 1 === entries.length ? undefined : entries[i + 1]
	const next = i === undefined || i === 0 ? undefined : entries[i - 1]

	switch (entry.collection) {
		case 'gig':
			return {
				entry,
				prev,
				next,
				extra: (await getGigExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
		case 'blog':
			return {
				entry,
				prev,
				next,
				extra: (await getBlogExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
		case 'vaultsession':
			return {
				entry,
				prev,
				next,
				extra: (await getVaultSessionExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
		case 'artist':
			return {
				entry,
				prev,
				next,
				extra: (await getArtistExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
		case 'venue':
			return {
				entry,
				prev,
				next,
				extra: (await getVenueExtra(entry, extraCommon)) as EntryExtraMap[C]
			}
		default:
			return {
				entry,
				prev,
				next,
				extra: extraCommon as EntryExtraMap[C]
			}
	}
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

	const images = await getResponsiveImagesByDir(`${DIST_MEDIA_DIR}/${entry.collection}/${getEntryId(entry)}`, title)
	images && delete images['cover'] && delete images['cover_vertical']

	return {
		slug: postSlug,
		metaDescription,
		absolutePath: getEntryPath(postSlug, entry.collection),
		cover: await getCover(entry),
		coverVertical: await getCover(entry, 'cover_vertical'),
		images: images
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
		entry.data.artists.map(async (artist: any) => await loadAndFormatEntry('artist', artist.id.id))
	)

	// This is used for sorting media into the correct order
	const artistIds: string[] = entry.data.artists.map((artist) => artist.id.id)

	// Get associated venue entry
	const venue = await getEntry('venue', entry.data.venue.id)

	// Find artist subdirectories in this gig's dir
	const artistDirs = await new fdir({
		pathSeparator: '/',
		includeBasePath: true,
		maxDepth: 1
	})
		.onlyDirs()
		.crawl(`${DIST_MEDIA_DIR}/gig/${entry.id}`)
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

		if (artistId === 'cover' || artistId === entry.id) continue

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
				tracklist: entry.data.artists.find((artist: any) => artist.id.id === artistDir)?.tracklist
			})
		}
	}

	return {
		...extra,
		artistImages,
		audio,
		artists,
		venue
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
		? await Promise.all(entry.data.relatedArtists.map(async (artist: any) => await getEntry('artist', artist.id)))
		: []

	const relatedVenues = entry.data.relatedVenues
		? await Promise.all(entry.data.relatedVenues.map(async (venue: any) => await getEntry('venue', venue.id)))
		: []

	// Find gigs which mention related artists
	const relatedGigsByArtist = await loadAndFormatCollection('gig', (gig) =>
		gig.entry.data.artists?.find((artist) =>
			entry.data.relatedArtists?.find((relatedArtist) => relatedArtist.id === artist.id.id)
		)
	)

	// Filter out duplicates
	const relatedSpecifiedGigs =
		entry.data.relatedGigs?.filter((entry) => !relatedGigsByArtist.find((entry2) => entry.id === entry2.entry.id)) || []

	// Get processed gig entries from relatedGigs
	const processedRelatedSpecifiedGigs = await Promise.all(
		relatedSpecifiedGigs.map(async (gig) => await loadAndFormatEntry(gig.collection, gig.id))
	)

	// Total related gigs
	const relatedGigs = [...relatedGigsByArtist, ...processedRelatedSpecifiedGigs.filter((gig) => gig !== undefined)]

	return {
		...extra,
		relatedGigs,
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
 * Extends extra fields for artists:
 * - cover: override the default cover with the latest gig cover.
 * - gigCount: number of gigs featuring this artist.
 * @param entry: The artist entry.
 * @returns extras with artist fields.
 */
export async function getArtistExtra(
	entry: CollectionEntry<'artist'>,
	extra: EntryExtraCommon
): Promise<EntryExtraMap['artist']> {
	const artistId = entry.id

	// Get the latest gig featuring this artist
	const artistGigs = await getCollection('gig', (gig) =>
		gig.data.artists.find((gigArtist) => gigArtist.id.id === artistId)
	)
	const latestGig = artistGigs.length ? artistGigs.reverse()[0] : undefined

	let cover: ResponsiveImage | undefined = undefined
	// Resolve an image
	if (latestGig) {
		const dir = `${DIST_MEDIA_DIR}/gig/${latestGig.id}/${artistId}`
		const images = await getResponsiveImagesByDir(dir)
		cover = images ? Object.values(images)[0] : undefined
	}

	return {
		...extra,
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
		gigCount: venueGigs.length
	}
}

/**
 * Gets the cover image srcset for an entry.
 * @param entry
 * @param name the name of the file (defualts to cover)
 * @returns ResponsiveImage object for cover image.
 */
export async function getCover(
	entry: CollectionEntry<CollectionKey>,
	name: string = 'cover'
): Promise<ResponsiveImage | undefined> {
	const type = entry.collection
	const dir = `${DIST_MEDIA_DIR}/${type}/${getEntryId(entry)}/${name}`
	const image = await getResponsiveImage(dir)
	if (image) image.alt = `Cover image for ${entry.data.title}`
	return image
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
	const slugType = collection !== 'blog' ? collection + 's' : collection
	return '/' + slugType + '/' + slug
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

interface MonthsGroup {
	[month: string]: ProcessedEntry<'gig'>[]
}

export interface SortedGigs {
	[year: string]: MonthsGroup
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
			acc[year] = {}
		}
		if (!acc[year][month]) {
			acc[year][month] = []
		}

		acc[year][month].push(gig)

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
