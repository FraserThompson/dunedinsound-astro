import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const TopSubheader = style({
	zIndex: '6',
	position: 'fixed',
	width: '100%',
	top: '0px',
	borderBottom: '1px solid black',
	boxShadow: theme.borders.shadowLight,
	backgroundColor: theme.color.primary,
	'@media': {
		'screen and (--md)': {
			width: `calc(100% - ${theme.dimensions.headerHeight})`,
		}
	}
})

export const Content = style({
	marginLeft: 0,
	position: 'relative',
	height: '100%',
	boxShadow: theme.borders.shadow,
	marginTop: 0,
	marginBottom: theme.dimensions.headerHeight,
	'@media': {
		'screen and (--md)': {
			marginBottom: '0px',
			marginTop: theme.dimensions.headerHeight,
			marginLeft: theme.dimensions.headerHeight
		}
	}
})
