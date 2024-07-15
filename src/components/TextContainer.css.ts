import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const textContainer = style({
	padding: theme.dimensions.basePadding,
	maxWidth: theme.dimensions.contentContainerWidth,
	margin: '0 auto'
})
