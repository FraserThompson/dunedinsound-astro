import { style, createVar, fallbackVar } from '@vanilla-extract/css'
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
	textAlign: 'left',
	maxWidth: '450px',
	clipPath: 'border-box',
	boxSizing: 'border-box',
	boxShadow: theme.borders.shadowLight,
	width: '100%',
	marginRight: 'auto',
	zIndex: '1',
	borderBottomRightRadius: '6px',
	'@media': {
		'screen and (--md)': {
			width: 'auto',
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
