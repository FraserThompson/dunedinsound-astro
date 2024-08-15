import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { Titlebar } from './Player.css'

export const GigsShuffleWrapper = style({
	overflow: 'hidden',
	backgroundColor: 'lightblue',
	width: '100%',
	height: `calc(100vh - ${theme.dimensions.subheaderHeight} - 1px)`,
	position: 'relative',
	display: 'flex',
	flexDirection: 'column'
})

export const GigsPlayerWrapper = style({
	zIndex: '2',
	position: 'relative',
	margin: '0 auto',
	padding: '20px',
	maxWidth: '1200px',
	width: '100%',
	boxSizing: 'border-box'
})

export const GigsTitlebar = style([
	Titlebar,
	{
		selectors: {
			'&::after': {
				content: 'GIG JUKEBOX'
			}
		}
	}
])

export const GigsShuffleBottom = style({
	backgroundColor: 'green',
	boxShadow: '0px -150px 1000px white',
	bottom: '0',
	height: '200px',
	width: '100vw',
	marginTop: 'auto'
})
