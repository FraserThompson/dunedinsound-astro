import { style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'
import { MenuLinkWrapper } from './Menu.css'

export const entryMenuLink = style([
	MenuLinkWrapper['vertical'],
	{
		color: theme.color.contrast2,
		selectors: {
			'&.died': {
				color: theme.color.dullText
			},
			'&:hover': {
				color: theme.color.lightContrast2
			},
		}
	}
])

export const entryMenuTitle = style({
	maxWidth: '90%',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	display: 'inline-block'
})

export const entryMenuCount = style({
	color: theme.color.dullText,
	width: '1.2em',
	display: 'inline-block',
	textAlign: 'right'
})
