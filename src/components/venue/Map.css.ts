import { createVar, fallbackVar, style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'

export const mapHeight = createVar()
export const mapHeightMobile = createVar()

export const MapWrapperStyle = style({
	// Default: fall back to `vh` for broad compatibility
	height: fallbackVar(
		mapHeightMobile,
		mapHeight,
		`calc(100vh - ${theme.dimensions.headerHeightMobile} - ${theme.dimensions.headerHeightMobile} - ${theme.dimensions.headerHeightMobile})`
	),
	'@media': {
		'screen and (--md)': {
			height: fallbackVar(mapHeight, `calc(100vh - ${theme.dimensions.headerHeight})`)
		}
	},
	// When dvh is supported, override both the default and the md breakpoint inside a single @supports block
	'@supports': {
		'(height: 1dvh)': {
			height: fallbackVar(
				mapHeightMobile,
				mapHeight,
				`calc(100dvh - ${theme.dimensions.headerHeightMobile} - ${theme.dimensions.headerHeightMobile} - ${theme.dimensions.headerHeightMobile})`
			),
			'@media': {
				'screen and (--md)': {
					height: fallbackVar(mapHeight, `calc(100dvh - ${theme.dimensions.headerHeight})`)
				}
			}
		}
	}
})
