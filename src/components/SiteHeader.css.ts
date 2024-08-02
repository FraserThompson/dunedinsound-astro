import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const headerWrapper = style({
	position: 'fixed',
	top: '0px',
	left: '0px',
	width: theme.dimensions.headerHeight,
	borderBottom: theme.borders.primary,
	height: '100vh',
})

export const header = style({
	backgroundColor: theme.color.primary,
	height: '100%',
	flexDirection: 'row',
	justifyItems: 'center',
	color: theme.color.text,
	borderBottom: theme.borders.primary,
	display: 'none',
	'@media': {
		'screen and (--md)': {
			display: 'flex',
			paddingLeft: '0',
		}
	}
})

export const headerMobile = style({
	position: 'fixed',
	bottom: '0',
	backgroundColor: theme.color.primary,
	display: 'flex',
	justifyContent: 'center',
	zIndex: '12',
	width: '100%',
	boxShadow: theme.borders.shadowTop,
	borderTop: theme.borders.primary,
	'@media': {
		'screen and (--md)': {
			display: 'none'
		}
	}
})

export const brand = style({
	marginRight: 'auto',
	color: theme.color.text,
	paddingLeft: theme.dimensions.basePadding,
	lineHeight: theme.dimensions.headerHeight,
	selectors: {
		'&:hover': {
			textDecoration: 'none',
			color: theme.color.secondary
		}
	},
	'@media': {
		'screen and (--md)': {
			display: 'block'
		}
	}
})

export const infoLink = style({
	position: 'absolute',
	color: 'white',
	bottom: '5px',
	display: 'flex',
	justifyContent: 'center',
	width: theme.dimensions.headerHeight
})
