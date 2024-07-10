import { getCollection } from 'astro:content'
import type { CollectionEntry, CollectionKey } from 'astro:content'
import { toMachineName } from 'src/util/names'
import fg from 'fast-glob'
import { getEntry } from 'astro:content'
import * as path from 'node:path'
import { ResponsiveImage } from './image'

type EntryExtraCommon = {
	slug: string
	absolutePath: string
	cover: ResponsiveImage
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
		images: { [id: string]: ResponsiveImage[] }
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
 * Which fields are added depends on the collection type, but all entries
 * will get slug, absolutePath, and cover.
 *
 * @param name Name of the collection to load
 * @returns Array of ProcessedEntry's.
 */
export async function loadAndFormatCollection<C extends CollectionKey>(name: C, filter?: (arg: any) => void) {
	const entries = await getCollection(name, filter)
	const sortedEntries = sortCollectionByDate(entries)
	return await Promise.all(sortedEntries.map(async (entry, i) => await processEntry(entry, entries, i)))
}

export async function processEntry<C extends CollectionKey>(
	entry: CollectionEntry<C>,
	entries?: any,
	i?: number
): Promise<ProcessedEntry<C>> {
	const title = entry.data.title

	// To preserve URLs from old site
	const postSlug = getEntrySlug(title, entry.collection)

	// All entries get slug, absolutePath, and cover
	const extraCommon: EntryExtraCommon = {
		slug: postSlug,
		absolutePath: getEntryPath(postSlug, entry.collection),
		cover: await getCover(entry)
	}
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

	let images: { [id: string]: ResponsiveImage[] } = {}
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
		images[artistName] = await Promise.all(imageDirs.map(async (imageDir) => await getImages(imageDir)))

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
		images,
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
	return await getImages(dir)
}

/**
 * Gets all image paths from a directory.
 * @param imageDir
 * @returns ResponsiveImage object
 */
export async function getImages(imageDir: string): Promise<ResponsiveImage> {
	const srcs = (await fg.glob(`${imageDir}/*.{jpg,webp}`)).map((img) => img.replace('public/', '/'))
	return new ResponsiveImage(srcs)
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
