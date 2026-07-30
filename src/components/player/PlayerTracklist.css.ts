import { createVar, fallbackVar, style } from "@vanilla-extract/css"
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
