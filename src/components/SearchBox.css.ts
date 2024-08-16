import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const searchboxWrapper = style({
	display: "flex",
	alignItems: "center",
	minWidth: theme.dimensions.sidebarWidth,
	width: '100%',
	'@media': {
		'screen and (--md)': {
			width: 'auto'
		}
	}
})
