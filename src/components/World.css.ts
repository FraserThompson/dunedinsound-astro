import { createVar, fallbackVar, keyframes, style, styleVariants } from '@vanilla-extract/css'

const camFocus = keyframes({
	'0%': {
		perspective: '10px'
	},
	'100%': {
		perspective: '300px'
	}
})

export const worldPerspective = createVar()

export const WorldWrapper = style({
	display: 'block',
	overflow: 'hidden',
	backgroundColor: 'black',
	perspective: fallbackVar(worldPerspective, '300px'),
	transition: 'perspective 0.3s ease-in-out',
	width: '100%',
	height: '100vh',
	position: 'relative',
	backfaceVisibility: 'hidden',
	transformStyle: 'preserve-3d',
	animation: `${camFocus} 2s`,
	selectors: {
		'&.off': {
			background:
				'radial-gradient(#191919 15%, transparent 15%) 0 0, radial-gradient(#292929 15%, transparent 15%) 16px 16px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255, 255, 255, 0.1) 95%, transparent 20%) 16px 17px',
			backgroundSize: '32px 32px'
		},
		'&.on': {
			background:
				'radial-gradient(purple 15%, transparent 15%) 0 0, radial-gradient(yellow 15%, transparent 15%) 16px 16px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 16px 17px',
			backgroundSize: '32px 32px'
		}
	},
	'@media': {
		'screen and (--xs)': {
			height: '100vh'
		}
	}
})

const SurfaceBase = style({
	display: 'block',
	position: 'absolute',
	boxShadow: 'inset 10px 10px 120px 35px rgba(0, 0, 0, 0.75)',
	backgroundPosition: '0 0, 50px 0, 50px -50px, 0px 50px',
	backfaceVisibility: 'hidden',
	transformStyle: 'preserve-3d',
	willChange: 'transform box-shadow',
	height: '100vh',
	width: '600px'
})

export const Surface = styleVariants({
	bottom: [
		SurfaceBase,
		{
			backgroundColor: 'black',
			bottom: '0',
			transformOrigin: 'center bottom',
			transform: 'translateZ(0) rotate3d(1, 0, 0, 90deg) skew(0deg)'
		}
	],
	top: [
		SurfaceBase,
		{
			backgroundColor: '#191919',
			top: '0',
			transformOrigin: 'center top',
			transform: 'translateZ(0) rotate3d(1, 0, 0, -90deg) skew(0deg)'
		}
	],
	left: [
		SurfaceBase,
		{
			backgroundColor: '#191919',
			left: '0',
			transformOrigin: 'left center',
			transform: 'translateZ(0) rotate3d(0, 1, 0, 90deg) skew(0, 0deg)'
		}
	],
	right: [
		SurfaceBase,
		{
			backgroundColor: '#191919',
			right: '0',
			transformOrigin: 'right center',
			transform: 'translateZ(0) rotate3d(0, 1, 0, -90deg) skew(0, 0deg)'
		}
	],
	back: [
		SurfaceBase,
		{
			height: '100vh',
			width: '100vw',
			backgroundColor: 'darkblue',
			transform: 'translate3d(0, 0, -600px)',
			willChange: 'transform'
		}
	]
})
