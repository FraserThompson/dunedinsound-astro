import { createVar, fallbackVar, globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const top = createVar()

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
	zIndex: '6',
	position: 'sticky',
	top: fallbackVar(top, theme.dimensions.headerHeight),
	paddingLeft: '0px'
})

globalStyle(`${shuffleFilter} > div`, {
	paddingRight: theme.dimensions.basePadding
})
