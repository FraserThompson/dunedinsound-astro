import { style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

export const modalContent = style({
	position: 'absolute',
	display: 'none',
	top: theme.dimensions.headerHeightMobile,
	left: '0px',
	backgroundColor: theme.color.background,
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
	},
	selectors: {
		'&.open': {
			display: 'block'
		}
	}
})

export const modalButton = style({
	height: theme.dimensions.headerHeightMobile,
	'@media': {
		'screen and (--md)': {
			height: theme.dimensions.headerHeight
		}
	},
})
