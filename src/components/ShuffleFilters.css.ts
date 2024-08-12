import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const shuffleFilter = style({
	paddingLeft: 0,
	paddingRight: 0,
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'wrap',
	color: theme.color.text,
	minHeight: theme.dimensions.subheaderHeight,
	'@media': {
		'screen and (--xs)': {
			flexWrap: 'nowrap'
		}
	}
})

globalStyle(`${shuffleFilter} .filterGroup`, {
	display: 'flex',
	marginLeft: 'auto',
	gap: theme.dimensions.basePaddingMobile,
	'@media': {
		'screen and (--xs)': {
			gap: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${shuffleFilter} div:not(.buttonGroup)`, {
	paddingRight: '0px',
	display: 'flex',
	textWrap: 'nowrap',
	gap: theme.dimensions.basePaddingMobile,
	'@media': {
		'screen and (--xs)': {
			gap: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${shuffleFilter} label`, {
	display: 'flex',
	lineHeight: theme.dimensions.subheaderHeight
})
