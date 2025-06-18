import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const tabsWrapper = style([
	{
		height: theme.dimensions.subheaderHeight,
		color: 'black',
		lineHeight: '2',
		verticalAlign: 'middle',
		display: 'flex',
		alignItems: 'center',
		zIndex: 9,
		top: '0px',
		backgroundColor: 'transparent',
		position: 'sticky'
	}
])

export const tabButton = style({
	borderRadius: '6px 6px 0 0',
	borderTop: 'transparent',
	height: '100%',
	fontSize: theme.font.baseSize,
	textOverflow: 'clip',
	overflow: 'hidden',
	backgroundColor: theme.color.text,
	color: theme.color.darkText,
	borderLeft: `2px solid ${theme.color.primary}`,
	borderRight: theme.color.text,
	borderBottom: theme.color.text,
	transition: 'top 0.1s ease-in-out',
	top: '0px',
	selectors: {
		'&.active': {
			color: 'black',
			position: 'relative',
			top: '1px',
			height: 'calc(100% + 1px)',
			borderLeft: theme.borders.secondary,
			borderRight: theme.borders.secondary,
			borderBottom: theme.color.contrast,
			background: theme.color.contrast
		},
		'&:hover:not(.active)': {
			color: 'black',
			backgroundColor: theme.color.text
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
