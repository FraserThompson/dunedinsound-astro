import { style, globalStyle } from '@vanilla-extract/css'

export const backgroundImageWrapper = style({
	position: 'static',
	width: '100%',
	height: 'auto',
	aspectRatio: '3/2',
	zIndex: '0',
	'@media': {
		'screen and (--md)': {
			height: '100%',
			position: 'absolute'
		}
	}
})

globalStyle(`${backgroundImageWrapper}.hasVertical .backgroundImageVertical`, {
	'@media': {
		'screen and (orientation: landscape)': {
			display: 'none'
		},
		'screen and (orientation: portrait)': {
			display: 'block'
		}
	}
})

globalStyle(`${backgroundImageWrapper}.hasVertical .backgroundImage`, {
	'@media': {
		'screen and (orientation: landscape)': {
			display: 'block'
		},
		'screen and (orientation: portrait)': {
			display: 'none'
		}
	}
})

globalStyle(`${backgroundImageWrapper} img`, {
	width: '100%',
	zIndex: '0'
})

globalStyle(`${backgroundImageWrapper} > div`, {
	display: 'inline'
})
