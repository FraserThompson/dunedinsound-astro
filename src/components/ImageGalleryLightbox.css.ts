import { style } from '@vanilla-extract/css'

export const LightboxHeader = style({
	position: 'absolute',
	top: '60px',
	'@media': {
		'screen and (--xs)': {
			top: 0
		}
	}
})
