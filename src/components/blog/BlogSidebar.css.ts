import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const blogSidebarWrapper = style({
	padding: theme.dimensions.basePadding,
	display: 'none',
	minWidth: '320px',
	'@media': {
		'screen and (--md)': {
			display: 'block'
		}
	}
})

export const featuredLinks = style({
	border: '1px solid white',
	margin: theme.dimensions.basePadding,
	padding: theme.dimensions.basePadding
})
