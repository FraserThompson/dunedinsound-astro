import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const MapWrapperStyle = style({
	height: `calc(100vh - ${theme.dimensions.headerHeight} - ${theme.dimensions.headerHeight})`,
	'@media': {
		'screen and (--xs)': {
			height: `calc(100vh - ${theme.dimensions.headerHeight})`,
		}
	}
})
