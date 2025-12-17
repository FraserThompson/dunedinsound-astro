import { style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'

export const artistWrapper = style({
	scrollMarginTop: theme.dimensions.headerHeightMobile,
	'@media': {
		'screen and (--md)': {
			scrollMarginTop: theme.dimensions.headerHeight,
		}
	}
})
