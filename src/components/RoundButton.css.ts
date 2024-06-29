import { style, } from '@vanilla-extract/css'
import { lighten } from 'polished';

export const RoundButton = style({
	zIndex: 11,
	color: '#bfced9',
	border: '2px outset #abb6c5',
	borderRadius: '50%',
	backgroundColor: 'transparent',
	padding: 0,
	outline: 0,
	width: '40px',
	height: '40px',
	'selectors': {
		'&:hover:not(.active)': {
			color: lighten(0.2, '#bfced9'),
			borderColor:lighten(0.2, '#abb6c5')
		}
	}
})
