import { style, globalStyle, styleVariants } from '@vanilla-extract/css'
import { lighten } from 'polished'
import { theme } from 'src/Theme.css'

export const MenuWrapper = style({
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	textAlign: 'left',
	backgroundColor: theme.color.primary,
	backgroundClip: 'padding-box',
	border: 'none',
	borderRadius: '0',
	margin: '0',
	overflowY: 'hidden',
	scrollBehavior: 'smooth'
})

export const MenuLi = styleVariants({
	horizontal: [
		{
			display: 'inline-block',
		}
	],
	vertical: [
		{
			display: 'block',
		}
	]
})

const MenuLinkBase = style({
	color: theme.color.text,
	position: 'relative',
	textDecoration: 'none',
	whiteSpace: 'nowrap',
	lineHeight: theme.dimensions.headerHeightMobile,
	margin: '0px',
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	selectors: {
		'&:hover': {
			color: 'white',
			textDecoration: 'none'
		},
		'&.active, &:active': {
			backgroundColor: theme.color.secondary,
			color: theme.color.lightText
		}
	},
	'@media': {
		'screen and (--md)': {
			lineHeight: theme.dimensions.headerHeight
		}
	}
})

export const MenuLink = styleVariants({
	horizontal: [
		MenuLinkBase,
		{
			display: 'inline-block',
			borderBottom: 'none',
			borderTop: 'none'
		}
	],
	vertical: [
		MenuLinkBase,
		{
			display: 'block'
		}
	]
})
