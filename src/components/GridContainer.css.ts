import { createVar, style } from '@vanilla-extract/css'

export const colXs = createVar()
export const colSm = createVar()
export const colMd = createVar()
export const colLg = createVar()

export const gridWrapper = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(12, [col-start] 1fr)',
	gridAutoFlow: 'dense'
})

export const gridChild = style({
	gridColumn: `span ${colXs}`,
	'@media': {
		'screen and (--xs)': {
			gridColumn: `span ${colSm}`
		},
		'screen and (--md)': {
			gridColumn: `span ${colMd}`
		},
		'screen and (--lg)': {
			gridColumn: `span ${colLg}`
		}
	}
})
