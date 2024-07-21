import { createVar, fallbackVar, globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const top = createVar()

export const shuffleFilter = style({
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	display: 'flex',
	alignItems: 'center',
	color: theme.color.text,
	minHeight: theme.dimensions.subheaderHeight,
	backgroundColor: theme.color.background
})

export const filtersWrapper = style({
	zIndex: '6',
	position: 'sticky',
	top: fallbackVar(top, theme.dimensions.headerHeight),
	paddingLeft: '0px',
	borderBottom: '1px solid black',
	boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
})

globalStyle(`${shuffleFilter} > div`, {
	paddingRight: theme.dimensions.basePadding
})
