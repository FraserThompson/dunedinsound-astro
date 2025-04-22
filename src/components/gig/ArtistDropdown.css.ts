import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { MenuLi, MenuLinkWrapper } from '../Menu.css'

export const artistExtraWrapper = style({
	width: '100%',
	listStyle: 'none',
	paddingLeft: '0'
})

export const artistDropdownLink = style([
	MenuLinkWrapper['vertical'],
	{
		color: 'inherit !important',
		paddingLeft: '0 !important',
		width: 'auto !important',
		flexGrow: '1 !important',
		selectors: {
			'&.seeOther': {
				color: `${theme.color.dullText} !important`
			},
			'&.seeOther:hover': {
				color: `${theme.color.text} !important`
			}
		}
	}
])

export const artistDropdownLi = style([
	MenuLi['vertical'],
	{
		display: 'flex',
		flexWrap: 'wrap',
		width: 'auto !important',
		paddingLeft: theme.dimensions.basePaddingMobile,
		paddingRight: '2px',
		'@media': {
			'screen and (--md)': {
				paddingLeft: theme.dimensions.basePadding,
				paddingRight: '2px'
			}
		},
		selectors: {
			'&.active': {
				backgroundColor: `${theme.color.contrast2} !important`,
				color: `black !important`
			},
			'&:hover': {
				backgroundColor: theme.color.lightPrimary,
				color: `${theme.color.lightText} !important`
			},
			'&.active:hover': {
				color: `black !important`
			},
			'&:not(:last-child)': {
				borderBottom: `1px solid ${theme.color.dullText}`
			}
		}
	}
])

globalStyle(`${artistDropdownLi}.active ${artistExtraWrapper} a`, {
	color: `${theme.color.darkContrast2} !important`
})
globalStyle(`${artistDropdownLi}.active ${artistExtraWrapper} a:hover`, {
	color: `black !important`
})
