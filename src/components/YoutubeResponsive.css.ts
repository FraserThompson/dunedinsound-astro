import { createVar, globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const youtubeWrapper = style({
	position: 'relative',
	paddingBottom: '56.25%',
	paddingTop: '25px',
	height: '0',
	overflow: 'hidden',
	width: '100%'
})

globalStyle(`${youtubeWrapper} iframe, ${youtubeWrapper} img`, {
	position: 'absolute',
	top: '0',
	left: '0',
	width: '100%',
	height: '100%'
})

export const watchOnYoutubeLink = style({
	padding: theme.dimensions.basePadding,
	position: 'absolute',
	bottom: '0',
	left: '0'
})

export const placeholderLink = style({
	cursor: 'pointer',
	transform: 'scale(1, 1)',
	selectors: {
		'&:hover, &:active': {
			outline: 0,
			transform: 'scale(1.1, 1.1)',
			color: theme.color.foreground
		}
	}
})

export const placeholderOverlay = style({
	background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 10%)',
	position: 'absolute',
	top: '0',
	left: '0',
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
})

export const placeholderOverlayTitle = style({
	color: theme.color.text,
	padding: theme.dimensions.basePadding,
	position: 'absolute',
	top: '0px',
	left: '0px',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	wordWrap: 'break-word'
})
