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

export const filtersWrapper = style({
	zIndex: '8',
	position: 'sticky',
	top: theme.dimensions.headerHeight,
	paddingLeft: '0px'
})

globalStyle(`${shuffleFilter} > div`, {
	paddingRight: theme.dimensions.basePadding
})
