import { style } from '@vanilla-extract/css'
import { theme } from '../ThemeContract.css'

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
