import { style } from '@vanilla-extract/css'

export const SocialLinkWrapper = style({
	marginRight: '3px',
	marginLeft: '3px'
})

export const SocialLinkImage = style({
	background: 'black',
	top: '2px',
	position: 'relative',
	height: '30px',
	width: '30px',
	'@media': {
		'screen and (--md)': {
			height: '18px',
			width: '18px'
		}
	}
})
