import { style, globalStyle } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'
import { WinampInset } from './PlayerTracklist.css'

export const WaveWrapper = style([WinampInset, {
	flexGrow: 1,
	minHeight: '65px',
	position: 'relative'
}])

globalStyle(`${WaveWrapper} div::part(marker)`, {
	cursor: 'pointer !important',
	width: '3px !important',
	zIndex: '4 !important',
	backgroundColor: 'rgba(0, 0, 0, 0.8) !important'
})

globalStyle(`${WaveWrapper} div::part(marker):hover`, {
	zIndex: '5 !important',
	backgroundColor: 'rgba(0, 0, 0, 1) !important'
})

globalStyle(`${WaveWrapper} div::part(region-content)`, {
	content: 'attr(data-id)',
	zIndex: '4 !important',
	transition: 'background-color 100ms ease-in-out',
	position: 'absolute',
	bottom: 0,
	color: theme.color.text,
	backgroundColor: 'rgba(0, 0, 0, 0.6)',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	fontSize: '12px',
	lineHeight: '85%'
})

globalStyle(`${WaveWrapper} div::part(region-content):hover`, {
	backgroundColor: 'rgba(0, 0, 0, 1)',
	zIndex: '5 !important',
	maxWidth: '1000px'
})

globalStyle(`${WaveWrapper} wave`, {
	zIndex: 10
})

export const LengthWrapper = style({
	lineHeight: '1em',
	color: '#28da1d',
	pointerEvents: 'none',
	zIndex: '11',
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	fontFamily: 'monospace',
	backgroundColor: 'black'
})
