import { globalStyle, style, createVar, fallbackVar } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

export const marginBottom = createVar()
export const marginBottomMobile = createVar()

export const clusterizeScroll = style({
	paddingBottom: fallbackVar(marginBottomMobile, marginBottom, '0px'),
	maxHeight: `calc(100vh - ${theme.dimensions.headerHeightMobile}) !important`,
	'@media': {
		'screen and (--md)': {
			maxHeight: `calc(100vh - ${theme.dimensions.headerHeight}) !important`,
			paddingBottom: fallbackVar(marginBottom, '0px')
		}
	}
})

globalStyle(`.grid-row`, {
	display: 'grid',
	'gridTemplateColumns': 'repeat(4, 1fr);'
})
