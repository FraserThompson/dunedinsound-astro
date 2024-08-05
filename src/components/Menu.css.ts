import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const MenuWrapperBase = style({
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

export const MenuWrapper = styleVariants({
	vertical: [MenuWrapperBase],
	sideways: [MenuWrapperBase],
	horizontal: [
		MenuWrapperBase,
		{
			justifyContent: 'space-evenly',
			display: 'flex'
		}
	]
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
			alignItems: 'center',
			textAlign: 'center',
			width: '100%'
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
			textOverflow: 'clip',
			overflow: 'hidden',
			display: 'flex',
			alignItems: 'center',
			width: '100%'
		}
	]
})

const MenuLinkWrapperBase = style({
	color: theme.color.text,
	width: '100%',
	cursor: 'pointer',
	position: 'relative',
	textDecoration: 'none',
	whiteSpace: 'nowrap',
	lineHeight: theme.dimensions.headerHeight,
	height: theme.dimensions.headerHeight,
	margin: '0px',
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
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
		'screen and (--xs)': {
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${MenuLiBase}.active > ${MenuLinkWrapperBase}`, {
	color: 'white'
})

export const MenuLinkWrapper = styleVariants({
	horizontal: [
		MenuLinkWrapperBase,
		{
			display: 'inline-block',
			borderBottom: 'none',
			borderTop: 'none'
		}
	],
	vertical: [
		MenuLinkWrapperBase,
		{
			display: 'block'
		}
	],
	sideways: [
		MenuLinkWrapperBase,
		{
			writingMode: 'vertical-rl',
			textOrientation: 'mixed',
			textAlign: 'center',
			minHeight: '50px',
			paddingLeft: 0,
			paddingRight: 0,
			paddingTop: theme.dimensions.basePaddingMobile,
			paddingBottom: theme.dimensions.basePaddingMobile,
			'@media': {
				'screen and (--xs)': {
					paddingLeft: 0,
					paddingRight: 0,
					paddingTop: theme.dimensions.basePadding,
					paddingBottom: theme.dimensions.basePadding
				}
			}
		}
	]
})
