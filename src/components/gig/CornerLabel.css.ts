import { style, styleVariants, createVar, fallbackVar } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const backgroundColor = createVar()
export const topOffset = createVar()

const cornerLabelWrapperBase = style({
	position: 'absolute',
	backdropFilter: 'blur(5px)',
	fontSize: '14px',
	background: fallbackVar(backgroundColor, theme.color.lightText),
	color: theme.color.darkText,
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	top: fallbackVar(topOffset, `calc(${theme.dimensions.headerHeightMobile})`),
	boxShadow: theme.borders.shadowLight,
	width: 'fit-content',
	textAlign: 'center',
	zIndex: '8',
	height: 'auto',
	'@media': {
		'screen and (--md)': {
			top: fallbackVar(topOffset, `calc(${theme.dimensions.headerHeight})`),
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding,
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
