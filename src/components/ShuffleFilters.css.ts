import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const shuffleFilter = style({
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'wrap',
	color: theme.color.text,
	minHeight: 0,
	background: theme.color.primary,
	'@media': {
		'screen and (--md)': {
			flexWrap: 'nowrap',
			minHeight: theme.dimensions.subheaderHeight
		}
	}
})

globalStyle('.filtr-item', {
	willChange: 'opacity, transform'
})

globalStyle(`${shuffleFilter} label:not(.fixedBottomMobile)`, {
	display: 'flex',
	alignItems: 'center',
	gap: '4px',
	lineHeight: theme.dimensions.subheaderHeight,
	paddingLeft: '4px',
	paddingRight: '4px'
})
