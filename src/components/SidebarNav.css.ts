import { createVar, style, fallbackVar } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const defaultWidth = '80vw'

export const offsetTop = createVar()

export const sidebarWrapper = style({
	position: 'fixed',
	backgroundColor: theme.color.primary,
	height: `calc(100vh - ${fallbackVar(offsetTop, '0px')} - ${theme.dimensions.headerHeight})`,
	boxSizing: 'border-box',
	top: fallbackVar(offsetTop, '0px'),
	left: 0,
	bottom: theme.dimensions.headerHeight,
	width: defaultWidth,
	maxWidth: defaultWidth,
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: '10',
	boxShadow: theme.borders.shadow,
	borderRight: theme.borders.primary,
	visibility: 'hidden',
	opacity: 0,
	transform: 'translateX(-80vh)',
	pointerEvents: 'none',
	transitionProperty: 'opacity, transform',
	transitionDuration: '0.3s',
	transitionTimingFunction: 'cubic-bezier(0, 0, 0, 1.2)',
	willChange: 'transform',
	scrollbarWidth: 'thin',
	scrollbarColor: 'gray black',
	selectors: {
		'&.open': {
			visibility: 'visible',
			opacity: 1,
			transform: `translateX(0)`,
			pointerEvents: 'auto'
		}
	},
	'@media': {
		'screen and (--md)': {
			width: theme.dimensions.sidebarWidth,
			height: `calc(100vh - ${fallbackVar(offsetTop, '0px')})`,
			bottom: 0,
			visibility: 'visible',
			left: theme.dimensions.headerHeight,
			opacity: 1,
			transform: `translateX(0)`,
			pointerEvents: 'auto'
		}
	}
})

export const contentWrapper = style({
	marginLeft: 0,
	paddingTop: `${fallbackVar(offsetTop, '0px')}`,
	boxSizing: 'border-box',
	'@media': {
		'screen and (--md)': {
			paddingTop: '0px',
			paddingBottom: '0px',
			marginLeft: theme.dimensions.sidebarWidth
		}
	}
})

export const menuButtonWrapper = style({
	position: 'fixed',
	bottom: '0',
	left: '0',
	zIndex: '12',
	height: theme.dimensions.headerHeight,
	backgroundColor: theme.color.contrast2,
	color: 'black',
	'@media': {
		'screen and (--md)': {
			display: 'none'
		}
	},
	selectors: {
		'&:active, &:focus, &:visited': {
			backgroundColor: theme.color.contrast2,
		}
	}
})
