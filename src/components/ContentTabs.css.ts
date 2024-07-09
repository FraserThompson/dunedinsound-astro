import { globalStyle, style } from '@vanilla-extract/css'
import { dividerWrapper } from './Divider.css'
import { theme } from 'src/Theme.css'

export const tabsWrapper = style([
	dividerWrapper['sticky'],
	{
		padding: 0,
		zIndex: 7
	}
])

export const tabButton = style({
	borderRadius: '4px 4px 0 0',
	color: theme.color.darkText,
	borderLeft: theme.borders.contrast,
	borderRight: theme.borders.contrast,
	borderBottom: theme.borders.contrast,
	borderBottomColor: 'transparent',
	borderTop: 'none',
	height: '100%',
	textOverflow: 'clip',
	overflow: 'hidden',
	selectors: {
		'&:active,&:focus,&.active': {
			color: 'white',
			backgroundColor: 'black',
			outline: 0
		},
		'&:hover:not(.active)': {
			color: 'black'
		}
	}
})

export const tabContent = style({})

globalStyle(`${tabContent} > *`, {
	display: 'none'
})

globalStyle(`${tabContent} > *.active`, {
	display: 'block'
})
