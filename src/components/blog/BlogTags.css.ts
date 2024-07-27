import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const tagsWrapper = style({
	display: 'flex',
	justifyContent: 'center',
	flexWrap: 'wrap',
	gap: '0.4rem'
})

export const tagLink = style({
	backgroundColor: theme.color.lightText,
	paddingLeft: theme.dimensions.basePadding,
	paddingRight: theme.dimensions.basePadding,
	color: theme.color.darkText,
	borderRadius: '0.25rem',
	textTransform: 'uppercase',
	selectors: {
		'&.active': {
			backgroundColor: theme.color.contrast2
		}
	}
})
