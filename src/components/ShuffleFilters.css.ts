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
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding,
			flexWrap: 'nowrap'
		}
	}
})

globalStyle(`${shuffleFilter} > div`, {
	paddingRight: '0px',
	display: 'flex',
	textWrap: 'nowrap',
	'@media': {
		'screen and (--xs)': {
			paddingRight: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${shuffleFilter} label, ${shuffleFilter} span`, {
	display: 'inline-block',
	lineHeight: theme.dimensions.subheaderHeight,
	paddingRight: theme.dimensions.basePadding
})

globalStyle(`${shuffleFilter} input, ${shuffleFilter} select, ${shuffleFilter} .buttonGroup`, {
	marginLeft: '0px'
})

globalStyle(`${shuffleFilter} .buttonGroup`, {
	display: 'flex'
})
