import { createVar, fallbackVar, globalStyle, style } from "@vanilla-extract/css"
import { theme } from "../../Theme.css"

export const maxHeightVar = createVar()
export const maxHeightDesktopVar = createVar()

export const WinampInset = style({
	backgroundColor: 'black',
	border: theme.borders.groove,
	borderRadius: '3px',
	scrollbarWidth: 'thin',
	scrollbarColor: '#d5ceb1 black',
	fontFamily: 'monospace',
	fontSize: "16px"
})

export const WinampBackground = style({
	background: 'linear-gradient(to left, #1a1927 0%, #353551 53%, #21212d 100%)',
	border: theme.borders.groove,
	borderRadius: '3px',
})

export const TracklistWrapper = style([WinampInset, {
	flex: 1,
	margin: '0px',
	paddingLeft: '0px',
	paddingRight: '0px',
	overflowY: 'auto',
	maxHeight: fallbackVar(maxHeightVar, '100%'),
	'@media': {
		'screen and (--md)': {
			maxHeight: fallbackVar(maxHeightDesktopVar, maxHeightVar, '100%'),
		}
	}
}])

export const TracklistTrack = style({
	lineHeight: '1.2rem',
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
	lineHeight: '1.2rem',
	height: '100%',
	color: '#28da1d'
})

globalStyle(`${TracklistTrack} a:hover`, {
	color: theme.color.lightContrast2
})
