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
	transition: 'transform 0.3s ease-in-out',
	transform: 'scale(1, 1)',
})

globalStyle(`${backgroundImageWrapper} > div`, {
	display: 'inline'
})
