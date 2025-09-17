import { style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'
import { MenuLinkWrapper } from '../Menu.css'

export const artistExtraWrapper = style({
	listStyle: 'none',
	paddingLeft: '0',
	position: 'absolute',
	height: 'auto !important',
	width: 'auto !important',
	right: theme.dimensions.basePaddingMobile,
	top: '0px'
})

export const artistDropdownLink = style([
	MenuLinkWrapper['vertical'],
	{
		height: '100% !important',
		color: `${theme.color.darkText} !important`,
		selectors: {
			'&.seeOther': {
				color: `${theme.color.dullDarkText} !important`,
				position: 'absolute',
				lineHeight: '1',
				height: 'auto !important',
				width: 'auto',
				bottom: theme.dimensions.basePaddingMobile,
				right: 0
			},
			'&.seeOther:hover': {
				color: `${theme.color.darkText} !important`,
			}
		}
	}
])

export const artistDropdownLi = style([
	{
		height: '60px',
		minWidth: '320px',
		position: 'relative',
		paddingLeft: '0',
		paddingRight: '0',
		selectors: {
			'&.active': {
				backgroundColor: `${theme.color.contrast2}`,
				color: `black !important`
			},
			'&:hover': {
				backgroundColor: theme.color.contrast2
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
