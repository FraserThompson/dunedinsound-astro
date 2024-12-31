import { z, defineCollection, reference } from 'astro:content'
import { glob } from 'astro/loaders'

// Gig
const gigVid = z.object({
	link: z.string(),
	title: z.string().optional()
})

const gigTrack = z.object({
	title: z.string(),
	time: z.string(),
	link: z.string().optional()
})

const gigArtistMedia = z.object({
	id: reference('artist'),
	vid: z.array(gigVid).optional(),
	tracklist: z.array(gigTrack).optional()
})

const Gig = defineCollection({
	loader: glob({ pattern: '*.yml', base: "./src/content/gig/" }),
	schema: z.object({
		title: z.string(),
		hidden: z.boolean().optional(),
		date: z.date(),
		venue: reference('venue'),
		artists: z.array(gigArtistMedia),
		description: z.string().optional(),
		intro: z.string().optional(),
		feature_vid: z.string().optional(),
		audioOnly: z.boolean().optional()
	})
})

// Venues
const artistAudioculture = z.object({
	link: z.string(),
	snippet: z.string(),
	image: z.string().optional()
})

export const webLinks = z.object({
	facebook: z.string().optional(),
	bandcamp: z.string().optional(),
	website: z.string().optional(),
	soundcloud: z.string().optional(),
	instagram: z.string().optional(),
	spotify: z.string().optional(),
	audioculture: artistAudioculture.optional()
})

const Venue = defineCollection({
	loader: glob({ pattern: '*.yml', base: "./src/content/venue/" }),
	schema: z.object({
		title: z.string(),
		lat: z.number(),
		lng: z.number(),
		description: z.string().optional(),
		links: webLinks.optional(),
		died: z.date().optional(),
		date: z.date().optional(),
		hidden: z.boolean().optional(),
		allAges: z.boolean().optional(),
		aliases: z.array(reference('venue')).optional()
	})
})

// Artist
const Artist = defineCollection({
	loader: glob({ pattern: '*.yml', base: "./src/content/artist/" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.date().optional(),
		links: webLinks.optional(),
		origin: z.string().optional(),
		died: z.date().optional(),
		hidden: z.boolean().optional(),
		aliases: z.array(reference('artist')).optional()
	})
})

// Blog
const Blog = defineCollection({
	loader: glob({ pattern: '*.mdx', base: "./src/content/blog/" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.date(),
		author: z.string(),
		tags: z.array(z.string()),
		gallery: z.boolean().optional(),
		hidden: z.boolean().optional(),
		hideCaptions: z.boolean().optional(),
		relatedGigs: z.array(reference('gig')).optional(),
		relatedArtists: z.array(reference('artist')).optional(),
		relatedVenues: z.array(reference('venue')).optional()
	})
})

// Vault Session
const VaultSession = defineCollection({
	loader: glob({ pattern: '*.yml', base: "./src/content/vaultsession/" }),
	schema: z.object({
		date: z.date(),
		title: z.string(),
		artist: reference('artist'),
		full_video: z.string(),
		description: z.string(),
		tracklist: z.array(gigTrack).optional()
	})
})

// Page
const Page = defineCollection({
	loader: glob({ pattern: '*.mdx', base: "./src/content/page/" }),
	schema: z.object({
		title: z.string(),
		fullWidth: z.boolean().optional()
	})
})

export const collections = {
	gig: Gig,
	venue: Venue,
	artist: Artist,
	blog: Blog,
	page: Page,
	vaultsession: VaultSession
}
