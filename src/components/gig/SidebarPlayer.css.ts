import { style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'
import { WinampInset } from '../player/PlayerTracklist.css'

export const PlayerSidebarWrapper = style({
	height: "100vh",
	position: "relative",
	zIndex: 6,
	boxSizing: "border-box",
	display: "flex",
	flexDirection: "column",
	background: 'linear-gradient(to left, #1a1927 0%, #353551 53%, #21212d 100%)',
	border: theme.borders.groove,
	borderRadius: '3px'
})

export const PlayerSidebarBottomWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	minHeight: 0,
	flex: 1,
	'@media': {
		'screen and (--md)': {
			flexDirection: 'row'
		}
	}
})

export const PlayerSidebarContentWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	border: theme.borders.groove,
	borderRadius: '3px',
	minHeight: 0,
	flex: 1,
	margin: '0 5px 5px 0',
	padding: '0 5px 5px 5px'
})

export const PlayerSidebarChildrenWrapper = style([WinampInset, {
	padding: '0px',
	minHeight: 0,
	flex: 1,
	overflow: 'auto',
}])

export const PlayerSidebarTracklist = style({
	display: 'flex',
	minHeight: 0,
	flexDirection: 'column',
	border: theme.borders.groove,
	borderRadius: '3px',
	margin: '0px 5px 5px 5px',
	padding: '0px 5px 5px 5px',
	maxWidth: `420px`
})

export const PlayerSidebarWaveWrapper = style({
	marginLeft: '5px',
	marginRight: '5px',
	padding: '5px',
	border: theme.borders.groove,
	borderRadius: '3px',
})
