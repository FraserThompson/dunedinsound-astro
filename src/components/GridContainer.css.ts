import { createVar, style } from '@vanilla-extract/css'

export const colXs = createVar()
export const colSm = createVar()
export const colMd = createVar()
export const colLg = createVar()

export const centered = createVar()

export const gridWrapper = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(12, [col-start] 1fr)',
	justifyItems: centered && 'center',
	gridAutoFlow: 'dense'
})

export const GridChild = style({
	gridColumn: colXs,
	'@media': {
		'screen and (--xs)': {
			gridColumn: colSm
		},
		'screen and (--md)': {
			gridColumn: colMd
		},
		'screen and (--lg)': {
			gridColumn: colLg
		}
	},
	selectors: {
		'&:only-child': {
			gridColumn: 'col-start 4 / span 6 !important'
		},
		'&:last-child:nth-child(odd)': {
			gridColumn: 'col-start 4 / span 6 !important'
		}
	}
})
