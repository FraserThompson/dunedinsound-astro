import type { CollectionKey } from 'astro:content'
import type { ProcessedEntryBase } from './collection'
import { artistsToString } from './helpers'

export const siteTitle = 'dunedinsound.com gig archive'

export const defaultMetaDescription =
	'A permanent and non-commercial media archive for gigs happening right now in Ōtepoti, Aotearoa.'

type MetaHandlerMap = {
	[K in CollectionKey]: (entry: ProcessedEntryBase<K>) => Promise<string>
}

const metaHandlers = {
	artist: async (entry) => `Media from gigs featuring ${entry.entry.data.title}.`,
	venue: async (entry) => `Media from gigs at ${entry.entry.data.title}.`,
	gig: async (entry) => {
		const artists = entry.extra.artists ?? []
		const venueTitle = entry.extra.venue?.data.title ?? entry.entry.data.venue.id
		return `"${entry.entry.data.title}" at ${venueTitle} featuring ${artistsToString(artists)}.`
	},
	blog: async (entry) => entry.entry.data.description ?? defaultMetaDescription,
	vaultsession: async (entry) => entry.entry.data.description ?? defaultMetaDescription,
	page: async () => defaultMetaDescription,
	series: async (entry) => entry.entry.data.description ?? defaultMetaDescription
} satisfies MetaHandlerMap

export async function getCollectionMetaDescription<C extends CollectionKey>(
	entry: ProcessedEntryBase<C>
): Promise<string> {
	const handler = metaHandlers[entry.entry.collection] as (
		entry: ProcessedEntryBase<C>
	) => Promise<string>
	return handler(entry)
}
