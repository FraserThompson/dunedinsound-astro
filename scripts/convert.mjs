import { parse, stringify } from 'yaml'
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

const convertGig = (fileContents) => {
	const yamlGig = parse(fileContents)
	delete yamlGig.cover
	yamlGig.artists = yamlGig.artists.map((artist) => {
		const newArtist = {
			id: toMachineName(artist.name)
		}
		if (artist.vid) newArtist.vid = artist.vid
		return newArtist
	})
	return yamlGig
}

const convertArtistOrvenue = (fileContents) => {
	const yaml = parse(fileContents)

	delete yaml.cover

	const links = {}

	if (yaml.facebook) {
		links.facebook = yaml.facebook
		delete yaml.facebook
	}
	if (yaml.bandcamp) {
		links.bandcamp = yaml.bandcamp
		delete yaml.bandcamp
	}
	if (yaml.website) {
		links.website = yaml.website
		delete yaml.website
	}
	if (yaml.soundcloud) { 
		links.soundcloud = yaml.soundcloud
		delete yaml.soundcloud
	}
	if (yaml.instagram) {
		links.instagram = yaml.instagram
		delete yaml.instagram
	}
	if (yaml.spotify) {
		links.spotify = yaml.spotify
		delete yaml.spotify
	}
	if (yaml.audioculture) {
		links.audioculture = yaml.audioculture
		delete yaml.audioculture
	}

	if (Object.keys(links).length !== 0) yaml.links = links

	return yaml
}

function loadAndConvert() {
	const gigs = globSync('../../dunedinsound-gatsby/src/content/gig/*.yml')
	for (const filePath of gigs) {
		const data = fs.readFileSync(filePath, {encoding: 'utf-8'})
		const newThing = convertGig(data)
		const parsedPath = path.parse(filePath)
		const fileName = parsedPath.base
		fs.writeFileSync(`../src/content/gig/${fileName}`, stringify(newThing));
	}
	const artists = globSync('../../dunedinsound-gatsby/src/content/artist/*.yml')
	for (const filePath of artists) {
		const data = fs.readFileSync(filePath, {encoding: 'utf-8'})
		const newThing = convertArtistOrvenue(data)
		const parsedPath = path.parse(filePath)
		const fileName = parsedPath.base
		fs.writeFileSync(`../src/content/artist/${fileName}`, stringify(newThing));
	}
	const venues = globSync('../../dunedinsound-gatsby/src/content/venue/*.yml')
	for (const filePath of venues) {
		const data = fs.readFileSync(filePath, {encoding: 'utf-8'})
		const newThing = convertArtistOrvenue(data)
		const parsedPath = path.parse(filePath)
		const fileName = parsedPath.base
		fs.writeFileSync(`../src/content/venue/${fileName}`, stringify(newThing));
	}
}

loadAndConvert();
