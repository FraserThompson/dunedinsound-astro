import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const MapWrapperStyle = style({
	height: `calc(100vh - ${theme.dimensions.headerHeightMobile} - ${theme.dimensions.headerHeightMobile} - ${theme.dimensions.headerHeightMobile})`,
	'@media': {
		'screen and (--xs)': {
			height: `calc(100vh - ${theme.dimensions.headerHeight})`,
		}
	}
})
