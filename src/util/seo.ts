import type { CollectionKey } from 'astro:content'
import type { ProcessedEntryBase } from './collection'
import { artistsToString } from './helpers'

export const siteTitle = 'Dunedin gig archive'

export const defaultMetaDescription =
	'A permanent and non-commercial media archive for gigs happening right now in Ōtepoti, Aotearoa.'

type MetaHandlerMap = {
	[K in CollectionKey]: (entry: ProcessedEntryBase<K>) => Promise<string>
}

const metaHandlers = {
	artist: async (entry) => `There are ${entry.extra.gigCount} entries featuring ${entry.entry.data.title} in the gig archive.`,
	venue: async (entry) => `There are ${entry.extra.gigCount} entries at ${entry.entry.data.title} in the gig archive.`,
	gig: async (entry) => {
		const artists = entry.extra.artists ?? []
		const venueTitle = entry.extra.venue?.data.title ?? entry.entry.data.venue.id
		return `GIG "${entry.entry.data.title}" at ${venueTitle} featuring ${artistsToString(artists)}. ${entry.extra.media.imageCount} images, ${entry.extra.media.audio.length} audio, ${entry.entry.data.artists.filter((entry) => entry.vid).length} videos.`
	},
	blog: async (entry) => `ARTICLE "${entry.entry.data.title}": ${entry.entry.data.description ?? defaultMetaDescription}`,
	vaultsession: async (entry) => entry.entry.data.description ?? defaultMetaDescription,
	page: async () => defaultMetaDescription,
	series: async (entry) => `SERIES "${entry.entry.data.title}": ${entry.entry.data.description ?? defaultMetaDescription}`
} satisfies MetaHandlerMap

export async function getCollectionMetaDescription<C extends CollectionKey>(
	entry: ProcessedEntryBase<C>
): Promise<string> {
	const handler = metaHandlers[entry.entry.collection] as (
		entry: ProcessedEntryBase<C>
	) => Promise<string>
	return handler(entry)
}
