import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { MenuLi, MenuLinkWrapper, MenuWrapper } from '../Menu.css'

export const gigsMenuWrapper = style([
	MenuWrapper['vertical'],
	{
		borderLeft: `4px solid ${theme.color.foreground}`
	}
])

export const artistsMenuWrapper = style([
	MenuWrapper['vertical'],
	{
		backgroundColor: 'black',
		borderLeft: `6px solid ${theme.color.secondary}`,
		borderBottom: `6px solid ${theme.color.secondary}`
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
		zIndex: 7,
		fontWeight: 'bold'
	}
])

export const monthHeader = style([
	MenuLi['vertical'],
	{
		backgroundColor: theme.color.contrast,
		boxShadow: theme.borders.shadowLight,
		position: 'relative',
		height: theme.dimensions.subheaderHeight
	}
])

export const gigLi = style([MenuLi['vertical']])

export const gigLink = style([MenuLinkWrapper['vertical'], {
	textOverflow: 'ellipsis'
}])

export const artistLink = style([
	MenuLinkWrapper['vertical'],
	{
		paddingLeft: `calc(${theme.dimensions.basePadding})`,
		selectors: {
			'&.active': {
				backgroundColor: theme.color.contrast2,
				color: 'black'
			}
		},
		'@media': {
			'screen and (--md)': {
				paddingLeft: `calc(${theme.dimensions.basePadding} * 2)`,
			}
		}
	}
])

export const monthLink = style([
	MenuLinkWrapper['vertical'],
	{
		color: 'black',
		cursor: 'default',
		selectors: {
			'&:hover': {
				color: 'black'
			}
		}
	}
])

export const yearLink = style([
	MenuLinkWrapper['vertical'],
	{
		color: 'black'
	}
])
