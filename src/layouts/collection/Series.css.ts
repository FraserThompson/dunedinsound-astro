import { style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'

export const sideTextWrapper = style({
	height: '100%',
	position: "relative",
	maxWidth: 'initial',
	'@media': {
		'screen and (--md)': {
			height: '100%',
			position: "fixed",
			maxWidth: theme.dimensions.sidebarWidth
		}
	}
})

export const gigsWrapper = style({
	marginLeft: 0,
	'@media': {
		'screen and (--md)': {
			marginLeft: theme.dimensions.sidebarWidth
		}
	}
})
