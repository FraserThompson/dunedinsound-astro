import { globSync } from 'glob'
import { parse, stringify } from 'yaml'
import fs from 'fs'
import { getCollection, type CollectionEntry } from 'astro:content'

const gigs = await getCollection('gig')
const artists = await getCollection('artist')
const venues = await getCollection('venue')

const convertBlog = (fileContents: string) => {
	// Images
	const imagePattern = /\!\[([^\]]*)\]\((.\/*(.+)\.(.+))\)/g
	const replacePattern = '<Image2 responsiveImage={frontmatter.responsiveImages["$3"]} alt="$1"/>'
	let newContents = fileContents.replace(imagePattern, replacePattern)

	// Get frontmatter
	const frontMatterPattern = /^---([\s\S]+?)---/
	const frontmatter = frontMatterPattern.exec(newContents)
	if (!frontmatter) return

	const yamlFrontmatter = parse(frontmatter[1])
	const relatedGigs = yamlFrontmatter.related_gigs
	const tags = yamlFrontmatter.tags

	let newFrontmatter: any = {...yamlFrontmatter}
	let newTags: string[] = tags

	delete newFrontmatter['tags']
	delete newFrontmatter['related_gigs']
	delete newFrontmatter['cover']
	delete newFrontmatter['cover_vertical']

	// Make relatedGigs machine names
	const matchingGigs: CollectionEntry<'gig'>[] | false =
		relatedGigs && gigs.filter((gig) => relatedGigs.includes(gig.data.title))

	if (matchingGigs && matchingGigs.length) {
		const matchingGigIds = matchingGigs.map((thing) => thing.id)
		if (matchingGigIds.length) {
			newFrontmatter['relatedGigs'] = matchingGigIds
		}
	}

	// Move artists from tags to relatedArtists
	const matchingArtists: CollectionEntry<'artist'>[] | false =
		tags && artists.filter((artist) => tags.includes(artist.data.title))

	if (matchingArtists && matchingArtists.length) {
		const matchingArtistIds = matchingArtists.map((gig) => gig.id)
		if (matchingArtistIds.length) {
			newFrontmatter['relatedArtists'] = matchingArtistIds
			newTags = newTags.filter((tag: string) => !matchingArtists.find((thing) => thing.data.title === tag))
		}
	}

	// Move venues from tags to releatedVenues
	const matchingVenues: CollectionEntry<'venue'>[] | false =
		tags && venues.filter((venue) => tags.includes(venue.data.title))

	if (matchingVenues && matchingVenues.length) {
		const matchingVenueIds = matchingVenues.map((gig) => gig.id)
		if (matchingVenueIds.length) {
			newFrontmatter['relatedVenues'] = matchingVenueIds
			newTags = newTags.filter((tag: string) => !matchingVenues.find((thing) => thing.data.title === tag))
		}
	}

	newFrontmatter['tags'] = newTags

	newContents = newContents.replace(frontMatterPattern, '---\n' + stringify(newFrontmatter) + '---\nimport Image2 from "src/components/Image2.astro"\n')

	return newContents
}

export function loadAndConvert() {
	const blogs = globSync('../dunedinsound-gatsby/src/content/blog/**/*.{md,mdx}')
	for (const filePath of blogs) {
		const data = fs.readFileSync(filePath, { encoding: 'utf-8' })
		const newThing = convertBlog(data)
		const splitPath = filePath.split('\\')
		const blogId = splitPath[splitPath.length - 2]
		const fileName = `${blogId}.mdx`
		console.log(filePath)
		newThing && fs.writeFileSync(`src/content/blog/${fileName}`, newThing);
	}
}
