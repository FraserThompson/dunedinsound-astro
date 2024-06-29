import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const siteContainer = style({
	minHeight: theme.dimensions.viewportHeight,
	backgroundColor:  theme.color.background,
	boxShadow: '0 6px 12px rgba(0, 0, 0, 0.8)',
	height: '100%',
	width: '100%',
	zIndex: '2',
	position: 'relative',
	bottom: '0',
	marginBottom: theme.dimensions.footerHeight,
	marginTop: theme.dimensions.headerHeightMobile,
	'@media': {
		'screen and (--md)': {
			marginTop: theme.dimensions.headerHeight,
			marginBottom: theme.dimensions.footerHeight
		}
	}
})
