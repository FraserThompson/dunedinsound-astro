import { globSync } from 'glob'
import fs from 'fs'
import path from 'path'

const toMachineName = (string, space_character) => {
	space_character = space_character || '_'
	return string
		.toLowerCase()
		.replace(/[!,.':#?]/g, '')
		.replace(/\s/g, space_character)
		.replace(/[$]/g, 'z')
}

const convertBlog = (fileContents) => {

	// Images
	const imagePattern = "\!\[([^\]]+)\]\((\S+)\)"
	const replacePattern = '<Image2 responsiveImage={frontmatter.responsiveImages["$2"]} alt="$1"/>'

	// Make relatedGigs machine names

	// Move artists from tags to relatedArtists

	// Move venues from tags to releatedVenues

}

function loadAndConvert() {
	const blogs = globSync('../../dunedinsound-gatsby/src/content/blog/**/*.{md|mdx}')
	for (const filePath of blogs) {
		const data = fs.readFileSync(filePath, {encoding: 'utf-8'})
		const newThing = convertBlog(data)
		const parsedPath = path.parse(filePath)
		const fileName = parsedPath.base
		fs.writeFileSync(`../src/content/blog/${fileName}`, newThing);
	}
}

loadAndConvert();
