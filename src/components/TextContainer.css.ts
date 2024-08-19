import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const textContainer = style({
		fontSize: `calc(${theme.font.baseSize} * 1.2)`,
		maxWidth: theme.dimensions.contentContainerWidth,
		margin: '0 auto'
})

globalStyle(`${textContainer} > *:not(blockquote), ${textContainer} > *:not(blockquote)`, {
	fontSize: 'inherit'
})

globalStyle(`${textContainer} > *:not(.blogImage):not(ul)`, {
	margin: '0 auto',
	padding: theme.dimensions.basePadding,
	maxWidth: theme.dimensions.contentContainerWidth,
})


globalStyle(`${textContainer} > ul`, {
	paddingRight: theme.dimensions.basePadding,
})

globalStyle(`${textContainer} .blogImage`, {
	margin: '0 auto'
})
