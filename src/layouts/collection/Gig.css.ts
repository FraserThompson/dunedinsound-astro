import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const GigBannerPlayer = style({
	padding: 0,
	marginTop: 'auto',
	width: '100%'
})

export const GigFeatureVid = style({
	height: '100%',
	width: '100%',
	aspectRatio: '16/9',
	'@media': {
		'screen and (--md)': {
			height: '100%',
			margin: '0 auto',
			width: 'auto'
		}
	}
})
