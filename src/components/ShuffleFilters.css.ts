import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const shuffleFilter = style({
	position: 'sticky',
	top: '0px',
	zIndex: '8',
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	display: 'flex',
	alignItems: 'center',
	color: 'black',
	borderBottom: '1px solid black',
	boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
	minHeight: theme.dimensions.subheaderHeight,
	backgroundColor: theme.color.contrast,
	'@media': {
		'screen and (--xs)': {
			top: theme.dimensions.headerHeight
		}
	}
})

globalStyle(`${shuffleFilter} > div`, {
	paddingRight: theme.dimensions.basePadding
})
