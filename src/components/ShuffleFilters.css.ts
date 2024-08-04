import { createVar, globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const top = createVar()

export const shuffleFilter = style({
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
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
	display: 'none',
	'@media': {
		'screen and (--xs)': {
			display: 'inline-block'
		}
	}
})

globalStyle(`${shuffleFilter} input, ${shuffleFilter} select, ${shuffleFilter} .buttonGroup`, {
	marginLeft: '0px',
	'@media': {
		'screen and (--xs)': {
			marginLeft: theme.dimensions.basePadding
		}
	}
})

globalStyle(`${shuffleFilter} .buttonGroup`, {
	display: 'flex'
})
