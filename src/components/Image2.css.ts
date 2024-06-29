import { style } from '@vanilla-extract/css'

export const ImageWrapper = style({
	position: 'relative',
	overflow: 'hidden',
	display: 'inline-block',
	verticalAlign: 'top'
})

export const ImageStyle = style({
	bottom: 0,
	left: 0,
	top: 0,
	right: 0,
	height: '100%',
	width: '100%',
	margin: 0,
	maxWidth: 'none',
	padding: 0,
	position: 'absolute',
	transform: "translateZ(0)",
	objectFit: "cover"
})
