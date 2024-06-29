import { createVar, style, globalStyle } from '@vanilla-extract/css'

export const colXs = createVar()
export const colSm = createVar()
export const colMd = createVar()
export const colLg = createVar()

export const centered = createVar()

export const GridWrapper = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(12, [col-start] 1fr)',
	justifyItems: centered,
	gridAutoFlow: 'dense'
})

globalStyle(`${GridWrapper} > *`, {
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
	}
})
