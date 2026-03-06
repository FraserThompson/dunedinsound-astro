import { createVar, fallbackVar, globalStyle, style } from '@vanilla-extract/css'

export const objectFit = createVar()
export const objectPosition = createVar()

globalStyle(`.image2`, {
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

globalStyle(`.image2 img`, {
	bottom: 0,
	left: 0,
	top: 0,
	right: 0,
	height: '100%',
	width: '100%',
	margin: 0,
	maxWidth: 'none',
	padding: 0,
	objectFit: fallbackVar(objectFit, 'cover'),
	objectPosition: fallbackVar(objectPosition, 'center'),
	transition: 'transform 0.3s ease-in-out',
	willChange: 'transform'
})

globalStyle(`.image2 p`, {
	paddingTop: 0,
	marginTop: 0,
	fontStyle: 'italic'
})

globalStyle(`.lightboxImage`, {
	display: 'block',
	aspectRatio: '3/2'
})
