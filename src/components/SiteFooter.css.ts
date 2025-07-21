import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const footerWrapper = style({
	backgroundColor: theme.color.primary,
	background: `linear-gradient(180deg, rgba(27, 69, 120, 0.4), rgba(0, 0, 0, 1))`,
	minHeight: theme.dimensions.footerHeight,
	position: 'fixed',
	bottom: theme.dimensions.headerHeightMobile,
	boxSizing: "border-box",
	width: '100%',
	'@media': {
		'screen and (--md)': {
			bottom: '0',
		}
	}
})

export const footerContent = style({
	color: theme.color.text,
	textAlign: 'center',
	padding: theme.dimensions.basePadding,
	paddingTop: '4em',
	selectors: {
		'&.hasSidebar': {
			'@media': {
				'screen and (--md)': {
					paddingLeft: theme.dimensions.sidebarWidth
				}
			}
		}
	}
})
