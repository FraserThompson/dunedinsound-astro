import { style } from '@vanilla-extract/css'
import { theme } from '@src/Theme.css'
import { WinampBackground } from '../player/PlayerTracklist.css'

export const PlayerLibraryContainer = style([
	WinampBackground,
	{
		position: 'relative',
		zIndex: 1,
		boxSizing: 'border-box',
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		height: '100%',
		maxHeight: '100%',
		overflow: 'hidden',
	},
])

export const PlayerTableHeader = style({
	display: 'grid',
	alignItems: 'stretch',
	boxSizing: 'border-box',
	flexShrink: 0
})


export const PlayerLibraryControls = style({
	margin: '0px 5px 5px 5px',
	flex: 1,
	minHeight: 0,
	display: 'flex',
	flexDirection: 'column',
})

// Shared Winamp-Style Header Buttons
export const PlayerLibraryHeaderButton = style({
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	minHeight: '18px',
	minWidth: 0,
	flex: 1,
	padding: '0 3px',
	boxSizing: 'border-box',
	border: theme.borders.groove,
	borderRadius: '2px',
	background: '#3f4362',
	color: '#fffadf',
	fontFamily: 'monospace',
	fontSize: '11px',
	lineHeight: 1,
	textTransform: 'uppercase',
	letterSpacing: '0.02em',
	textShadow: '0 1px 0 rgba(0, 0, 0, 0.75)',
	boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
})

export const PlayerLibraryColumnLabel = style({
	minWidth: 0,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
})

export const PlayerLibraryActionBar = style({
	display: 'flex',
	flexWrap: 'wrap'
})

export const AddButtonWrapper = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '24px',
	height: '24px',
	border: '0',
	padding: 0,
	background: 'transparent',
})
