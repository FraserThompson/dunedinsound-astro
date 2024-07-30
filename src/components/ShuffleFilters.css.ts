import { createVar, globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const top = createVar()

export const shuffleFilter = style({
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	display: 'flex',
	alignItems: 'center',
	color: theme.color.text,
	minHeight: theme.dimensions.subheaderHeight,
})

globalStyle(`${shuffleFilter} > div`, {
	paddingRight: theme.dimensions.basePadding
})
