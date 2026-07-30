import { style } from '@vanilla-extract/css'


export const CurrentTrackPanel = style({
	position: 'relative',
	overflow: 'hidden',
	minHeight: '18px',
	minWidth: '130px',
	display: 'flex',
	alignItems: 'center',
	boxSizing: 'border-box'
})

export const CurrentTrackStatus = style({
	maxWidth: '125px',
	height: '16px',
	padding: '0 6px',
	display: 'flex',
	alignItems: 'center',
	gap: '0px',
	boxSizing: 'border-box',
	position: 'relative',
	zIndex: 1
})

export const CurrentTrackStatusText = style({
	margin: 0,
	padding: 0,
	color: '#28da1d',
	fontSize: '12px',
	lineHeight: 1,
	whiteSpace: 'nowrap'
})
