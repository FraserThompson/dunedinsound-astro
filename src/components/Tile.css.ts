import { createVar, fallbackVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const background = createVar()
export const height = createVar()
export const heightMobile = createVar()
export const width = createVar()

const tileWrapperBase = style({
	color: theme.color.text,
	position: 'relative',
	overflow: 'clip',
	height: fallbackVar(heightMobile, height, '40vh'),
	scrollMarginTop: theme.dimensions.headerHeightMobileWithSubheader,
	border: `1px solid ${theme.color.background}`,
	boxSizing: 'border-box',
	'@media': {
		'screen and (--md)': {
			height: fallbackVar(height, '40vh')
		},
		'screen and (--xs)': {
			scrollMarginTop: theme.dimensions.headerHeightWithSubheader
		}
	}
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
	background: fallbackVar(background, 'black'),
	width: '100%',
	height: fallbackVar(heightMobile, height, '40vh'),
	transition: 'height 100ms ease-in-out',
	position: 'relative',
	selectors: {
		'&:hover': {
			color: theme.color.lightText,
			textDecoration: 'none'
		}
	},
	'@media': {
		'screen and (--md)': {
			height: fallbackVar(height, '40vh')
		}
	}
})

globalStyle(`${tileInner} > a:hover`, {
	color: theme.color.lightText
})

globalStyle(`${tileInner} > a`, {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	color: theme.color.text
})

export const titleWrapper = style({
	zIndex: '5',
	position: 'absolute',
	bottom: '0px',
	background: 'radial-gradient(circle, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 70%)',
	height: '100%',
	width: '100%',
	display: 'flex'
})

export const tileContent = style({
	width: '100%',
	marginLeft: '0',
	display: 'flex',
	flexDirection: 'column',
	padding: theme.dimensions.basePaddingMobile,
	paddingTop: theme.dimensions.basePadding,
	'@media': {
		'screen and (--xs)': {
			padding: theme.dimensions.basePadding
		}
	}
})

export const tileTextContent = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center'
})

export const centerImageWrapper = style({
	padding: 0,
})

export const tileLabel = style({
	fontWeight: 600,
	position: 'absolute',
	top: 0,
	left: 0,
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	borderBottomRightRadius: '6px',
	backgroundColor: 'white',
	color: theme.color.darkText,
	'@media': {
		'screen and (--xs)': {
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${tileTextContent} > div`, {
	maxWidth: theme.dimensions.contentContainerWidth
})

export const tileTitle = style({
	marginLeft: '0',
	marginBottom: '2px',
	paddingTop: '10px',
	color: 'inherit',
	textShadow: '1px 1px 1px black',
	transition: 'color 100ms ease-in-out'
})

export const tileSubtitle = style({
	transition: 'color 100ms ease-in-out'
})

globalStyle(`${tileInner}:hover img`, {
	transform: 'scale(1.02, 1.02) !important'
})
