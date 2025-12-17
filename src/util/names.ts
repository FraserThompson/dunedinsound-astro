import type { ProcessedEntry } from "./collection"

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
		.replace(/[!,.':#()&+?]/g, '')
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

/**
 * Turns a birth and death (optional) date into a human readable string. 
 * @param born 
 * @param died 
 * @returns 
 */
export const timespanString = (born?: Date, died?: Date) => {
	if (!born) return ''
	return `${born.getFullYear()}${died ? ' to ' + died.getFullYear() : ' to present'}`
}
/**
 * 
 * @param references 
 * @returns 
 */
export const referencesTimespanString = (references: ProcessedEntry<'venue' | 'artist'>[]) => {
	return references.length &&
		`${references[references.length - 1].entry.data.date?.getFullYear()} to ${references[0].entry.data.died?.getFullYear() ? references[0].entry.data.died.getFullYear() : "Present"}`
}

/**
 * Takes a string and encodes it into a hash.
 * @param string
 * @returns
 */
export const makeHash = (string: string) => 'h' + encodeURIComponent(toMachineName(string))

/**
 * Takes a date and returns something human readable.
 * @param date 
 * @returns 
 */
export const formattedDate = (date: Date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
