import { keyframes, style } from '@vanilla-extract/css'

const marquee = keyframes({
	from: { transform: 'translate(0, 0)' },
	to: { transform: 'translate(-150%, 0)' }
})

export const CurrentTrackMarquee = style({
	width: "230px",
	height: "16px",
	margin: 0,
	padding: 0,
	color: '#28da1d',
	lineHeight: 1,
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	boxSizing: 'border-box'
})

export const CurrentTrackText = style({
	width: "230px",
	display: "inline-block",
	margin: 0,
	padding: 0,
	paddingLeft: "100%",
	color: '#28da1d',
	lineHeight: 1,
	animation: `${marquee} 10s linear infinite`
})
