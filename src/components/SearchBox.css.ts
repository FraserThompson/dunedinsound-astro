import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const searchboxWrapper = style({
	minWidth: theme.dimensions.sidebarWidth,
	marginLeft: theme.dimensions.headerHeight,
	width: '100%',
	'@media': {
		'screen and (--xs)': {
			width: 'auto',
			marginLeft: 0
		}
	}
})
