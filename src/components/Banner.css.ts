import { style, createVar, fallbackVar } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const bannerHeight = createVar()
export const marginBottom = createVar()
export const marginBottomMobile = createVar()

export const BannerWrapper = style({
	background: 'radial-gradient(circle, black 0%, rgba(12, 24, 33, 1) 70%)',
	height: 'auto',
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
	display: 'flex'
})

export const BannerContent = style({
	zIndex: '8',
	flexGrow: '1',
	padding: 0,
	paddingTop: 0,
	display: 'flex',
	flexDirection: 'column',
	margin: '0 auto',
	textAlign: 'center',
	height: '100%',
	width: '100%',
	'@media': {
		'screen and (--md)': {
			position: 'absolute',
			padding: theme.dimensions.basePadding,
			paddingTop: '1.5em',
			width: theme.dimensions.contentContainerWidth,
			height: 'auto'
		}
	}
})

export const BannerTitle = style({
	filter: 'drop-shadow(2px 2px 10px black)',
	backdropFilter: 'hue-rotate(240deg)',
	background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.8), rgba(63, 146, 247, 0.2))',
	border: '2px inset',
	padding: '5px'
})
