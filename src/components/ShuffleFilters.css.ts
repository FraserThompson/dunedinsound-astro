import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const shuffleFilter = style({
	paddingLeft: 0,
	paddingRight: 0,
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'wrap',
	color: theme.color.text,
	minHeight: theme.dimensions.headerHeightMobile,
	'@media': {
		'screen and (--md)': {
			flexWrap: 'nowrap',
			minHeight: theme.dimensions.subheaderHeight,
		}
	}
})

globalStyle(`${shuffleFilter} .filterGroup`, {
	display: 'flex',
	alignItems: 'center',
	marginLeft: 'auto',
	gap: theme.dimensions.basePaddingMobile,
	'@media': {
		'screen and (--md)': {
			gap: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${shuffleFilter} div:not(.buttonGroup)`, {
	paddingRight: '0px',
	display: 'flex',
	alignItems: 'center',
	textWrap: 'nowrap',
	gap: theme.dimensions.basePaddingMobile,
	'@media': {
		'screen and (--md)': {
			gap: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${shuffleFilter} label`, {
	display: 'flex',
	alignItems: 'center',
	lineHeight: theme.dimensions.subheaderHeight
})
