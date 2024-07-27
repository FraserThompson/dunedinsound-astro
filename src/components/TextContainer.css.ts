import { globalStyle, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'
import { ImageWrapper } from './Image2.css'

export const textContainer = styleVariants({
	normal: {
		fontSize: `calc(${theme.font.baseSize} * 1.2)`,
		padding: theme.dimensions.basePadding,
		maxWidth: theme.dimensions.contentContainerWidth,
		margin: '0 auto'
	},
	feature: {
		fontSize: `calc(${theme.font.baseSize} * 1.4)`,
		margin: '0 auto'
	}
})

globalStyle(`${textContainer['normal']} > *:not(blockquote), ${textContainer['feature']} > *:not(blockquote)`, {
	fontSize: 'inherit',
	paddingBottom: theme.dimensions.basePadding
})

globalStyle(`${textContainer['feature']} > *:not(${ImageWrapper})`, {
	margin: '0 auto',
	padding: `calc(${theme.dimensions.basePadding} * 1.5)`,
	maxWidth: theme.dimensions.contentContainerWidth
})

globalStyle(`${textContainer['feature']} ${ImageWrapper}`, {
	margin: '0 auto',
})

globalStyle(`${textContainer['normal']} ul, ${textContainer['feature']} ul`, {
	paddingLeft: '100px !important'
})
