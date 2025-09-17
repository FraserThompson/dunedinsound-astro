import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '../../ThemeContract.css'
import { MenuLinkWrapper, MenuWrapper } from '../Menu.css'

export const yearsMenuWrapper = style([
	MenuWrapper['vertical']
])

export const artistsMenuWrapper = style([
	MenuWrapper['vertical'],
	{
		borderLeft: `6px solid ${theme.color.secondary}`,
		borderBottom: `6px solid ${theme.color.secondary}`
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
				backgroundColor: `${theme.color.contrast2}`,
				color: `black`
			}
		},
		'@media': {
			'screen and (--md)': {
				paddingLeft: `calc(${theme.dimensions.basePadding} * 2)`
			}
		}
	}
])

export const monthLink = style([
	MenuLinkWrapper['vertical'],
	{
		color: `${theme.color.darkText}`,
		height: `${theme.dimensions.subheaderHeight}`,
		lineHeight: `${theme.dimensions.subheaderHeight}`,
		cursor: 'default',
		boxShadow: theme.borders.shadowLight,
		position: 'relative',
		paddingLeft: '0px',
		selectors: {
			'&:hover': {
				color: `black`
			}
		}
	}
])

export const yearLink = style([
	MenuLinkWrapper['vertical'],
	{
		position: 'sticky',
		color: `black`,
		height: `${theme.dimensions.headerHeightMobile}`,
		lineHeight: `${theme.dimensions.headerHeightMobile}`,
		top: '0px',
		paddingLeft: '0px',
		margin: 0,
		zIndex: 7,
		fontWeight: 'bold',
		'@media': {
			'screen and (--md)': {
				height: `${theme.dimensions.headerHeight}`,
				lineHeight: `${theme.dimensions.headerHeight}`,
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
	color: theme.color.text,
	backgroundColor: theme.color.primary,
	width: '100%',
	zIndex: 10,
	position: 'fixed'
})

// Zebra striping
const oddColor = theme.color.contrast
const evenColor = theme.color.lightSecondary

globalStyle(`.yearList > *:nth-child(odd)`, {
	borderLeft: `6px solid ${oddColor}`
})
globalStyle(`.yearList > *:nth-child(odd) > ${yearLink}`, {
	backgroundColor: `${oddColor}`
})
globalStyle(`.yearList > *:nth-child(odd) ${monthLink}`, {
	background: `linear-gradient(90deg, ${oddColor}, ${theme.color.lightPrimary})`
})

globalStyle(`.yearList > *:nth-child(even)`, {
	borderLeft: `6px solid ${evenColor}`,
})
globalStyle(`.yearList > *:nth-child(even) ${yearLink}`, {
	backgroundColor: `${evenColor}`,
})
globalStyle(`.yearList > *:nth-child(even) ${monthLink}`, {
	background: `linear-gradient(90deg, ${evenColor}, ${theme.color.lightPrimary})`
})
