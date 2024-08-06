import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const searchboxWrapper = style({
	minWidth: theme.dimensions.sidebarWidth,
	width: '100%',
	'@media': {
		'screen and (--xs)': {
			width: 'auto'
		}
	}
})
