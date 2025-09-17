import { style } from '@vanilla-extract/css'
import { theme } from '../ThemeContract.css'

export const shareButton = style({
	position: 'relative',
	zIndex: '20',
	color: 'black',
	borderBottomLeftRadius: '15px',
	borderBottomRightRadius: '15px',
	borderColor: 'transparent',
	filter: 'drop-shadow(2px 2px 10px black)',
	backgroundColor: theme.color.contrast2,
	transition: 'filter 150ms ease-in-out',
	cursor: 'pointer',
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	selectors: {
		'&:hover': {
			backgroundColor: theme.color.lightContrast2,
		}
	}
})
