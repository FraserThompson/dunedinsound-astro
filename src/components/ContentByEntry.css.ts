import { style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

export const contentByEntryActiveWrapper = style({
	position: 'absolute',
	top: theme.dimensions.headerHeightMobile,
	right: '0px',
	zIndex: 3,
	borderBottomLeftRadius: "6px",
	clipPath: 'border-box',
	'@media': {
		'screen and (--md)': {
			top: theme.dimensions.headerHeight,
		}
	}
})

export const yearWrapper = style({
	scrollMarginTop: theme.dimensions.headerHeightMobile,
	'@media': {
		'screen and (--md)': {
			scrollMarginTop: theme.dimensions.headerHeight,
		}
	}
})

export const artistPlaylistWrapper = style({
	position: 'absolute',
	left: '5px',
	bottom: '40px'
})
