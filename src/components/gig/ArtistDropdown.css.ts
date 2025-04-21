import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { MenuLi, MenuLinkWrapper } from '../Menu.css'

export const artistDropdownLink = style([
	MenuLinkWrapper['vertical'],
	{
		color: 'inherit !important',
		paddingLeft: '0 !important',
		width: 'auto !important',
		flexGrow: '1 !important',
		selectors: {
			'&:hover': {
				color: `white !important`
			},
			'&.seeOther': {
				color: `${theme.color.dullText} !important`
			},
			'&.seeOther:hover': {
				color: `white !important`
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
				backgroundColor: theme.color.lightPrimary
			},
			'&:not(:last-child)': {
				borderBottom: `1px solid ${theme.color.dullText}`
			}
		}
	}
])
