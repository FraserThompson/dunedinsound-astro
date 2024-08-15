import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const blogSidebarWrapper = style({
	padding: theme.dimensions.basePadding,
	minWidth: '320px',
})

export const featuredLinks = style({
	border: '1px solid white',
	margin: theme.dimensions.basePadding,
	padding: theme.dimensions.basePadding
})
