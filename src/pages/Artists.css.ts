import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const artistListItem = style({
	display: 'flex',
	alignItems: 'center',
	contentVisibility: 'auto',
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	height: '1.5em',
	borderBottom: '1px solid rgba(255,255,255,0.1)',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	selectors: {
		'&.dead': {
			color: theme.color.dullText
		}
	},
	'@media': {
		'screen and (--md)': {
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding,
		}
	}
})

export const artistGigCount = style({
	marginLeft: 'auto',
	color: theme.color.dullText
})
