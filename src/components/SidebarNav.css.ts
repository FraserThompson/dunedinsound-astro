import { createVar, style, fallbackVar } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const defaultWidth = '80vh'

export const offsetTop = createVar()

export const sidebarWrapper = style({
	position: 'fixed',
	backgroundColor: theme.color.primary,
	height: `calc(100vh - ${fallbackVar(offsetTop, '0px')})`,
	top: fallbackVar(offsetTop, '0px'),
	left: 0,
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
	scrollBehavior: 'smooth',
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
			visibility: 'visible',
			left: theme.dimensions.headerHeight,
			opacity: 1,
			transform: `translateX(0)`,
			pointerEvents: 'auto'
		}
	}
})

export const contentWrapper = style({
	paddingLeft: theme.dimensions.sidebarWidth
})

export const menuButtonWrapper = style({
	position: 'fixed',
	top: '0',
	left: '0',
	zIndex: '12',
	height: theme.dimensions.headerHeight,
	'@media': {
		'screen and (--md)': {
			display: 'none'
		}
	}
})
