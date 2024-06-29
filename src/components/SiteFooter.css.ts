import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const footerWrapper = style({
	backgroundColor: theme.color.primary,
	minHeight: theme.dimensions.footerHeight,
	position: 'fixed',
	bottom: theme.dimensions.headerHeightMobile,
	width: '100%',
	'@media': {
		'screen and (--xs)': {
			bottom: '0'
		}
	}
})

export const footerContent = style({
	color: theme.color.text,
	textAlign: 'center',
	padding: theme.dimensions.basePadding,
	paddingTop: '2em'
})
