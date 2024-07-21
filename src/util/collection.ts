import { getCollection } from 'astro:content'
import type { CollectionEntry, CollectionKey } from 'astro:content'
import { toMachineName } from 'src/util/names'
import fg from 'fast-glob'
import { getEntry } from 'astro:content'
import * as path from 'node:path'
import { getResponsiveImages, getResponsiveImagesByDir, ResponsiveImage } from './image'
import { monthMap } from './helpers'

type EntryExtraCommon = {
	slug: string
	absolutePath: string
	cover: ResponsiveImage
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
	vaultsession: EntryExtraCommon
	blog: EntryExtraCommon
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
				extra: await getGigExtra(entry, extraCommon)
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
export async function getCommonExtra<C extends CollectionKey>(	entry: CollectionEntry<C>): Promise<EntryExtraCommon> {
	const title = entry.data.title

	// To preserve URLs from old site
	const postSlug = getEntrySlug(title, entry.collection)

	const images = await getResponsiveImagesByDir(`public/media/${entry.collection}/${entry.id}`)

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
	const artistDirs = await fg.glob(`public/media/gig/${entry.id}/*`, {
		onlyDirectories: true
	})

	let artistImages: { [id: string]: ResponsiveImage[] } = {}
	let audio: ArtistAudio[] = []

	// Get all media from each subdirectory
	for (const artistDir of artistDirs) {
		const artistName = path.basename(artistDir)

		if (artistName === 'cover') continue

		// Get responsive image dirs
		const imageDirs = await fg.glob(`${artistDir}/*`, {
			onlyDirectories: true
		})

		// Get all image paths in each responsive image dir
		artistImages[artistName] = await Promise.all(imageDirs.map(async (imageDir) => await getResponsiveImages(imageDir)))

		// Get the audio
		const audioFiles = (await fg.glob(`${artistDir}/*.{mp3,json}`)).map((file) => file.replace('public/', '/'))

		if (audioFiles.length) {
			audio.push({
				title: artistName,
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
 * Gets the cover image srcset for an entry.
 * @param entry
 * @returns ResponsiveImage object for cover image.
 */
export async function getCover(entry: CollectionEntry<CollectionKey>): Promise<ResponsiveImage> {
	const type = entry.collection
	const dir = `public/media/${type}/${entry.id}/cover`
	return await getResponsiveImages(dir)
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
