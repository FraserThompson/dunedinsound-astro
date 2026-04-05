import { style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

export const popoverContent = style({
	top: theme.dimensions.headerHeightMobile,
	position: 'fixed',
	margin: '0',
	backgroundColor: theme.color.background,
	color: theme.color.text,
	borderRadius: '4px',
	border: theme.borders.contrast,
	boxShadow: theme.borders.shadow,
	padding: theme.dimensions.basePaddingMobile,
	'@media': {
		'screen and (--md)': {
			top: theme.dimensions.headerHeight,
			left: 'auto',
			padding: theme.dimensions.basePadding,
		}
	}
})

export const popoverButton = style({
	height: theme.dimensions.headerHeightMobile,
	width: theme.dimensions.headerHeightMobile,
	padding: 0,
	'@media': {
		'screen and (--md)': {
			height: theme.dimensions.headerHeight,
			width: theme.dimensions.headerHeight
		}
	},
})
