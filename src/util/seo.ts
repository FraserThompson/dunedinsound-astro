import type { CollectionEntry, CollectionKey } from 'astro:content'

export const siteTitle = 'dunedinsound.com'

export const defaultMetaDescription =
	'A permanent and non-commercial archive for gigs happening right now in Ōtepoti, Aotearoa.'

export function getCollectionMetaDescription<C extends CollectionKey>(entry: CollectionEntry<C>): any {
	const descriptions = {
		artist: `Discover media from live gigs featuring ${entry.data.title} and heaps of other local artists.`,
		venue: `Discover media from live gigs at ${entry.data.title} and heaps of other local venues.`,
		gig: `Gig media from ${entry.data.title}.`,
		blog: entry.data.description,
		vaultsession: entry.data.description,
		page: entry.data.description,
		manifest: ''
	}

	return descriptions[entry.collection]
}
