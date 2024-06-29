import { createVar, style, globalStyle } from '@vanilla-extract/css'

export const flexDefault = createVar()
export const widthDefault = createVar()

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
	flex: flexDefault,
	width: widthDefault,
	maxWidth: maxWidth2,
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	'@media': {
		'screen and (--xs)': {
			flex: flexXs,
			width: widthXs,
			flexDirection: 'row'
		},
		'screen and (--md)': {
			flex: flexMd,
			width: widthMd,
			flexDirection: 'row'
		},
		'screen and (--lg)': {
			flex: flexLg,
			width: widthLg,
			flexDirection: 'row'
		}
	}
})
