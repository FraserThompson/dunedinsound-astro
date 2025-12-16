import { style, createVar, fallbackVar } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

export const marginBottom = createVar()
export const marginBottomMobile = createVar()

export const clusterizeScroll = style({
	overflow: 'auto',
	maxHeight: `calc(100dvh - ${theme.dimensions.headerHeightMobile} - ${fallbackVar(marginBottomMobile, '0px')})`,
	'@media': {
		'screen and (--md)': {
			maxHeight: `calc(100vh - ${theme.dimensions.headerHeight} - ${fallbackVar(marginBottom, '0px')})`,
			'@supports': {
				'(height: 1dvh)': {
					maxHeight: `calc(100dvh - ${theme.dimensions.headerHeight} - ${fallbackVar(marginBottom, '0px')})`
				}
			}
		}
	}
})
