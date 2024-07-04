import { createVar, fallbackVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const color = createVar()
const backgroundColor = createVar()

const dividerBase = style({
	color: fallbackVar(color, 'black'),
	lineHeight: '2',
	verticalAlign: 'middle',
	display: 'flex',
	alignItems: 'center',
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	backgroundColor: fallbackVar(backgroundColor, theme.color.contrast),
	borderBottom: '1px solid black',
	top: '10px',
	zIndex: '6',
	boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
})

globalStyle(`${dividerBase} a`, {
	color: fallbackVar(color, 'black'),
	width: "100%"
})

export const dividerWrapper = styleVariants({
	sticky: [
		{
			position: 'sticky',
			zIndex: '6',
			boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
			top: '0px',
			'@media': {
				'screen and (--md)': {
					top: theme.dimensions.headerHeight
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
