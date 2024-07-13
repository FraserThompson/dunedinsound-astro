import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const defaultWidth = '80vh'

export const sidebarWrapper = style({
	position: 'fixed',
	backgroundColor: theme.color.primary,
	height: `calc(100vh - ${theme.dimensions.headerHeightMobileTwice})`,
	top: theme.dimensions.headerHeightMobile,
	left: 0,
	width: defaultWidth,
	maxWidth: defaultWidth,
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: '10',
	boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
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
			top: theme.dimensions.headerHeight,
			width: '300px',
			height: `calc(100vh - ${theme.dimensions.headerHeight})`,
			visibility: 'visible',
			opacity: 1,
			transform: `translateX(0)`,
			pointerEvents: 'auto'
		}
	}
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
