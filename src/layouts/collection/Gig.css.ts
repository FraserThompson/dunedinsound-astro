import { style } from '@vanilla-extract/css'
import { theme } from '../../ThemeContract.css'

export const GigBannerPlayer = style({
	padding: '0px',
	width: '100%',
	boxSizing: 'border-box',
	marginTop: 'auto',
	'@media': {
		'screen and (--md)': {
			padding: theme.dimensions.basePadding
		}
	}
})

export const GigFeatureVid = style({
	height: 'auto',
	width: '100%',
	aspectRatio: '16/9',
	padding: 0,
	paddingTop: "25px",
	'@media': {
		'screen and (--md)': {
			padding: theme.dimensions.basePadding,
			height: '100%',
			margin: '0 auto',
			width: 'auto'
		}
	}
})
