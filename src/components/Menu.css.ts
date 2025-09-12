import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const MenuWrapperBase = style({
	paddingLeft: 0,
	paddingRight: 0,
	listStyle: 'none',
	textAlign: 'left',
	position: 'relative',
	zIndex: '6',
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
			backgroundColor: theme.color.contrast3,
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
			width: '100%',
			selectors: {
				'&.active, &:active': {
					backgroundColor: theme.color.secondary
				}
			}
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
	boxSizing: 'border-box',
	color: theme.color.text,
	width: '100%',
	cursor: 'pointer',
	position: 'relative',
	textDecoration: 'none',
	whiteSpace: 'nowrap',
	lineHeight: theme.dimensions.headerHeightMobile,
	height: theme.dimensions.headerHeightMobile,
	margin: '0px',
	selectors: {
		'&:hover': {
			color: 'white',
			textDecoration: 'none'
		},
		'&.active, &:active': {
			backgroundColor: theme.color.contrast3,
			color: theme.color.lightText
		}
	},
	'@media': {
		'screen and (--md)': {
			lineHeight: theme.dimensions.headerHeight,
			height: theme.dimensions.headerHeight
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
			display: 'inline-flex',
			justifyContent: 'center',
			position: 'relative',
			alignItems: 'center',
			borderBottom: 'none',
			borderTop: 'none',
			paddingLeft: theme.dimensions.basePaddingMobile,
			paddingRight: theme.dimensions.basePaddingMobile,
			'@media': {
				'screen and (--md)': {
					paddingLeft: theme.dimensions.basePadding,
					paddingRight: theme.dimensions.basePadding
				}
			}
		}
	],
	vertical: [
		MenuLinkWrapperBase,
		{
			display: 'block',
			paddingLeft: theme.dimensions.basePaddingMobile,
			paddingRight: theme.dimensions.basePaddingMobile,
			'@media': {
				'screen and (--md)': {
					paddingLeft: theme.dimensions.basePadding,
					paddingRight: theme.dimensions.basePadding
				}
			},
			selectors: {
				'&.active, &:active': {
					backgroundColor: theme.color.secondary
				}
			}
		}
	],
	sideways: [
		MenuLinkWrapperBase,
		{
			boxSizing: 'content-box',
			position: 'relative',
			writingMode: 'vertical-rl',
			textOrientation: 'mixed',
			textAlign: 'center',
			minHeight: '50px',
			paddingTop: theme.dimensions.basePaddingMobile,
			paddingBottom: theme.dimensions.basePaddingMobile,
			'@media': {
				'screen and (--md)': {
					paddingTop: theme.dimensions.basePadding,
					paddingBottom: theme.dimensions.basePadding
				}
			}
		}
	]
})
