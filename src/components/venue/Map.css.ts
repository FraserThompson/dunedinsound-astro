import { createVar, fallbackVar, style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'

export const mapHeight = createVar()
export const mapHeightMobile = createVar()

export const MapWrapperStyle = style({
	height: fallbackVar(
		mapHeightMobile,
		mapHeight,
		`calc(100vh - ${theme.dimensions.headerHeightMobile} - ${theme.dimensions.headerHeightMobile} - ${theme.dimensions.headerHeightMobile})`
	),
	'@media': {
		'screen and (--md)': {
			height: fallbackVar(mapHeight, `calc(100vh - ${theme.dimensions.headerHeight})`)
		}
	}
})
