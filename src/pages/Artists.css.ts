import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const artistsWrapper = style({
	minHeight: '100vh',
	paddingTop: `${theme.dimensions.basePaddingMobile} !important`,
	paddingBottom: `${theme.dimensions.basePaddingMobile} !important`,
	'@media': {
		'screen and (--md)': {
			paddingTop: `${theme.dimensions.basePadding} !important`,
			paddingBottom: `${theme.dimensions.basePadding} !important`
		}
	}
})

export const artistListItem = style({
	display: 'flex',
	alignItems: 'center',
	width: '100%',
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	paddingTop: theme.dimensions.basePaddingMobile,
	paddingBottom: theme.dimensions.basePaddingMobile,
	height: '1.5em',
	borderBottom: '1px solid rgba(255,255,255,0.1)',
	'@media': {
		'screen and (--md)': {
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding,
			paddingTop: 0,
			paddingBottom: 0
		}
	}
})

export const artistTitle = style({
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	maxWidth: '80%',
	selectors: {
		'&.dead': {
			color: theme.color.dullText
		}
	}
})

export const artistGigCount = style({
	marginLeft: 'auto',
	color: theme.color.dullText
})
