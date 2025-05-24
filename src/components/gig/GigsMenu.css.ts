import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { MenuLi, MenuLinkWrapper, MenuWrapper } from '../Menu.css'

// The !importants are due to a bug in 3.9.5 of the vanilla extract
// vite integration which means we can't override base style properties.

export const yearsMenuWrapper = style([
	MenuWrapper['vertical'],
	{
		borderLeft: `6px solid white !important`
	}
])

export const artistsMenuWrapper = style([
	MenuWrapper['vertical'],
	{
		borderLeft: `6px solid ${theme.color.secondary} !important`,
		borderBottom: `6px solid ${theme.color.secondary} !important`
	}
])

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
		color: `${theme.color.darkText} !important`,
		height: `${theme.dimensions.subheaderHeight} !important`,
		lineHeight: `${theme.dimensions.subheaderHeight} !important`,
		cursor: 'default',
		backgroundColor: `${theme.color.contrast} !important`,
		boxShadow: theme.borders.shadowLight,
		position: 'relative',
		paddingLeft: '0px !important',
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
		position: 'sticky',
		color: `black !important`,
		height: `${theme.dimensions.headerHeightMobile} !important`,
		lineHeight: `${theme.dimensions.headerHeightMobile} !important`,
		top: '0px',
		backgroundColor: `white !important`,
		paddingLeft: '0px !important',
		margin: 0,
		zIndex: 7,
		fontWeight: 'bold',
		'@media': {
			'screen and (--md)': {
				height: `${theme.dimensions.headerHeight} !important`,
				lineHeight: `${theme.dimensions.headerHeight} !important`,
			}
		}
	}
])

export const backButton = style({
	height: theme.dimensions.headerHeightMobile,
	boxShadow: theme.borders.shadow,
	display: 'flex',
	alignItems: 'center',
	top: 0,
	color: theme.color.darkText,
	backgroundColor: theme.color.lightText,
	width: '100%',
	zIndex: 10,
	position: 'fixed'
})
