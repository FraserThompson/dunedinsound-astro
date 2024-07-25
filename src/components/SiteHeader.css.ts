import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const headerWrapper = style({
	position: 'sticky',
	top: '0px',
	width: '100%',
	zIndex: '12',
	boxShadow: theme.borders.shadowLight,
	borderBottom: theme.borders.primary,
	height: theme.dimensions.headerHeight
})

export const header = style({
	backgroundColor: theme.color.primary,
	position: 'fixed',
	width: '100%',
	flexDirection: 'row',
	justifyItems: 'center',
	top: '0px',
	zIndex: '10',
	color: theme.color.text,
	boxShadow: theme.borders.shadowLight,
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
