import { globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css'
import { theme } from '../ThemeContract.css'

const camFocus = keyframes({
	'0%': {
		perspective: '10px'
	},
	'100%': {
		perspective: '300px'
	}
})

export const RoomWrapper = style({
	display: 'block',
	overflow: 'hidden',
	backgroundColor: 'black',
	perspective: '280px',
	transition: 'perspective 0.3s ease-in-out',
	width: '100%',
	height: `calc(100vh - ${theme.dimensions.headerHeightMobile})`,
	position: 'relative',
	backfaceVisibility: 'hidden',
	transformStyle: 'preserve-3d',
	animation: `${camFocus} 2s`,
	'@media': {
		'screen and (--xs)': {
			height: `100vh`
		}
	},
	selectors: {
		'&:state(lightson)': {
			perspective: '300px'
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
	willChange: 'transform, box-shadow',
	height: '100%',
	width: '100%',
	background:
		'radial-gradient(#191919 15%, transparent 15%) 0 0, radial-gradient(#292929 15%, transparent 15%) 16px 16px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255, 255, 255, 0.1) 95%, transparent 20%) 16px 17px',
	backgroundSize: '32px 32px'
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
			backgroundColor: 'black',
			top: '0',
			height: '600px',
			transformOrigin: 'center top',
			transform: 'translateZ(0) rotate3d(1, 0, 0, -90deg) skew(0deg)'
		}
	],
	left: [
		SurfaceBase,
		{
			backgroundColor: 'black',
			left: '0',
			zIndex: 3,
			width: '600px',
			transformOrigin: 'left center',
			transform: 'translateZ(0) rotate3d(0, 1, 0, 90deg) skew(0, 0deg)'
		}
	],
	right: [
		SurfaceBase,
		{
			backgroundColor: 'black',
			right: '0',
			width: '600px',
			zIndex: 3,
			transformOrigin: 'right center',
			transform: 'translateZ(0) rotate3d(0, 1, 0, -90deg) skew(0, 0deg)'
		}
	],
	back: [
		SurfaceBase,
		{
			height: `calc(100vh - ${theme.dimensions.headerHeightMobile} - 2px)`,
			width: '100vw',
			backgroundColor: 'black',
			transform: 'translate3d(0, 0, -600px)',
			willChange: 'transform',
			zIndex: 1
		}
	]
})

globalStyle(`${RoomWrapper}:state(lightson) > div`, {
	background:
		'radial-gradient(purple 15%, transparent 15%) 0 0, radial-gradient(yellow 15%, transparent 15%) 16px 16px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 16px 17px',
	backgroundSize: '32px 32px'
})

globalStyle(`${RoomWrapper}:state(lightson) .lightson-hidden`, {
	visibility: 'hidden'
})

globalStyle(`${RoomWrapper} .lightsoff-hidden`, {
	visibility: 'hidden'
})

globalStyle(`${RoomWrapper}:state(lightson) .lightsoff-hidden`, {
	visibility: 'visible'
})
