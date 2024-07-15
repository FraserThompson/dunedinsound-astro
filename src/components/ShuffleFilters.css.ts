import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const shuffleFilter = style({
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	display: 'flex',
	alignItems: 'center',
	color: 'black',
	minHeight: theme.dimensions.subheaderHeight,
	backgroundColor: theme.color.contrast
})

const filtersWrapperBase = style({
	zIndex: '8',
	position: 'sticky',
	top: theme.dimensions.headerHeight,
	paddingLeft: '0px'
})

export const filtersWrapper = styleVariants({
	normal: [filtersWrapperBase],
	sidebar: [
		filtersWrapperBase,
		{
			'@media': {
				'screen and (--md)': {
					paddingLeft: `calc(${theme.dimensions.sidebarWidth} + 5px)`
				}
			}
		}
	]
})

globalStyle(`${shuffleFilter} > div`, {
	paddingRight: theme.dimensions.basePadding
})
