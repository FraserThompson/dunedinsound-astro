import { style } from '@vanilla-extract/css'

export const BlogPageContainer = style({
	display: 'flex',
	maxWidth: '1600px',
	margin: '0 auto'
})

export const BlogTextContainer = style({
	marginLeft: '0',
	'@media': {
		'screen and (--md)': {
			marginLeft: '50px'
		}
	}
})

export const VideoCover = style({
	maxHeight: '40vh',
	'@media': {
		'screen and (--md)': {
			maxHeight: '80vh'
		}
	}
})
