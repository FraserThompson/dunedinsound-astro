import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const TopSubheader = style({
	zIndex: '6',
	position: 'sticky',
	top: '0px',
	borderBottom: '1px solid black',
	boxShadow: theme.borders.shadow
})

export const Content = style({
	marginLeft: theme.dimensions.headerHeight
})
