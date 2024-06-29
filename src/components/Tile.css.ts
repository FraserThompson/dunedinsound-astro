import { createVar, globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const background = createVar()
export const height = createVar()
export const width = createVar()
export const heightHover = createVar()
export const fontSize = createVar()

export const tileWrapper = style({
	background,
	color: theme.color.text,
	position: 'relative',
	display: 'block',
	height,
	width,
	overflow: 'hidden',
	transition: 'height 100ms ease-in-out',
	selectors: {
		'&:hover': {
			height: heightHover
		}
	}
})

export const titleWrapper = style({
	zIndex: '5',
	position: 'absolute',
	bottom: '0px',
	background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4) 60%)',
	height: '100%',
	width: '100%',
	display: 'flex'
})

export const tileContent = style({
	width: '100%',
	marginLeft: '0',
	display: 'flex',
	flexDirection: 'column'
})

export const tileTextContent = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center'
})

globalStyle(`${tileTextContent} > div`, {
	maxWidth: theme.dimensions.contentContainerWidth
})

export const tileTitle = style({
	marginLeft: '0',
	marginBottom: '5px',
	color: '#a7a7a7',
	fontSize: fontSize,
	textShadow: '1px 1px 1px black'
})

export const tileSubtitle = style({
	margin: '0px',
	marginTop: 'auto',
	lineHeight: '0.9',
	color: '#9b9b9b',
	textShadow: '1px 1px 1px black'
})
