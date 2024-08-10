import { createVar, fallbackVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const dividerColor = createVar()
export const dividerBackgroundColor = createVar()

export const stickyTop = createVar()
export const stickyTopMobile = createVar()

const dividerBase = style({
	height: theme.dimensions.subheaderHeight,
	color: fallbackVar(dividerColor, 'black'),
	lineHeight: '2',
	verticalAlign: 'middle',
	display: 'flex',
	alignItems: 'center',
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	backgroundColor: fallbackVar(dividerBackgroundColor, theme.color.contrast),
	borderBottom: '1px solid black',
	top: '10px',
	zIndex: '6',
	boxShadow: theme.borders.shadow,
	'@media': {
		'screen and (--xs)': {
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${dividerBase} a`, {
	color: fallbackVar(dividerColor, 'black'),
	width: '100%'
})

export const dividerWrapper = styleVariants({
	sticky: [
		{
			position: 'sticky',
			zIndex: '6',
			boxShadow: theme.borders.shadow,
			top: fallbackVar(stickyTopMobile || stickyTop, '0px'),
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
			zIndex: '5'
		},
		dividerBase
	]
})
