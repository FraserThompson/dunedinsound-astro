import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const contentByEntryTitle = style({
	marginLeft: 'auto',
	display: 'flex',
	gap: theme.dimensions.basePadding
})

export const socialLinksWrapper = style({
	position: 'absolute',
	left: '0px',
	top: theme.dimensions.headerHeightMobile,
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	borderBottomRightRadius: '6px',
	backgroundColor: 'white',
	boxShadow: theme.borders.shadowLight,
	'@media': {
		'screen and (--md)': {
			top: theme.dimensions.headerHeight,
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding
		}
	}
})
