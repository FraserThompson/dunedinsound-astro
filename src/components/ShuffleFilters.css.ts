import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

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
			minHeight: theme.dimensions.subheaderHeight,
			minWidth: theme.dimensions.sidebarWidth
		}
	}
})

export const modalFiltersWrapper = style({
	display: 'flex',
	flexDirection: 'column'
})

export const dropdownButton = style(({
	position: 'fixed',
	top: '0px',
	right: '0px',
	'@media': {
		'screen and (--md)': {
			position: 'static'
		}
	}
}))

globalStyle('.filtr-item', {
	willChange: 'opacity, transform'
})

globalStyle(`${shuffleFilter} label:not(.fixedBottomMobile)`, {
	display: 'flex',
	alignItems: 'center',
	textWrap: 'nowrap',
	gap: '4px',
	lineHeight: theme.dimensions.subheaderHeight,
	paddingLeft: '4px',
	paddingRight: '4px'
})
