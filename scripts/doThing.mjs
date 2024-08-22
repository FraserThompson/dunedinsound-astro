import { globSync } from 'glob'
import fs from 'fs'

const fixBlog = (fileContents) => {
	let output = fileContents.replace(
		/<Image responsiveImage=\"(.*?)\" alt=\"(.*?)\"\/>/g,
		`<Image responsiveImage={$1} alt="$2"/>`
	)
	return output
}

function loadAndConvert() {
	const blogs = globSync('./src/content/blog/*.mdx')
	for (const filePath of blogs) {
		const data = fs.readFileSync(filePath, {encoding: 'utf-8'})
		const newThing = fixBlog(data)
		console.log(newThing)
		fs.writeFileSync(filePath, newThing);
	}
}

loadAndConvert();
