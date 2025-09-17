import { style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

export const headerWrapper = style({
	position: 'fixed',
	top: '0px',
	left: '0px',
	width: theme.dimensions.headerHeight,
	borderBottom: theme.borders.primary,
	height: '100vh'
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
			paddingLeft: '0'
		}
	}
})

export const headerMobile = style({
	position: 'fixed',
	bottom: '0',
	backgroundColor: theme.color.primary,
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

export const infoLink = style({
	position: 'absolute',
	color: 'white',
	bottom: '0px',
	paddingBottom: '4px',
	paddingTop: '4px',
	display: 'flex',
	justifyContent: 'center',
	width: theme.dimensions.headerHeight,
	zIndex: '6',
	selectors: {
		'&.active': {
			backgroundColor: theme.color.secondary
		}
	}
})
