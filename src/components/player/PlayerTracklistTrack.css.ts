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
	cursor: "pointer",
	selectors: {
		'&.active': {
			backgroundColor: '#0818c4'
		},
		'&:hover': {
			backgroundColor: '#0818c4'
		}
	}
})

export const SubTracklist = style({
	paddingLeft: "25px"
})


globalStyle(`${TracklistTrackWrapper} span`, {
	textOverflow: "ellipsis",
	overflow: "hidden",
	whiteSpace: "nowrap",
})

globalStyle(`${TracklistTrackWrapper} .track-title`, {
	direction: "rtl",
	textOverflow: "ellipsis",
	overflow: "hidden",
	whiteSpace: "nowrap",
})
