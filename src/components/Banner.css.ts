import { style, createVar, fallbackVar, globalStyle } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const bannerHeight = createVar()
export const bannerHeightMobile = createVar()
export const marginBottom = createVar()
export const marginBottomMobile = createVar()

export const BannerWrapper = style({
	background: 'radial-gradient(circle, black 0%, rgba(12, 24, 33, 1) 70%)',
	height: fallbackVar(bannerHeightMobile, 'auto'),
	overflow: 'hidden',
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	zIndex: '8',
	marginBottom: fallbackVar(marginBottomMobile, marginBottom, '0px'),
	'@media': {
		'screen and (--md)': {
			height: fallbackVar(bannerHeight, theme.dimensions.defaultBannerHeight),
			marginBottom: fallbackVar(marginBottom, '0px')
		}
	}
})

export const BackgroundContent = style({
	position: 'static',
	zIndex: '0',
	width: '100%',
	height: '100%',
	'@media': {
		'screen and (--md)': {
			position: 'absolute'
		}
	}
})

export const CustomContent = style({
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center'
})

globalStyle(`${CustomContent} > *`, {
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center'
})

export const BannerContent = style({
	zIndex: '8',
	padding: 0,
	paddingTop: 0,
	margin: '0 auto',
	textAlign: 'center',
	height: '100%',
	width: '100%',
	'@media': {
		'screen and (--md)': {
			position: 'absolute',
			height: 'auto'
		}
	}
})

export const BannerContentOverlay = style({
	flexGrow: '1',
	display: 'flex',
	flexDirection: 'column',
	margin: '0 auto',
	textAlign: 'center',
	selectors: {
		'&:not(:empty)': {
			background: 'rgba(8,9,12,0.7)',
			boxShadow: theme.borders.shadowLight
		}
	}
})

export const BannerSubtitle = style({
	margin: '0 auto',
	textAlign: 'center',
	width: '100%',
	paddingTop: '5px',
	paddingBottom: '5px',
	position: 'relative',
	zIndex: '1',
	selectors: {
		'&:not(:empty)': {
			background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.9), rgba(75, 0, 77, 0.8))',
			boxShadow: theme.borders.shadowLight
		}
	}
})

export const BannerTitle = style({
	filter: 'drop-shadow(2px 2px 10px black)',
	background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.9), rgba(63, 146, 247, 0.6))',
	boxShadow: theme.borders.shadowLight,
	padding: '5px',
	position: 'relative',
	zIndex: '2'
})
