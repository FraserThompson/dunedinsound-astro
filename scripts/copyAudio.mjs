import { toMachineName, getCurrentDatePrefix } from './scriptHelpers.mjs'
import fs from 'fs-extra'

const getAudioFiles = () => {
	const source = './audio'
	return fs.readdirSync(source, { withFileTypes: true })
}

const audioFiles = getAudioFiles()
audioFiles.forEach((dirent) => {
	if (dirent.isDirectory()) {
		return
	}
	const filename = dirent.name
	const splitted = filename.split(' - ')
	const src = `${process.cwd()}\\audio\\${filename}`
	const destination = `${process.cwd()}\\media\\gig\\${getCurrentDatePrefix()}-${toMachineName(
		splitted[0],
		'-'
	)}\\${toMachineName(splitted[1].split('.')[0])}`
	if (fs.existsSync(destination)) {
		fs.copyFileSync(src, `${destination}\\${filename}`)
		console.log(`Copied ${src} to ${destination}`)
	}
})
