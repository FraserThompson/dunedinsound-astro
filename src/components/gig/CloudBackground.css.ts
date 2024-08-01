import { keyframes, style } from '@vanilla-extract/css'

export const CloudsWrapper = style({ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' })

const animateCloud = keyframes({
	'0%': { marginLeft: '-1000px' },
	'100%': { transform: '100%' }
})

export const cloudBase = style({
	background: 'linear-gradient(to top, #fff 5%, #f1f1f1 100%)',
	filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='#fff', endColorstr='#f1f1f1',GradientType=0 )",
	borderRadius: '100px',
	boxShadow: '0 8px 5px rgba(0, 0, 0, 0.1)',
	height: '120px',
	position: 'relative',
	width: '350px',
	selectors: {
		'&:after,&:before': {
			background: '#fff',
			content: "''",
			position: 'absolute',
			zIndex: '-1'
		},
		'&:after': {
			borderRadius: '100px',
			height: '100px',
			left: '50px',
			top: '-50px',
			width: '100px'
		},
		'&:before': {
			borderRadius: '200px',
			width: '180px',
			height: '180px',
			right: '50px',
			top: '-90px'
		}
	}
})

export const cloud1 = style({
	animation: `${animateCloud} 35s linear infinite`,
	transform: 'scale(0.65)'
})

export const cloud2 = style({
	animation: `${animateCloud} 20s linear infinite`,
	transform: 'scale(0.3)'
})

export const cloud3 = style({
	animation: `${animateCloud} 30s linear infinite`,
	transform: 'scale(0.5)'
})

export const cloud4 = style({
	animation: `${animateCloud} 18s linear infinite`,
	transform: 'scale(0.4)'
})

export const cloud5 = style({
	animation: `${animateCloud} 25s linear infinite`,
	transform: 'scale(0.55)'
})
