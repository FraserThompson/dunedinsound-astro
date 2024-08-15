import { globalStyle, style } from '@vanilla-extract/css'
import { dividerWrapper } from './Divider.css'
import { theme } from 'src/Theme.css'

export const tabsWrapper = style([
	dividerWrapper['sticky'],
	{
		padding: 0,
		zIndex: 7,
		top: theme.dimensions.headerHeightMobile,
		'@media': {
			'screen and (--md)': {
				top: '0px'
			}
		}
	}
])

export const tabButton = style({
	borderRadius: '6px 6px 0 0',
	borderLeft: theme.borders.contrast,
	borderRight: theme.borders.contrast,
	borderBottom: theme.borders.contrast,
	borderTop: theme.borders.contrast,
	borderBottomColor: 'transparent',
	height: '100%',
	textOverflow: 'clip',
	overflow: 'hidden'
})

export const tabContent = style({})

globalStyle(`${tabContent} > *`, {
	display: 'none'
})

globalStyle(`${tabContent} > *.active`, {
	display: 'block'
})
