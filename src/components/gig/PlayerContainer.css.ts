import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

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
			pointerEvents: 'none',
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
					transform: 'translateY(100px)',
					paddingLeft: `calc(${theme.dimensions.sidebarWidth} + ${theme.dimensions.headerHeight})`,
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
	selectors: {
		'&.minimized': {
			display: 'inline-block',
			paddingLeft: 0,
			width: `100%`
		},
		'&.open': {
			position: 'static',
			paddingLeft: 0,
			width: '100%'
		}
	},
	'@media': {
		'screen and (--md)': {
			bottom: '100px',
			selectors: {
				'&.minimized': {
					display: 'inline-block',
					paddingLeft: `calc(${theme.dimensions.sidebarWidth} + ${theme.dimensions.headerHeight})`,
				},
				'&.open': {
					position: 'static',
					paddingLeft: 0,
					width: '100%'
				}
			}
		}
	}
})

export const openButton = style({
	fontFamily: 'monospace',
	fontSize: theme.font.baseSize,
	pointerEvents: 'auto',
	boxShadow: '-2px -1px 3px rgb(0 0 0 / 32%), 3px 1px 3px rgb(0 0 0 / 42%)',
	transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
	border: 'none',
	paddingRight: '6px',
	height: theme.dimensions.headerHeight,
	color: 'black',
	backgroundColor: '#bfced9',
	borderTopLeftRadius: '20px',
	borderTopRightRadius: '20px',
	selectors: {
		'&:hover': {
			color: 'black',
			backgroundColor: theme.color.lightForeground,
			boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)'
		}
	}
})

export const player = style({
	filter: 'drop-shadow(2px 2px 10px black)',
	pointerEvents: 'auto',
	visibility: 'visible',
	opacity: '1',
	selectors: {
		'&.minimized:not(.open)': {
			pointerEvents: 'none',
			visibility: 'hidden',
			opacity: '0'
		}
	}
})
