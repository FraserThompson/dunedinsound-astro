export const toMachineName = (string, space_character) => {
	space_character = space_character || '_'
	return string
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[!,.':#()&+?]/g, '')
		.replace(/\s/g, space_character)
		.replace(/[$]/g, 'z')
}

export const getCurrentDatePrefix = () => {
	const d = new Date()
	return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1)
}
