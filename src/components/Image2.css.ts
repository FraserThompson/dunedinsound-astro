import { createVar, style } from '@vanilla-extract/css'

const objectFit = createVar()

export const ImageWrapper = style({
	position: 'relative',
	overflow: 'hidden',
	verticalAlign: 'top',
	bottom: '0px',
	left: '0px',
	backgroundSize: objectFit,
	display: 'block',
	height: '100%',
	width: '100%'
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
	objectFit: objectFit,
	transition: 'transform 0.3s ease-in-out',
	willChange: 'transform'
})
