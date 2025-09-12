import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

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

export const spacer = style({
	padding: '0px',
	paddingTop: '0px',
	'@media': {
		'screen and (--md)': {
			paddingTop: theme.dimensions.headerHeight
		}
	}
})

export const socialLinksWrapper = style({
	position: 'absolute',
	right: theme.dimensions.basePaddingMobile,
	top: '4px',
	zIndex: 3,
	'@media': {
		'screen and (--md)': {
			top: theme.dimensions.headerHeight,
			paddingTop: theme.dimensions.basePaddingMobile,
			right: 'auto',
			left: theme.dimensions.basePaddingMobile
		}
	}
})
