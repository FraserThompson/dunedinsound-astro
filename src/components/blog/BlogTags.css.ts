import { style } from '@vanilla-extract/css'
import { theme } from '../../ThemeContract.css'

export const tagsWrapper = style({
	display: 'flex',
	justifyContent: 'center',
	flexWrap: 'wrap',
	gap: '0.4rem'
})

export const tagLink = style({
	backgroundColor: theme.color.lightText,
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	color: theme.color.darkText,
	borderRadius: '0.25rem',
	textTransform: 'uppercase',
	fontSize: '14px',
	selectors: {
		'&.active': {
			backgroundColor: theme.color.contrast2
		}
	}
})
