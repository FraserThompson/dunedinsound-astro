import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const GigBannerPlayer = style({
	padding: 0,
	marginTop: 'auto',
	width: '100%',
	'@media': {
		'screen and (--md)': {
			padding: `calc(${theme.dimensions.basePadding} * 2)`
		}
	}
})
