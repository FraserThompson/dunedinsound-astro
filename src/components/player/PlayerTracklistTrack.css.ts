import { style, globalStyle } from '@vanilla-extract/css'

export const TracklistTrackWrapper = style({
	minHeight: '1.5rem',
	display: 'grid',
	position: 'relative',
	gridTemplateColumns: `28px minmax(0, 6fr) 28px`,
	alignItems: 'center',
	columnGap: '5px',
	listStyle: 'none',
	textAlign: 'left',
	fontFamily: 'monospace',
	color: '#28da1d',
	fontSize: "12px",
	cursor: "pointer",
	selectors: {
		'&.active': {
			backgroundColor: '#0818c4'
		},
		'&:hover': {
			backgroundColor: '#0818c4'
		}
	},
	'@media': {
		'screen and (--md)': {
			fontSize: "16px",
		}
	}
})

export const SubTracklist = style({
	paddingLeft: "25px"
})

export const TrackActionButton = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	border: 0,
	padding: 0,
	background: 'transparent',
	color: '#bfced9',
	cursor: 'pointer',
	selectors: {
		'&:hover': {
			filter: 'brightness(0.8)'
		}
	}
})

globalStyle(`${TracklistTrackWrapper} span`, {
	textOverflow: "ellipsis",
	fontSize: "12px",
	overflow: "hidden",
	whiteSpace: "nowrap",
	'@media': {
		'screen and (--md)': {
			fontSize: "16px",
		}
	}
})

globalStyle(`${TracklistTrackWrapper} .track-title`, {
	fontSize: "12px",
	direction: "rtl",
	textOverflow: "ellipsis",
	overflow: "hidden",
	whiteSpace: "nowrap",
	'@media': {
		'screen and (--md)': {
			fontSize: "16px",
		}
	}
})
