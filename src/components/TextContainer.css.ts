import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { ImageWrapper } from './Image2.css'

export const textContainer = style({
		fontSize: `calc(${theme.font.baseSize} * 1.2)`,
		padding: theme.dimensions.basePadding,
		maxWidth: theme.dimensions.contentContainerWidth,
		margin: '0 auto'
})

globalStyle(`${textContainer} > *:not(blockquote), ${textContainer} > *:not(blockquote)`, {
	fontSize: 'inherit'
})

globalStyle(`${textContainer} > *:not(${ImageWrapper})`, {
	margin: '0 auto',
	padding: `calc(${theme.dimensions.basePadding} * 1.5)`,
	maxWidth: theme.dimensions.contentContainerWidth
})

globalStyle(`${textContainer} ${ImageWrapper}`, {
	margin: '0 auto'
})
