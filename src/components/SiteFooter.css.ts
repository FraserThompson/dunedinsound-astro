import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const footerWrapper = style({
	backgroundColor: theme.color.primary,
	minHeight: theme.dimensions.footerHeight,
	position: 'fixed',
	bottom: theme.dimensions.headerHeight,
	paddingLeft: '0',
	boxSizing: "border-box",
	width: '100%',
	'@media': {
		'screen and (--xs)': {
			bottom: '0',
			paddingLeft: theme.dimensions.sidebarWidth
		}
	}
})

export const footerContent = style({
	color: theme.color.text,
	textAlign: 'center',
	padding: theme.dimensions.basePadding,
	paddingTop: '2em'
})
