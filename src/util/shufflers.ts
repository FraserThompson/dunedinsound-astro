import { getCollection } from "astro:content"
import type { Filter, Sorter } from "src/components/ShuffleFilters.astro"

/**
 * Filters and sorters used on collection parent pages and their entry menus.
 */
interface SortersAndFilters {
	'sort': Sorter[]
	'filter': Filter[]
}

interface CollectionShufflersMap {
	'venue': SortersAndFilters
	'artist': SortersAndFilters
}

let originCounts: { [key: string]: number } = {}

// Get the origins list for the dropdown
for (const artist of await getCollection('artist')) {
	const origin = artist.data.origin || 'Dunedin'
	if (!originCounts[origin]) originCounts[origin] = 0
	originCounts[origin]++
}

const originsList = Object.entries(originCounts).map(([key, value]) => [`${key} (${value})`, key])

export const Shufflers: CollectionShufflersMap = {
	'venue': {
		'sort': [
			{ value: 'title', order: 'asc', title: 'Title' },
			{ value: 'numbergigs', order: 'desc', title: 'Most gigs' }
		],
		'filter': [
			{
				title: 'All ages',
				value: 'allages',
				type: 'checkbox' as 'checkbox'
			},
			{
				title: 'Hide dead',
				value: 'active',
				type: 'checkbox' as 'checkbox'
			},
			{
				title: 'Hide alive',
				value: 'dead',
				type: 'checkbox' as 'checkbox'
			}
		]
	},
	'artist': {
		'sort': [
			{
				value: 'title',
				order: 'asc',
				title: 'Title'
			},
			{
				value: 'lastgig',
				order: 'desc',
				title: 'Last played',
			},
			{
				value: 'numbergigs',
				order: 'desc',
				title: 'Most gigs',
			}
		],
		'filter': [
			{ values: originsList, title: 'Origins', icon: 'globe', type: 'select' },
			{
				title: 'Hide inactive',
				value: 'active',
				type: 'checkbox',
			}
		]
	}
}
