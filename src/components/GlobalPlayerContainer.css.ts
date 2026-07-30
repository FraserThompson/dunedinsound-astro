import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'
import { WinampBackground } from './player/PlayerTracklist.css'

export const playerWrapper = style({
	position: 'fixed',
	zIndex: 8,
	bottom: '-400px',
	transform: `translateY(100%)`,
	left: '0px',
	overflow: 'visible',
	marginTop: 'auto',
	width: `100%`,
	marginLeft: 0,
	pointerEvents: 'none',
	boxSizing: 'border-box',
	transition: 'transform 150ms ease-in-out',
	selectors: {
		'&:state(visible):state(open)': {
			transform: `translateY(0px)`,
			pointerEvents: 'auto',
		},
		'&:state(visible)': {
			bottom: theme.dimensions.headerHeightMobile,
			transform: `translateY(100%)`,
		}
	},
	'@media': {
		'screen and (--md)': {
			zIndex: 10,
			width: `calc(100% - ${theme.dimensions.headerHeight})`,
			marginLeft: theme.dimensions.headerHeight,
			selectors: {
				'&:state(visible)': {
					bottom: 0,
				}
			}
		}
	}
})

export const compactPlayerControls = style({
	display: 'flex',
	width: '100%',
})

export const playerBarWrapper = style({
	position: 'absolute',
	textAlign: 'right',
	width: '100%',
	transition: 'transform 300ms ease-in-out',
	transform: `translateY(0px)`,
	display: 'inline-block',
	top: `${theme.dimensions.headerHeightNegative}`,
	boxSizing: 'border-box',
	left: '0px',
})

export const icon = style({
	width: "30px",
	paddingRight: '5px',
	paddingLeft: '5px',
	fontSize: '23px',
	color: '#e7d1ab',
})

export const playerBar = style([WinampBackground, {
	boxSizing: 'border-box',
	padding: '0px',
	width: '100vw',
	position: 'relative',
	display: 'inline-flex',
	justifyContent: 'flex-start',
	alignItems: 'center',
	gap: '0px',
	fontFamily: 'monospace',
	fontSize: theme.font.baseSize,
	pointerEvents: 'auto',
	boxShadow: theme.borders.shadowTop,
	transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
	height: theme.dimensions.subheaderHeight,
	color: '#fffc',
	selectors: {
		'&:hover': {
			boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)'
		}
	},
	'@media': {
		'screen and (--md)': {
			width: '640px',
			padding: '0px 5px 0px 5px',
			gap: '5px'
		}
	}
}])

export const openButtonToggle = style({
	border: 0,
	padding: 0,
	background: 'transparent',
	fontSize: '23px',
	color: '#e7d1ab',
	flexGrow: 1,
	minWidth: '18px',
	cursor: 'pointer'
})

export const player = style({
	transition: 'opacity 150ms ease-in-out',
	filter: 'drop-shadow(2px 2px 10px black)',
	pointerEvents: 'none',
	visibility: 'hidden',
	opacity: '0'
})

export const titleBarClose = style({
	position: 'absolute',
	zIndex: '11',
	right: '0px',
	top: '0px'
})

// Player open styles
globalStyle(`${playerWrapper}:state(open) ${player}`, {
	opacity: 1,
	visibility: 'visible',
	pointerEvents: 'auto'
})

globalStyle(`${playerWrapper}:state(open) ${playerBarWrapper}`, {
	transform: `translateY(100%)`
})

globalStyle(`${playerWrapper}:state(open) ${icon}.up`, {
	display: 'none'
})

globalStyle(`${playerWrapper}:state(open) ${icon}.down`, {
	display: 'inline-block !important'
})

// Player playing styles
globalStyle(`${playerWrapper}:state(playing) ${icon}.play`, {
	display: 'inline-flex !important'
})
