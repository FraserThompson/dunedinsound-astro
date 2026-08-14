import { createVar, globalStyle, style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'
import { WinampBackground, WinampInset } from './player/PlayerTracklist.css'
import { WinampTitlebar } from './CompactPlayer.css'

export const playerPaneWidthVar = createVar()

export const LibraryPlayerWrapper = style([WinampBackground, {
	height: [`calc(100vh - ${theme.dimensions.headerHeightMobile})`, `calc(100svh - ${theme.dimensions.headerHeightMobile})`],
	position: "relative",
	zIndex: 6,
	boxSizing: "border-box",
	display: "flex",
	flexDirection: "column",
	paddingBottom: theme.dimensions.subheaderHeight,
	transition: 'padding-bottom 0.25s ease-in-out',
	willChange: 'padding-bottom',
	'@media': {
		'screen and (--md)': {
			paddingBottom: '0 !important',
			height: "100vh",
		}
	}
}])

export const LibraryPlayerSidebarWrapper = style({
	display: "flex",
	flexDirection: "column",
	minWidth: 0,
	minHeight: 0
})

export const LibraryPlayerBottomWrapper = style({
	flex: 1,
	display: 'grid',
	gap: '5px',
	margin: '5px',
	gridTemplateColumns: '1fr',
	minHeight: 0,
	'@media': {
		'screen and (--md)': {
			gridTemplateColumns: '5fr 2fr 3fr',
		}
	}
})

export const LibraryPlayerContentWrapper = style({
	display: 'flex',
	flexDirection: 'column',
	border: theme.borders.groove,
	borderRadius: '3px',
	minHeight: 0,
	minWidth: 0,
	flex: 1,
	transition: 'height 0.25s ease-in-out',
	willChange: 'height',
	position: 'relative',
	padding: '0px 5px 5px 5px',
	height: '40px',
	'@media': {
		'screen and (--md)': {
			height: 'auto !important',
		}
	},
	'selectors': {
		'&.open': {
			height: '30vh',
		},
	}
})

export const LibraryPlayerContentToggle = style({
	position: 'absolute',
	display: 'block',
	right: '0px',
	top: '-3px',
	zIndex: 11,
	border: 0,
	padding: 0,
	background: 'transparent',
	cursor: 'pointer',
	'@media': {
		'screen and (--md)': {
			display: 'none',
		}
	},
})

export const LibraryPlayerContentToggleIcon = style({
	paddingRight: '5px',
	paddingLeft: '5px',
	fontSize: '23px',
	color: '#e7d1ab'
})

export const LibraryPlayerChildrenWrapper = style([WinampInset, {
	padding: '0px',
	minHeight: 0,
	flex: 1,
	overflow: 'auto',
}])

export const LibraryPlayerPlaylistWrapper = style({
	display: 'flex',
	flexGrow: 1,
	minHeight: 0,
	minWidth: 0,
	flexDirection: 'column',
	border: theme.borders.groove,
	borderRadius: '3px',
	padding: '0px 5px 5px 5px',
})

export const LibraryPlayerLibraryWrapper = style({
	display: 'flex',
	flexWrap: 'wrap',
	alignContent: 'start',
	minHeight: 0,
	flexDirection: 'row',
	border: theme.borders.groove,
	borderRadius: '3px',
	margin: '0px 5px 5px 5px',
	padding: '0px 5px 5px 5px',
	'@media': {
		'screen and (--md)': {
			width: '800px',
		}
	}
})

export const LibraryPlayerWaveWrapper = style({
	marginLeft: '5px',
	marginRight: '5px',
	padding: '5px',
	border: theme.borders.groove,
	borderRadius: '3px',
})

export const LibraryContentFooterWrapper = style({})

globalStyle(`${LibraryPlayerContentWrapper} ${WinampTitlebar}`, {
	marginRight: '30px',
	'@media': {
		'screen and (--md)': {
			marginRight: '10px'
		}
	},
})
