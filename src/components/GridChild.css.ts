import { createVar, style } from '@vanilla-extract/css'

export const colXs = createVar()
export const colSm = createVar()
export const colMd = createVar()
export const colLg = createVar()

export const gridChild = style({
	gridColumn: colXs,
	'@media': {
		'screen and (--xs)': {
			gridColumn: colSm
		},
		'screen and (--sm)': {
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