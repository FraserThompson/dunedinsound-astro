import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const TopSubheader = style({
	zIndex: '6',
	position: 'sticky',
	top: '0px',
	borderBottom: '1px solid black',
	boxShadow: theme.borders.shadowLight,
	backgroundColor: theme.color.primary
})

export const Content = style({
	marginLeft: 0,
	position: 'relative',
	boxShadow: theme.borders.shadow,
	marginBottom: theme.dimensions.headerHeight,
	'@media': {
		'screen and (--md)': {
			marginBottom: '0px',
			marginLeft: theme.dimensions.headerHeight
		}
	}
})
