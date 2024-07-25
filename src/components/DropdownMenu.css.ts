import { createVar, fallbackVar, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { MenuLi, MenuLink, MenuWrapper } from './Menu.css'

export const dropdownTop = createVar()
export const menuWidth = createVar()
export const background = createVar()
export const color = createVar()

export const dropdownWrapper = style({
	position: 'sticky',
	top: fallbackVar(dropdownTop, theme.dimensions.headerHeightMobile),
	zIndex: '7',
	right: '0',
	height: '0',
	'@media': {
		'screen and (--md)': {
			top: fallbackVar(dropdownTop, theme.dimensions.headerHeight)
		}
	}
})

export const dropdownButtonWrapper = style({
	display: 'block',
	width: '100%',
	cursor: 'pointer'
})

export const dropdownButtonIcon = style({
	display: 'flex',
	height: theme.dimensions.subheaderHeight,
	alignItems: 'center',
	float: 'right',
	color: 'black'
})

export const dropdownMenu = style([
	MenuWrapper,
	{
		position: 'absolute',
		width: fallbackVar(menuWidth, 'auto'),
		backgroundColor: fallbackVar(background, theme.color.primary),
		bottom: '1',
		top: '1',
		right: '0 !important',
		left: 'auto',
		maxHeight: '80vh',
		overflowY: 'auto',
		visibility: 'hidden',
		opacity: 0,
		transform: '1',
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
				transform: 'translateY(0)'
			},
			'&.up': {
				transform: `translateY(${theme.dimensions.headerHeight})`
			}
		}
	}
])

export const dropdownLi = style([
	MenuLi['vertical'],
	{
		width: 'initial'
	}
])

export const dropdownLink = style([
	MenuLink['vertical'],
	{
		color: fallbackVar(color, theme.color.text),
		selectors: {
			'&:hover': {
				backgroundColor: theme.color.lightSecondary,
				color: "black"
			}
		}
	}
])
