import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { MenuLi, MenuLink, MenuWrapper } from '../Menu.css'

export const gigsMenuWrapper = style([
	MenuWrapper,
	{
		borderLeft: `4px solid ${theme.color.foreground}`
	}
])

export const artistsMenuWrapper = style([
	MenuWrapper,
	{
		borderLeft: `6px solid ${theme.color.secondary}`
	}
])

export const yearHeader = style([
	MenuLi['vertical'],
	{
		position: 'sticky',
		top: '0px',
		backgroundColor: theme.color.foreground,
		padding: 0,
		margin: 0,
		zIndex: 8,
		fontWeight: 'bold'
	}
])

export const monthHeader = style([
	MenuLi['vertical'],
	{
		backgroundColor: 'white',
		height: theme.dimensions.subheaderHeight
	}
])

export const gigLi = style([MenuLi['vertical']])

export const gigLink = style([MenuLink['vertical']])

export const artistLink = style([
	MenuLink['vertical'],
	{
		paddingLeft: `calc(${theme.dimensions.basePadding} * 2)`,
		selectors: {
			'&.active': {
				backgroundColor: theme.color.contrast2,
				color: "black"
			}
		}
	}
])

export const monthLink = style([
	MenuLink['vertical'],
	{
		color: 'black'
	}
])

export const yearLink = style([
	MenuLink['vertical'],
	{
		color: 'black'
	}
])
