import { createVar, fallbackVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

export const dividerColor = createVar()
export const dividerBackgroundColor = createVar()
export const dividerZIndex = createVar()
export const dividerHeight = createVar()
export const dividerHeightMobile = createVar()
export const dividerMarginBottom = createVar()

export const stickyTop = createVar()
export const stickyTopMobile = createVar()

const dividerBase = style({
	height: fallbackVar(dividerHeightMobile, dividerHeight, theme.dimensions.subheaderHeight),
	color: fallbackVar(dividerColor, theme.color.darkText),
	lineHeight: '2',
	verticalAlign: 'middle',
	display: 'flex',
	alignItems: 'center',
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	backgroundColor: fallbackVar(dividerBackgroundColor, theme.color.contrast),
	borderBottom: '1px solid black',
	top: '10px',
	zIndex: fallbackVar(dividerZIndex, '6'),
	boxShadow: theme.borders.shadow,
	marginBottom: fallbackVar(dividerMarginBottom, '0px'),
	'@media': {
		'screen and (--md)': {
			height: fallbackVar(dividerHeight, theme.dimensions.subheaderHeight),
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${dividerBase} a`, {
	color: fallbackVar(dividerColor, theme.color.darkText),
	width: '100%'
})

globalStyle(`${dividerBase} a:hover`, {
	color: 'black',
	width: '100%'
})

export const dividerWrapper = styleVariants({
	sticky: [
		{
			position: 'sticky',
			zIndex: fallbackVar(dividerZIndex, '6'),
			boxShadow: theme.borders.shadow,
			top: fallbackVar(stickyTopMobile, stickyTop, '0px'),
			'@media': {
				'screen and (--md)': {
					top: fallbackVar(stickyTop, '0px')
				}
			}
		},
		dividerBase
	],
	normal: [
		{
			position: 'relative',
			zIndex: fallbackVar(dividerZIndex, '5')
		},
		dividerBase
	]
})
