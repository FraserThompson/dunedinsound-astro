import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { MenuLi, MenuLink } from '../Menu.css'

export const yearHeader = style([
	MenuLi['vertical'],
	{
		position: 'sticky',
		top: '0px',
		backgroundColor: theme.color.foreground,
		padding: 0,
		margin: 0,
		zIndex: 8
	}
])

export const monthHeader = style([
	MenuLi['vertical'],
	{
		backgroundColor: theme.color.contrast2
	}
])

export const gigLi = style([MenuLi['vertical']])

export const gigLink = style([
	MenuLink['vertical'],
	{
		color: 'black'
	}
])
