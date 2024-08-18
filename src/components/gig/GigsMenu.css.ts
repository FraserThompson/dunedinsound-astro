import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { MenuLi, MenuLinkWrapper, MenuWrapper } from '../Menu.css'

// The !importants are due to a bug in 3.9.5 of the vanilla extract
// vite integration which means we can't override base style properties.

export const gigsMenuWrapper = style([
	MenuWrapper['vertical'],
	{
		borderLeft: `4px solid ${theme.color.foreground} !important`
	}
])

export const artistsMenuWrapper = style([
	MenuWrapper['vertical'],
	{
		borderLeft: `6px solid ${theme.color.secondary} !important`,
		borderBottom: `6px solid ${theme.color.secondary} !important`,
		borderRight: `6px solid ${theme.color.secondary} !important`
	}
])

export const yearHeader = style([
	MenuLi['vertical'],
	{
		position: 'sticky',
		top: '0px',
		backgroundColor: `${theme.color.foreground} !important`,
		padding: 0,
		margin: 0,
		zIndex: 7,
		fontWeight: 'bold'
	}
])

export const monthHeader = style([
	MenuLi['vertical'],
	{
		backgroundColor: `${theme.color.contrast} !important`,
		boxShadow: theme.borders.shadowLight,
		position: 'relative',
		height: theme.dimensions.subheaderHeight
	}
])

export const gigLi = style([MenuLi['vertical']])

export const gigLink = style([
	MenuLinkWrapper['vertical'],
	{
		textOverflow: 'ellipsis'
	}
])

export const artistLink = style([
	MenuLinkWrapper['vertical'],
	{
		backgroundColor: theme.color.darkSecondary,
		paddingLeft: `calc(${theme.dimensions.basePadding})`,
		selectors: {
			'&.active': {
				backgroundColor: `${theme.color.contrast2} !important`,
				color: `black !important`
			}
		},
		'@media': {
			'screen and (--md)': {
				paddingLeft: `calc(${theme.dimensions.basePadding} * 2) !important`
			}
		}
	}
])

export const monthLink = style([
	MenuLinkWrapper['vertical'],
	{
		color: `black !important`,
		cursor: 'default',
		selectors: {
			'&:hover': {
				color: `black !important`
			}
		}
	}
])

export const yearLink = style([
	MenuLinkWrapper['vertical'],
	{
		color: `black !important`
	}
])

export const backButton = style({
	height: theme.dimensions.subheaderHeight,
	display: 'flex',
	alignItems: 'center',
	top: 0,
	backgroundColor: theme.color.background,
	width: '100%',
	zIndex: 10,
	position: 'fixed'
})
