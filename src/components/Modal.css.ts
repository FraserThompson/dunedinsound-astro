import { style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

export const modalContent = style({
	position: 'absolute',
	visibility: 'hidden',
	opacity: 0,
	pointerEvents: 'none',
	top: theme.dimensions.headerHeightMobile,
	left: '0px',
	backgroundColor: theme.color.background,
	borderRadius: '4px',
	border: theme.borders.contrast,
	boxShadow: theme.borders.shadow,
	padding: theme.dimensions.basePaddingMobile,
	transitionProperty: 'visibility, opacity',
	transitionDuration: '0.3s',
	'@media': {
		'screen and (--md)': {
			top: theme.dimensions.headerHeight,
			left: 'auto',
			padding: theme.dimensions.basePadding,
		}
	},
	selectors: {
		'&.open': {
			visibility: 'visible',
			opacity: 1,
			pointerEvents: 'auto',
		}
	}
})

export const modalButton = style({
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
