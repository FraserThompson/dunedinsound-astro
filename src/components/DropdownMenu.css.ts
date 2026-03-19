import { createVar, fallbackVar, style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'
import { MenuLi, MenuLinkWrapper, MenuWrapper } from './Menu.css'

export const submenuTop = createVar()
export const submenuLeft = createVar()
export const dropdownTop = createVar()
export const buttonAlign = createVar()
export const menuLeft = createVar()
export const menuRight = createVar()
export const dropdownTopMobile = createVar()
export const buttonWidth = createVar()
export const menuWidth = createVar()
export const background = createVar()
export const color = createVar()
export const dropdownHeight = createVar()
export const dropdownHeightMobile = createVar()

export const dropdownWrapper = style({
	position: 'sticky',
	top: fallbackVar(dropdownTopMobile, dropdownTop, '0px'),
	zIndex: 7,
	right: '0',
	height: '0',
	display: 'block',
	'@media': {
		'screen and (--md)': {
			top: fallbackVar(dropdownTop, '0px')
		}
	}
})

export const dropdownButtonWrapper = style({
	display: 'flex',
	height: theme.dimensions.subheaderHeight,
	flexDirection: 'column',
	alignItems: fallbackVar(buttonAlign, 'end'),
	color: fallbackVar(color, 'black'),
	justifyContent: 'center',
	cursor: 'pointer',
	background: 'none',
	border: 'none',
	padding: 0,
	font: 'inherit',
	selectors: {
		'&:hover, &:active': {
			backgroundColor: 'unset !important',
			color: 'black'
		}
	}
})

export const dropdownMenu = style([
	MenuWrapper['vertical'],
	{
		width: fallbackVar(menuWidth, 'max-content'),
		position: 'absolute',
		backgroundColor: fallbackVar(background, theme.color.primary),
		color: fallbackVar(color, theme.color.text),
		right: fallbackVar(menuRight, '0px'),
		left: menuLeft,
		scrollbarWidth: 'thin',
		scrollbarColor: '#d5ceb1 black',
		visibility: 'hidden',
		opacity: 0,
		pointerEvents: 'none',
		transitionProperty: 'visibility, opacity, transform',
		transitionDuration: '0.3s',
		transitionTimingFunction: 'cubic-bezier(0, 0, 0, 1.2)',
		boxShadow: theme.borders.shadow,
		selectors: {
			'&.open': {
				visibility: 'visible',
				opacity: 1,
				pointerEvents: 'auto',
				transform: 'translateY(-4px)'
			},
			'&.up': {
				transform: `translateY(${theme.dimensions.subheaderHeight})`
			}
		}
	}
])

export const dropdownLi = style([
	MenuLi['vertical'],
	{
		width: '100%',
		position: 'relative',
		backgroundColor: fallbackVar(background, theme.color.primary),
		flexWrap: 'wrap',
		selectors: {
			'&:hover': {
				filter: 'brightness(0.9)'
			}
		}
	}
])

export const dropdownSubmenu = style([
	dropdownMenu,
	{
		visibility: 'hidden',
		opacity: 0,
		pointerEvents: 'none',
		transition: 'visibility 0.2s, opacity 0.2s',
		zIndex: 99999,

		position: 'fixed',
		// Use raw, un-hashed CSS variables for the JS injection
		top: 'var(--dyn-submenu-top, 0px)',
		left: 'var(--dyn-submenu-left, 0px)',
		right: 'auto',
		bottom: 'auto',

		// Override the main menu's slide animation so it doesn't shift
		marginTop: 0,

		selectors: {
			'&.submenu-open': {
				visibility: 'visible',
				opacity: 1,
				pointerEvents: 'auto',
			}
		}
	}
])

export const dropdownLink = style([
	MenuLinkWrapper['vertical'],
	{
		display: 'flex',
		alignItems: 'center',
		color: 'inherit',
		gap: '1rem',
		width: '100%',
		textDecoration: 'none',
		selectors: {
			'&:hover': {
				color: fallbackVar(color, theme.color.text),
			}
		}
	}
])
