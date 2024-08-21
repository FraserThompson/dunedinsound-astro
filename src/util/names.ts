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

/**
 * Normalizes a string, removing diacritics and stuff. Used for search.
 * @param string
 * @returns Normalized string or a blank string if no input
 */
export const stringNormalize = (string?: string | null) => {
	return string
		? string
				.toLowerCase()
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '')
		: ''
}
