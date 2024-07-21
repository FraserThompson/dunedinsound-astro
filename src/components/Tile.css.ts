import { createVar, fallbackVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const background = createVar()
export const height = createVar()
export const width = createVar()
export const fontSize = createVar()

const tileWrapperBase = style({
	color: theme.color.text,
	position: 'relative',
	overflow: 'clip',
	scrollMarginTop: theme.dimensions.headerHeightWithSubheader
})

/**
 * This is because we want NO width property set at all when its used in a Shuffle board.
 */
export const tileWrapper = styleVariants({
	fixedWidth: [
		tileWrapperBase,
		{
			width: width
		}
	],
	noWidth: [tileWrapperBase]
})

export const tileInner = style({
	background: fallbackVar(background, 'radial-gradient(circle, black 0%, #161616 70%)'),
	width: '100%',
	height: fallbackVar(height, '40vh'),
	transition: 'height 100ms ease-in-out',
	position: 'relative',
	selectors: {
		'&:hover': {
			color: theme.color.lightText,
			textDecoration: 'none'
		}
	}
})

globalStyle(`${tileInner} > a`, {
	color: theme.color.text
})

export const titleWrapper = style({
	zIndex: '5',
	position: 'absolute',
	bottom: '0px',
	background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0) 95%)',
	height: '100%',
	width: '100%',
	display: 'flex'
})

export const tileContent = style({
	width: '100%',
	marginLeft: '0',
	display: 'flex',
	flexDirection: 'column',
	padding: theme.dimensions.basePadding
})

export const tileTextContent = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center'
})

globalStyle(`${tileTextContent} > div`, {
	maxWidth: theme.dimensions.contentContainerWidth
})

export const tileTitle = style({
	marginLeft: '0',
	textAlign: 'center',
	marginBottom: '5px',
	color: 'inherit',
	textShadow: '1px 1px 1px black',
	transition: 'color 100ms ease-in-out'
})

export const tileLabel = style({
	textShadow: '1px 1px 1px black',
	transition: 'color 100ms ease-in-out',
	textAlign: 'center'
})

globalStyle(`${tileInner}:hover .backgroundImage`, {
	transform: 'scale(1.02, 1.02) !important'
})
