import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const cornerLabelWrapperBase = style({
	position: 'absolute',
	fontWeight: 'bold',
	backgroundColor: 'white',
	color: 'black',
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	top: `calc(${theme.dimensions.headerHeightMobile} + 1px)`,
	boxShadow: theme.borders.shadowLight,
	width: 'fit-content',
	textAlign: 'center',
	zIndex: '8',
	height: 'auto',
	'@media': {
		'screen and (--md)': {
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding,
			top: `calc(${theme.dimensions.headerHeight} + 1px)`
		}
	}
})

export const cornerLabelWrapper = styleVariants({
	left: [
		cornerLabelWrapperBase,
		{
			borderBottomRightRadius: '6px',
			left: '0px'
		}
	],
	right: [
		cornerLabelWrapperBase,
		{
			borderBottomLeftRadius: '6px',

			right: '0px'
		}
	]
})
