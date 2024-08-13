import { createVar, style, globalStyle } from '@vanilla-extract/css'

export const flexXs = createVar()
export const widthXs = createVar()

export const flexMd = createVar()
export const widthMd = createVar()

export const flexLg = createVar()
export const widthLg = createVar()

export const maxWidth2 = createVar()

export const FlexGridWrapper = style({
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center'
})

globalStyle(`${FlexGridWrapper} > *`, {
	maxWidth: maxWidth2,
	flex: flexXs,
	width: widthXs,
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	justifyContent: 'center',
	'@media': {
		'screen and (--xs)': {
			flex: flexMd,
			width: widthMd
		},
		'screen and (--md)': {
			flex: flexLg,
			width: widthLg
		}
	}
})
