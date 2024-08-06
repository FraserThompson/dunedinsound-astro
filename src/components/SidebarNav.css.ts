import { createVar, style, fallbackVar } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const defaultWidth = '100vw'

export const offsetTop = createVar()
export const offsetTopMobile = createVar()

export const offsetBottom = createVar()
export const offsetBottomMobile = createVar()

export const sidebarWrapper = style({
	position: 'fixed',
	backgroundColor: theme.color.primary,
	boxSizing: 'border-box',
	top: fallbackVar(offsetTopMobile, '0px'),
	bottom: fallbackVar(offsetBottomMobile, '0px'),
	left: 0,
	width: defaultWidth,
	maxWidth: defaultWidth,
	zIndex: '10',
	boxShadow: theme.borders.shadow,
	borderRight: theme.borders.primary,
	visibility: 'hidden',
	opacity: 0,
	transform: 'translateX(-50vw)',
	pointerEvents: 'none',
	transitionProperty: 'opacity, transform',
	transitionDuration: '0.3s',
	transitionTimingFunction: 'cubic-bezier(0, 0, 0, 1.2)',
	willChange: 'transform',
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
			height: `calc(100vh - ${fallbackVar(offsetTop, '0px')} - ${fallbackVar(offsetBottom, '0px')})`,
			visibility: 'visible',
			top: fallbackVar(offsetTop, '0px'),
			bottom: fallbackVar(offsetBottom, '0px'),
			left: theme.dimensions.headerHeight,
			opacity: 1,
			transform: `translateX(0)`,
			pointerEvents: 'auto'
		}
	}
})

export const sidebarMenuWrapper = style({
	overflowX: 'hidden',
	overflowY: 'auto',
	scrollbarWidth: 'thin',
	scrollbarColor: 'gray black',
	height: `100%`
})

export const contentWrapper = style({
	marginLeft: 0,
	boxSizing: 'border-box',
	'@media': {
		'screen and (--md)': {
			marginLeft: theme.dimensions.sidebarWidth
		}
	}
})

export const menuButtonWrapper = style({
	position: 'fixed',
	padding: 0,
	bottom: theme.dimensions.headerHeight,
	left: '0',
	zIndex: '12',
	height: theme.dimensions.subheaderHeight,
	width: theme.dimensions.subheaderHeight,
	backgroundColor: theme.color.primary,
	border: 'none',
	color: 'white',
	'@media': {
		'screen and (--md)': {
			display: 'none'
		}
	},
	selectors: {
		'&:active, &:focus, &:visited': {
			backgroundColor: theme.color.primary
		}
	}
})
