import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'

export const playerWrapper = style({
	bottom: '0px',
	left: '0px',
	zIndex: '11',
	overflow: 'visible',
	marginTop: 'auto',
	width: '100%',
	pointerEvents: 'auto',
	transition: 'transform 150ms ease-in-out',
	boxSizing: 'border-box',
	selectors: {
		'&:state(minimized)': {
			transform: 'translateY(100px)',
			position: 'fixed',
			paddingLeft: 0,
			width: `100%`,
			pointerEvents: 'none'
		},
		'&:state(minimized):state(open)': {
			transform: `translateY(${theme.dimensions.headerHeightMobileNegative})`
		},
		'&:state(open)': {
			pointerEvents: 'auto'
		}
	},
	'@media': {
		'screen and (--md)': {
			selectors: {
				'&:state(minimized)': {
					transform: 'translateY(100px)'
				},
				'&:state(minimized).sidebarExists': {
					paddingLeft: `calc(${theme.dimensions.sidebarWidth} + ${theme.dimensions.headerHeight})`
				},
				'&:state(minimized):state(open)': {
					transform: 'translateY(0)'
				}
			}
		}
	}
})

export const openButtonWrapper = style({
	display: 'none',
	position: 'absolute',
	textAlign: 'center',
	width: '100%',
	bottom: `calc(${theme.dimensions.headerHeightMobile} + 100px)`,
	boxSizing: 'border-box',
	left: '0px',
	'@media': {
		'screen and (--md)': {
			bottom: '100px'
		}
	}
})

export const icon = style({
	height: "18px",
	selectors: {
		'&.play': {
			position: 'absolute',
			left: '0px',
			alignItems: 'center',
			animation: "spinner 1s linear infinite"
		}
	}
})

export const openButton = style({
	position: 'relative',
	display: 'inline-flex',
	justifyContent: 'center',
	alignItems: 'center',
	fontFamily: 'monospace',
	fontSize: theme.font.baseSize,
	pointerEvents: 'auto',
	boxShadow: '-2px -1px 3px rgb(0 0 0 / 32%), 3px 1px 3px rgb(0 0 0 / 42%)',
	transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
	border: 'none',
	paddingRight: '6px',
	paddingLeft: '18px',
	height: theme.dimensions.headerHeight,
	color: 'black',
	backgroundColor: '#bfced9',
	borderTopLeftRadius: '20px',
	borderTopRightRadius: '20px',
	selectors: {
		'&:hover': {
			color: 'black',
			backgroundColor: theme.color.contrast2,
			boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)'
		}
	}
})

export const player = style({
	filter: 'drop-shadow(2px 2px 10px black)',
	pointerEvents: 'auto',
	visibility: 'visible',
	opacity: '1'
})

// Player open styles
globalStyle(`${playerWrapper}:state(open) ${icon}.up`, {
	display: 'none'
})

globalStyle(`${playerWrapper}:state(open) ${icon}.down`, {
	display: 'inline-block !important'
})

globalStyle(`${playerWrapper}:state(open) ${openButtonWrapper}`, {
	position: 'static',
	paddingLeft: 0,
	width: '100%'
})

// Player minimized styles
globalStyle(`${playerWrapper}:state(minimized) ${openButtonWrapper}`, {
	display: 'inline-block',
	paddingLeft: 0,
	width: `100%`
})

globalStyle(`${playerWrapper}.sidebarExists:state(minimized):not(:state(open)) ${openButtonWrapper}`, {
	'@media': {
		'screen and (--md)': {
			paddingLeft: `calc(${theme.dimensions.sidebarWidth} + ${theme.dimensions.headerHeight})`
		}
	}
})

globalStyle(`${playerWrapper}:state(minimized):not(:state(open)) #player`, {
	pointerEvents: 'none',
	visibility: 'hidden',
	opacity: '0'
})

// Player playing styles
globalStyle(`${playerWrapper}:state(playing) ${icon}.play`, {
	display: 'inline-flex !important'
})
