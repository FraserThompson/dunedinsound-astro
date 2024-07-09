import { createVar, fallbackVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const dividerColor = createVar()
export const dividerBackgroundColor = createVar()

export const stickyTop = createVar()

const dividerBase = style({
	height: theme.dimensions.subheaderHeight,
	color: fallbackVar(dividerColor, 'black'),
	lineHeight: '2',
	verticalAlign: 'middle',
	display: 'flex',
	alignItems: 'center',
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	backgroundColor: fallbackVar(dividerBackgroundColor, theme.color.contrast),
	borderBottom: '1px solid black',
	top: '10px',
	zIndex: '6',
	boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
})

globalStyle(`${dividerBase} a`, {
	color: fallbackVar(dividerColor, 'black'),
	width: "100%"
})

export const dividerWrapper = styleVariants({
	sticky: [
		{
			position: 'sticky',
			zIndex: '6',
			boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
			top: fallbackVar(stickyTop, '0px'),
			'@media': {
				'screen and (--md)': {
					top: fallbackVar(stickyTop, theme.dimensions.headerHeight)
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
