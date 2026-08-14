import { theme } from '@src/Theme.css'
import { style, globalStyle } from '@vanilla-extract/css'

export const TrackActionMenuWrapper = style({
	marginLeft: 'auto',
	position: 'relative',
	display: 'flex',
	justifyContent: 'center',
	width: '100%'
})

export const TrackActionMenuTriggerButton = style({
	display: 'flex',
	width: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	border: 0,
	padding: 0,
	background: 'transparent',
	color: '#bfced9',
	cursor: 'pointer',
	selectors: {
		'&:hover': {
			filter: 'brightness(0.8)'
		},
		'&.open': {
			backgroundColor: '#e7d1ab',
			color: 'black'
		}
	}
})

export const TrackActionMenu = style({
	position: 'absolute',
	minWidth: '120px',
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: '#353551',
	border: '1px solid #e7d1ab',
	borderRadius: '3px',
	boxShadow: theme.borders.shadow,
	visibility: 'hidden',
	opacity: 0,
	pointerEvents: 'none',
	zIndex: 20,
	transform: 'translate(-100%, -100%)',
	selectors: {
		'&.open': {
			visibility: 'visible',
			opacity: 1,
			pointerEvents: 'auto',
		},
		'&.portal': {
			position: 'fixed'
		}
	}
})

export const TrackActionMenuItem = style({
	display: 'flex',
	alignItems: 'center',
	gap: '0.5rem',
	padding: '6px 10px',
	color: '#e7d1ab',
	fontFamily: 'monospace',
	fontSize: "12px",
	textDecoration: 'none',
	whiteSpace: 'nowrap',
	borderBottom: "1px solid #e7d1ab",
	selectors: {
		'&:hover': {
			backgroundColor: '#0818c4'
		}
	}
})

globalStyle(`${TrackActionMenuItem} span`, {
	textOverflow: "ellipsis",
	fontSize: "12px",
	overflow: "hidden",
	whiteSpace: "nowrap",
	'@media': {
		'screen and (--md)': {
			fontSize: "16px",
		}
	}
})
