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
	position: 'relative',
	zIndex: '0',
	width: '100%',
	height: 'auto',
	'@media': {
		'screen and (--md)': {
			position: 'absolute',
			height: '100%'
		}
	}
})

export const BannerSubtitle = style({
	margin: '0 auto',
	textAlign: 'center',
	width: '100%',
	maxWidth: '450px',
	paddingTop: theme.dimensions.headerHeightMobile,
	marginBottom: 0,
	position: 'relative',
	zIndex: '1',
	'@media': {
		'screen and (--md)': {
			marginBottom: theme.dimensions.headerHeight,
			marginTop: 'auto',
			paddingTop: 0
		}
	},
	selectors: {
		'&:not(:empty)': {
			background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.9), rgba(75, 0, 77, 0.8))',
			boxShadow: theme.borders.shadowLight
		}
	}
})

export const BannerTitle = style({
	height: theme.dimensions.headerHeightMobile,
	backdropFilter: 'blur(5px)',
	width: '100%',
	filter: 'drop-shadow(2px 2px 10px black)',
	display: 'flex',
	alignItems: 'center',
	background: 'linear-gradient(90deg, rgba(63, 146, 247, 0.6), rgba(0, 0, 0, 0.9))',
	boxShadow: theme.borders.shadowLight,
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	boxSizing: 'border-box',
	position: 'relative',
	zIndex: '2',
	'@media': {
		'screen and (--md)': {
			height: theme.dimensions.headerHeight,
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding
		}
	}
})
