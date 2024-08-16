import { style, globalStyle } from '@vanilla-extract/css'

export const backgroundImageWrapper = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	zIndex: '0'
})

globalStyle(`${backgroundImageWrapper} img`, {
	width: '100%',
	zIndex: '0',
})

globalStyle(`${backgroundImageWrapper} > div`, {
	display: 'inline'
})
