import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const MenuWrapper = style({
	paddingLeft: 0,
	paddingRight: 0,
	textAlign: 'left',
	backgroundColor: theme.color.background,
	backgroundClip: 'padding-box',
	border: 'none',
	borderRadius: '0',
	margin: '0',
	overflow: 'hidden'
})

const MenuLiBase = style({
	backgroundColor: theme.color.primary,
	selectors: {
		'&.active, &:active': {
			backgroundColor: theme.color.secondary,
			color: theme.color.lightText
		}
	}
})

export const MenuLi = styleVariants({
	horizontal: [
		MenuLiBase,
		{
			display: 'inline-flex',
			alignItems: 'center'
		}
	],
	vertical: [
		MenuLiBase,
		{
			display: 'flex',
			alignItems: 'center',
			width: '100%'
		}
	],
	sideways: [
		MenuLiBase,
		{
			borderRadius: '0 6px 6px 0',
			borderTop: theme.borders.background,
			borderRight: theme.borders.background,
			borderBottom: theme.borders.background,
			textOverflow: 'clip',
			overflow: 'hidden',
			display: 'flex',
			alignItems: 'center',
			width: '100%'
		}
	]
})

const MenuLinkBase = style({
	color: theme.color.text,
	width: '100%',
	cursor: 'pointer',
	position: 'relative',
	textDecoration: 'none',
	whiteSpace: 'nowrap',
	lineHeight: theme.dimensions.headerHeight,
	height: theme.dimensions.headerHeight,
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
	}
})

globalStyle(`${MenuLiBase}.active > ${MenuLinkBase}`, {
	color: 'white'
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
	],
	sideways: [
		MenuLinkBase,
		{
			writingMode: 'vertical-rl',
			textOrientation: 'mixed',
			textAlign: 'center',
			minHeight: '50px',
			paddingLeft: 0,
			paddingRight: 0,
			paddingTop: theme.dimensions.basePadding,
			paddingBottom: theme.dimensions.basePadding
		}
	]
})
