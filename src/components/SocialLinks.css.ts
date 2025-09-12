import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const SocialLinkWrapper = style({
	marginRight: '3px',
	marginLeft: '3px'
})

export const SocialLinkImage = style({
	background: 'black',
	border: '1px solid black',
	borderRadius: '6px',
	position: 'relative',
	height: theme.dimensions.subheaderHeight,
	width: theme.dimensions.subheaderHeight,
	boxSizing: 'border-box',
	transition: 'border 0.1s ease-in-out',
	selectors: {
		'&:hover': {
			border: `2px solid black`
		}
	}
})
