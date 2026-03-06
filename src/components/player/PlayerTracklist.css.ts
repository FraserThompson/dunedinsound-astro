import { globalStyle, style } from "@vanilla-extract/css"
import { theme } from "../../Theme.css"

export const TracklistWrapper = style({
	flex: 1,
	backgroundColor: 'black',
	margin: '0px',
	border: theme.borders.groove,
	borderRadius: '3px',
	paddingLeft: '0px',
	paddingRight: '0px',
	overflowY: 'auto',
	scrollbarWidth: 'thin',
	scrollbarColor: '#d5ceb1 black',
})

export const TracklistTrack = style({
	lineHeight: '1.5rem',
	paddingLeft: '3px',
	paddingRight: '3px',
	listStyle: 'none',
	textAlign: 'left',
	fontFamily: 'monospace',
	color: '#28da1d',
	display: 'flex',
	flexDirection: 'row',
	selectors: {
		'&.active': {
			backgroundColor: '#0818c4'
		}
	}
})

export const TrackButton = style({
	cursor: "pointer",
	display: "block",
	textOverflow: "ellipsis",
	overflow: "hidden",
	whiteSpace: "nowrap",
})

globalStyle(`${TracklistTrack} a`, {
	color: '#28da1d'
})

globalStyle(`${TracklistTrack} a:hover`, {
	color: theme.color.lightContrast2
})
