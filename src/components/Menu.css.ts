import { globalStyle, style, type StyleRule } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { theme } from '../Theme.css'

const menuWrapperBase: StyleRule = {
	paddingLeft: 0,
	paddingRight: 0,
	listStyle: 'none',
	textAlign: 'left',
	position: 'relative',
	zIndex: '6',
	backgroundColor: theme.color.background,
	backgroundClip: 'padding-box',
	border: 'none',
	boxSizing: 'border-box',
	borderRadius: '0',
	margin: '0',
	overflow: 'hidden'
}

export const MenuWrapperBase = style(menuWrapperBase)

export const MenuWrapper = recipe({
	base: menuWrapperBase,
	variants: {
		layout: {
			vertical: {},
			sideways: {},
			horizontal: {
				justifyContent: 'space-evenly',
				display: 'flex'
			}
		}
	},
	defaultVariants: {
		layout: 'horizontal'
	}
})

const menuLiBase: StyleRule = {
	backgroundColor: theme.color.primary,
	boxSizing: 'border-box',
	selectors: {
		'&.active, &:active': {
			backgroundColor: theme.color.contrast3,
			color: theme.color.lightText
		}
	}
}

export const MenuLiBase = style(menuLiBase)

export const MenuLi = recipe({
	base: menuLiBase,
	variants: {
		layout: {
			horizontal: {
				display: 'inline-flex',
				alignItems: 'center',
				textAlign: 'center',
				borderRadius: '10px 10px 0px 0px',
				border: `1px solid black`,
				width: '100%'
			},
			vertical: {
				width: '100%',
				selectors: {
					'&.active, &:active': {
						backgroundColor: theme.color.secondary
					}
				}
			},
			sideways: {
				textOverflow: 'clip',
				borderRadius: '0px 10px 10px 0px',
				border: `1px solid black`,
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
				width: '100%'
			}
		}
	},
	defaultVariants: {
		layout: 'horizontal'
	}
})

const menuLinkWrapperBase: StyleRule = {
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
}

export const MenuLinkWrapperBase = style(menuLinkWrapperBase)

globalStyle(`${MenuLiBase}.active > ${MenuLinkWrapperBase}`, {
	color: 'white'
})

export const MenuLinkWrapper = recipe({
	base: menuLinkWrapperBase,
	variants: {
		layout: {
			horizontal: {
				display: 'inline-flex',
				justifyContent: 'center',
				alignItems: 'center',
				borderBottom: 'none',
				borderTop: 'none',
				borderRadius: '10px 10px 0px 0px',
				paddingLeft: theme.dimensions.basePaddingMobile,
				paddingRight: theme.dimensions.basePaddingMobile,
				'@media': {
					'screen and (--md)': {
						paddingLeft: theme.dimensions.basePadding,
						paddingRight: theme.dimensions.basePadding
					}
				}
			},
			vertical: {
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
			},
			sideways: {
				boxSizing: 'content-box',
				writingMode: 'vertical-rl',
				textOrientation: 'mixed',
				textAlign: 'center',
				minHeight: '50px',
				paddingTop: theme.dimensions.basePaddingMobile,
				paddingBottom: theme.dimensions.basePaddingMobile,
				borderRadius: '0px 10px 10px 0px',
				'@media': {
					'screen and (--md)': {
						paddingTop: theme.dimensions.basePadding,
						paddingBottom: theme.dimensions.basePadding
					}
				}
			}
		}
	},
	defaultVariants: {
		layout: 'horizontal'
	}
})
