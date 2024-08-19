import { style, globalStyle } from '@vanilla-extract/css'

export const backgroundImageWrapper = style({
	position: 'static',
	width: '100%',
	height: '100%',
	zIndex: '0',
	'@media': {
		'screen and (--md)': {
			position: 'absolute'
		}
	}
})

globalStyle(`${backgroundImageWrapper} img`, {
	width: '100%',
	zIndex: '0',
})

globalStyle(`${backgroundImageWrapper} > div`, {
	display: 'inline'
})
