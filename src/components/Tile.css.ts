import { createVar, fallbackVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const background = createVar()
export const height = createVar()
export const width = createVar()
export const heightHover = createVar()
export const fontSize = createVar()

const tileWrapperBase = style({
	background: fallbackVar(background, 'radial-gradient(circle, black 0%, #161616 70%)'),
	color: theme.color.text,
	position: 'relative',
	display: 'block',
	height: fallbackVar(height, '40vh'),
	overflow: 'hidden'
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
	height: '100%',
	width: '100%',
	position: 'relative',
	transition: 'height 100ms ease-in-out',
	selectors: {
		'&:hover': {
			height: fallbackVar(height, '42vh'),
			color: theme.color.lightText,
			textDecoration: 'none'
		}
	}
})

export const titleWrapper = style({
	zIndex: '5',
	position: 'absolute',
	bottom: '0px',
	background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4) 60%)',
	height: '100%',
	width: '100%',
	display: 'flex'
})

export const tileContent = style({
	width: '100%',
	marginLeft: '0',
	display: 'flex',
	flexDirection: 'column'
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
	marginBottom: '5px',
	color: 'inherit',
	textShadow: '1px 1px 1px black',
	transition: 'color 100ms ease-in-out'
})

export const tileSubtitle = style({
	margin: '0px',
	marginTop: 'auto',
	lineHeight: '0.9',
	textShadow: '1px 1px 1px black',
	transition: 'color 100ms ease-in-out'
})

export const tileLabel = style({
	textShadow: '1px 1px 1px black',
	transition: 'color 100ms ease-in-out'
})
