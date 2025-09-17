import { style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'
import { textContainer } from '../TextContainer.css'

export const blogSidebarWrapper = style({
	padding: theme.dimensions.basePadding,
	minWidth: '320px',
	maxWidth: 'auto',
	'@media': {
		'screen and (--md)': {
			maxWidth: '320px'
		}
	}
})

export const sidebarBox = style([
	textContainer,
	{
		border: '1px solid white',
		backgroundColor: 'black',
		margin: theme.dimensions.basePadding,
		padding: theme.dimensions.basePadding
	}
])
