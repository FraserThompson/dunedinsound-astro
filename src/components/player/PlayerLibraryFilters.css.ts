import { style } from '@vanilla-extract/css'

// Filter Top Section (Artist / Venue Columns)
export const PlayerLibraryFiltersWrapper = style({
	display: 'grid',
	gap: '5px',
	margin: '0 5px',
	flexShrink: 0,
	gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
	minHeight: 0,
	flex: '0 0 30%'
})

export const PlayerLibraryColumn = style({
	display: 'flex',
	flexDirection: 'column',
	flex: 1,
	minHeight: 0,
})
