/**
 * Machineifies a string.
 *
 * @param string The string to machineify.
 * @param space_character Character to replace with a space (defaults to _)
 * @returns Machineified string.
 */
export const toMachineName = (string: string, space_character?: string) => {
	space_character = space_character || '_'
	return string
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[!,.':#()&?]/g, '')
		.replace(/\s/g, space_character)
		.replace(/[$]/g, 'z')
}
