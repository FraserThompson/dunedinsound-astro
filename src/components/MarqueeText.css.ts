import { style } from '@vanilla-extract/css'

export const CurrentTrackMarquee = style({
	height: "16px",
	margin: 0,
	padding: 0,
	color: '#28da1d',
	lineHeight: 1,
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	boxSizing: 'border-box',
	zIndex: 1
})

export const CurrentTrackText = style({
	position: 'absolute',
	display: "inline-block",
	whiteSpace: "nowrap",
	willChange: "transform",
	fontSize: '12px',
	margin: 0,
	padding: 0,
	color: '#28da1d',
	lineHeight: '18px',
})
