import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { MenuLi, MenuLinkWrapper } from '../Menu.css'

export const artistDropdownLink = style([
	MenuLinkWrapper['vertical'],
	{
		color: 'inherit !important',
		paddingLeft: '0 !important',
		width: 'auto !important',
		flexGrow: '1 !important'
	}
])

export const artistDropdownLi = style([
	MenuLi['vertical'],
	{
		display: 'flex',
		flexWrap: 'wrap',
		width: 'auto !important',
		paddingLeft: theme.dimensions.basePaddingMobile,
		paddingRight: theme.dimensions.basePaddingMobile,
		'@media': {
			'screen and (--md)': {
				paddingLeft: theme.dimensions.basePadding,
				paddingRight: theme.dimensions.basePadding
			}
		},
		selectors: {
			'&.active': {
				backgroundColor: `${theme.color.contrast2} !important`,
				color: `black !important`
			},
			'&:hover': {
				backgroundColor: theme.color.lightPrimary,
				color: `white !important`
			},
			'&.active:hover': {
				color: `black !important`
			}
		}
	}
])
