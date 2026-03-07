import { style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'

export const CompactPlayerWrapper = style({
	transition: 'all 150ms ease-in-out',
	background: 'linear-gradient(to left, #1a1927 0%, #353551 53%, #21212d 100%)',
	border: theme.borders.groove,
	borderRadius: '3px',
	boxShadow: theme.borders.shadowTop
})

export const AudioWrapper = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	marginLeft: '5px',
	marginRight: '5px'
})

export const WinampTitlebar = style({
	textAlign: 'left',
	backgroundColor: '#e7d1ab',
	color: '#cccfd6',
	fontSize: '12px',
	fontFamily: 'monospace',
	position: 'relative',
	marginLeft: '10px',
	marginRight: '10px',
	marginTop: '5px',
	marginBottom: '5px',
	height: '10px',
	borderRadius: '2px',
	selectors: {
		'&::before': {
			background:
				'-webkit-linear-gradient(top, #fffcdf 0%, #fffcdf 29%, #736c50 32%, #736c50 66%, #d5ceb1 69%, #d5ceb1 100%)',
			content: "''",
			height: '8px',
			width: '100%',
			marginTop: '1px',
			position: 'absolute',
			zIndex: '0'
		},
		'&::after': {
			content: "attr(data-title)",
			position: 'absolute',
			marginTop: '-5px',
			textAlign: 'center',
			paddingLeft: '10px',
			paddingRight: '10px',
			zIndex: '1',
			left: '50%',
			transform: 'translate(-50%)',
			backgroundColor: '#353551'
		}
	}
})

export const WinampTracklistWrapper = style({
	overflowY: 'auto',
	maxHeight: '160px',
	scrollbarWidth: 'thin',
	scrollbarColor: 'gray black',
})
