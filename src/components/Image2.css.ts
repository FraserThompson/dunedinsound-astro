import { createVar, fallbackVar, globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const objectFit = createVar()
export const objectPosition = createVar()
export const maxWidth = createVar()

export const image2 = recipe({
	base: {
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		overflow: 'hidden',
		verticalAlign: 'top',
		bottom: '0px',
		left: '0px',
		height: '100%',
		width: '100%',
		backgroundSize: fallbackVar(objectFit, 'cover'),
	}
})

globalStyle(`.image2 img`, {
	bottom: 0,
	left: 0,
	top: 0,
	right: 0,
	height: '100%',
	width: '100%',
	margin: 0,
	maxWidth: fallbackVar(maxWidth, 'none'),
	padding: 0,
	objectFit: fallbackVar(objectFit, 'cover'),
	objectPosition: fallbackVar(objectPosition, 'center'),
	transition: 'transform 0.3s ease-in-out',
	willChange: 'transform'
})

globalStyle(`.lightboxImage`, {
	display: 'block',
	aspectRatio: '3/2',
})

globalStyle(`.lightboxImage.free-aspect`, {
	aspectRatio: 'unset !important',
})
