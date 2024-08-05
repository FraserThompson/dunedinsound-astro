import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const SubheaderBase = style({
	zIndex: '6',
	position: 'fixed',
	width: '100%',
	borderBottom: '1px solid black',
	boxShadow: theme.borders.shadowLight,
	backgroundColor: theme.color.primary,
	'@media': {
		'screen and (--md)': {
			width: `calc(100% - ${theme.dimensions.headerHeight})`
		}
	}
})

export const Subheader = styleVariants({
	top: [
		SubheaderBase,
		{
			top: 0
		}
	],
	bottom: [
		SubheaderBase,
		{
			bottom: theme.dimensions.headerHeight
		}
	],
	sidebarTopAndBottom: [
		SubheaderBase,
		{
			top: 'auto',
			bottom: theme.dimensions.headerHeightNegative,
			'@media': {
				'screen and (--md)': {
					top: theme.dimensions.headerHeightNegative,
					bottom: 'auto'
				}
			}
		}
	]
})

const ContentBase = style({
	boxSizing: 'border-box',
	position: 'relative',
	height: '100%',
	boxShadow: theme.borders.shadow,
	marginLeft: 0,
	'@media': {
		'screen and (--md)': {
			marginLeft: theme.dimensions.headerHeight
		}
	}
})

export const Content = styleVariants({
	default: [ContentBase],
	topSubheaderMobile: [
		ContentBase,
		{
			marginTop: theme.dimensions.subheaderHeight,
			'@media': {
				'screen and (--md)': {
					marginTop: '0px'
				}
			}
		}
	]
})
