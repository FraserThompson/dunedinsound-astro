import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const shareButton = style({
	position: 'relative',
	zIndex: '20',
	color: 'white',
	borderTopLeftRadius: '15px',
	borderTopRightRadius: '15px',
	borderColor: 'transparent',
	filter: 'drop-shadow(2px 2px 10px black)',
	backgroundColor: theme.color.contrast2,
	transition: 'filter 150ms ease-in-out',
	selectors: {
		'&:hover': {
			filter: 'invert(1)'
		}
	}
})
