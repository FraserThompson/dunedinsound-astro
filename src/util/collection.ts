import { getCollection } from 'astro:content'
import type { CollectionEntry, CollectionKey, DataEntryMap } from 'astro:content'
import { toMachineName } from 'src/util/names'
import { fdir } from 'fdir'
import { getEntry } from 'astro:content'
import * as path from 'node:path'
import { getResponsiveImages, getResponsiveImagesByDir } from './image'
import type { ResponsiveImage } from './ResponsiveImage'
import { monthMap } from './helpers'

type EntryExtraCommon = {
	slug: string
	absolutePath: string
	cover?: ResponsiveImage
	images?: { [id: string]: ResponsiveImage }
}

interface Track {
	title: string
	time: string
}

export interface ArtistAudio {
	title: string
	files: string[]
	tracklist?: Track[]
}

export type EntryExtraMap = {
	gig: EntryExtraCommon & {
		artistImages: { [id: string]: ResponsiveImage[] }
		audio: ArtistAudio[]
		artists: CollectionEntry<'artist'>[]
		venue: CollectionEntry<'venue'>
	}
	artist: EntryExtraCommon
	venue: EntryExtraCommon
	manifest: EntryExtraCommon
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
 * Loads a collection and adds extra generated fields to each entry.
 *
 * Which fields are added depends on the collection type.
 *
 * @param name Name of the collection to load
 * @returns Array of ProcessedEntry's.
 */
export async function loadAndFormatCollection<C extends CollectionKey>(name: C, filter?: (arg: any) => void) {
	const entries = await getCollection(name, filter)
	const sortedEntries = sortCollectionByDate(entries).filter((thing) => !thing.data.hidden)
	return await Promise.all(sortedEntries.map(async (entry, i) => await processEntry(entry, entries, i)))
}

/**
 * Loads and formats a single data entry.
 * @param entry
 * @returns
 */
export async function loadAndFormatEntry<C extends keyof DataEntryMap>(collection: C, id: string) {
	const fullEntry = await getEntry(collection, id)
	if (fullEntry) {
		// @ts-ignore
		const processedEntry: ProcessedEntry<C> = await processEntry(fullEntry)
		return processedEntry
	}
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

	const prev = !i || i + 1 === entries.length ? undefined : entries[i + 1]
	const next = !i || i === 0 ? undefined : entries[i - 1]

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

	// To preserve URLs from old site
	const postSlug = getEntrySlug(title, entry.collection)

	const images = await getResponsiveImagesByDir(`public/media/${entry.collection}/${getEntryId(entry)}`, title)

	return {
		slug: postSlug,
		absolutePath: getEntryPath(postSlug, entry.collection),
		cover: await getCover(entry),
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
		entry.data.artists.map(async (artist: any) => await getEntry('artist', artist.id.id))
	)

	// Get associated venue entry
	const venue = await getEntry('venue', entry.data.venue.id)

	// Find artist subdirectories in this gig's dir
	const artistDirs = await new fdir({
		pathSeparator: '/',
		includeBasePath: true,
		maxDepth: 1
	})
		.onlyDirs()
		.crawl(`public/media/gig/${entry.id}`)
		.withPromise()

	let artistImages: { [id: string]: ResponsiveImage[] } = {}
	let audio: ArtistAudio[] = []

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
		).map((file) => file.replace('public/', '/'))

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
	const relatedGigsByArtist = await loadAndFormatCollection('gig', ({ data }) =>
		data.artists?.find((artist: any) =>
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
	const dir = `public/media/${type}/${getEntryId(entry)}`

	// Get the audio
	const audioFiles = (
		await new fdir({
			pathSeparator: '/',
			includeBasePath: true
		})
			.glob(`**@(mp3|json)`)
			.crawl(dir)
			.withPromise()
	).map((file) => file.replace('public/', '/'))

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
 * Gets the cover image srcset for an entry.
 * @param entry
 * @returns ResponsiveImage object for cover image.
 */
export async function getCover(entry: CollectionEntry<CollectionKey>): Promise<ResponsiveImage | undefined> {
	const type = entry.collection
	const dir = `public/media/${type}/${getEntryId(entry)}/cover`
	const images = await getResponsiveImages(dir)
	return images
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
export function getEntryPath(title: string, collection: string): string {
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
	return entries.sort((a, b) => b.data?.date - a.data?.date)
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
export const sortGigs = (gigs: ProcessedEntry<'gig'>[]) =>
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
