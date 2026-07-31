import { style, globalStyle } from '@vanilla-extract/css'

export const TracklistTrackWrapper = style({
	minHeight: '1.5rem',
	display: 'grid',
	position: 'relative',
	gridTemplateColumns: `minmax(0, 6fr) minmax(0, 0.5fr)`,
	alignItems: 'center',
	columnGap: '5px',
	paddingLeft: '3px',
	paddingRight: '3px',
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
