import { createVar, fallbackVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { backgroundImageWrapper } from './BackgroundImage.css'
import { ImageWrapper } from './Image2.css'

export const background = createVar()
export const height = createVar()
export const heightMobile = createVar()
export const width = createVar()

const tileWrapperBase = style({
	color: theme.color.text,
	position: 'relative',
	overflow: 'clip',
	contentVisibility: 'auto',
	height: fallbackVar(heightMobile, height, '300px'),
	scrollMarginTop: theme.dimensions.headerHeightMobileWithSubheader,
	border: `1px solid ${theme.color.background}`,
	boxSizing: 'border-box',
	'@media': {
		'screen and (--md)': {
			height: fallbackVar(height, '300px')
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
	height: fallbackVar(heightMobile, height, '300px'),
	transition: 'height 100ms ease-in-out',
	position: 'relative',
	display: 'block',
	selectors: {
		'&:hover': {
			color: theme.color.lightText,
			textDecoration: 'none'
		},
	},
	'@media': {
		'screen and (--md)': {
			height: fallbackVar(height, '300px')
		}
	}
})

globalStyle(`${tileInner} > a:hover`, {
	color: theme.color.lightText
})

globalStyle(`${tileInner} > a`, {
	display: 'flex',
	alignItems: 'center',
	height: '100%',
	color: theme.color.text
})

export const tileContent = style({
	position: 'relative',
	boxSizing: 'border-box',
	background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.4) 70%)',
	marginLeft: '0',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	color: theme.color.lightText,
	padding: theme.dimensions.basePaddingMobile,
	'@media': {
		'screen and (--xs)': {
			padding: theme.dimensions.basePadding,
		}
	}
})

globalStyle(`${tileInner} > ${backgroundImageWrapper}, ${tileInner} > ${ImageWrapper}`, {
	position: 'absolute',
	width: '100%',
	height: '100%',
	top: 0,
	left: 0
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
	color: theme.color.lightText,
	marginLeft: '0',
	marginBottom: '2px',
	textShadow: '1px 1px 1px black',
	fontWeight: '400',
	maxWidth: '80%',
	position: 'relative',
	transition: 'color 100ms ease-in-out'
})

export const tileSubtitle = style({
	position: 'relative',
	transition: 'color 100ms ease-in-out'
})

globalStyle(`${tileInner}:hover img`, {
	transform: 'scale(1.02, 1.02) !important'
})

export const tileBottomContent = style({
	marginTop: 'auto',
	position: 'relative',
	marginBottom: '2px'
})
