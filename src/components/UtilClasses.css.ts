import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const SubheaderBase = style({
	zIndex: '6',
	position: 'fixed',
	width: '100%',
	borderBottom: '1px solid black',
	boxShadow: theme.borders.shadow,
	backgroundColor: theme.color.primary,
	height: theme.dimensions.headerHeightMobile,
	'@media': {
		'screen and (--md)': {
			width: `calc(100% - ${theme.dimensions.headerHeight})`,
			height: theme.dimensions.subheaderHeight
		}
	}
})

export const Subheader = styleVariants({
	top: [
		SubheaderBase,
		{
			top: 0
		}
	],
	topDesktop: [
		SubheaderBase,
		{
			bottom: '-100px ',
			zIndex: 9,
			'@media': {
				'screen and (--md)': {
					zIndex: 6,
					display: 'flex',
					top: 0
				}
			}
		}
	],
	topMobile: [
		SubheaderBase,
		{
			display: 'flex',
			top: 0,
			'@media': {
				'screen and (--md)': {
					display: 'none'
				}
			}
		}
	],
	bottomMobile: [
		SubheaderBase,
		{
			bottom: theme.dimensions.headerHeightMobile,
			'@media': {
				'screen and (--md)': {
					bottom: theme.dimensions.headerHeight
				}
			}
		}
	]
})

export const Content = style({
	boxSizing: 'border-box',
	position: 'relative',
	height: '100%',
	boxShadow: theme.borders.shadow,
	marginLeft: 0,
	'@media': {
		'screen and (--md)': {
			marginLeft: theme.dimensions.headerHeight
		}
	}
})

export const WithTopSubheader = style({
	marginTop: theme.dimensions.headerHeightMobile,
	'@media': {
		'screen and (--md)': {
			marginTop: theme.dimensions.subheaderHeight
		}
	}
})

export const WithTopSubheaderMobile = style({
	marginTop: theme.dimensions.headerHeightMobile,
	'@media': {
		'screen and (--md)': {
			marginTop: '0px'
		}
	}
})

export const WithBottomSubheaderMobile = style({
	marginBottom: theme.dimensions.headerHeightMobile,
	'@media': {
		'screen and (--md)': {
			marginBottom: '0px'
		}
	}
})

const SiteContainerBase = style({
	minHeight: theme.dimensions.viewportHeight,
	backgroundColor: theme.color.background,
	boxShadow: theme.borders.shadow,
	height: '100%',
	width: '100%',
	zIndex: '2',
	position: 'relative',
	bottom: '0'
})

export const SiteContainer = styleVariants({
	default: [
		SiteContainerBase,
		{
			marginBottom: theme.dimensions.footerHeight,
			'@media': {
				'screen and (--md)': {
					marginBottom: theme.dimensions.footerHeight
				}
			}
		}
	],
	hideFooter: [SiteContainerBase]
})
