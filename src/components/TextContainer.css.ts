import { createVar, fallbackVar, globalStyle, style } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

export const fontSize = createVar()
export const containerWidth = createVar()

export const textContainer = style({
	fontSize: fallbackVar(fontSize, '18px'),
	maxWidth: fallbackVar(containerWidth, theme.dimensions.contentContainerWidth),
	margin: '0 auto',
	lineHeight: '1.8rem',
	selectors: {
		'&.light': {
			backgroundColor: "white",
			color: "black"
		}
	}
})

globalStyle(`${textContainer} > *:not(blockquote):not(h1):not(h2), ${textContainer} section > *:not(blockquote):not(h1):not(h2)`, {
	fontSize: 'inherit',
	lineHeight: 'inherit'
})

globalStyle(`${textContainer} section`, {
	padding: `0 !important`,
})

globalStyle(`${textContainer} > *:not(.lightboxImage):not(ul):not(ol):not(hr):not(.noCenter), ${textContainer} section > *:not(.lightboxImage):not(ul):not(ol):not(hr):not(.noCenter)`, {
	margin: '0 auto',
	padding: theme.dimensions.basePadding,
	paddingTop: '12px',
	paddingBottom: '12px',
	maxWidth: fallbackVar(containerWidth, theme.dimensions.contentContainerWidth),
})

globalStyle(`${textContainer} > iframe`, {
	padding: `0 !important`,
})

globalStyle(`${textContainer} > ul`, {
	paddingRight: theme.dimensions.basePadding
})

globalStyle(`${textContainer}.light a`, {
	color: theme.color.darkContrast2
})

globalStyle(`${textContainer}.light a:hover`, {
	color: theme.color.contrast2
})

// Shadows look bad on white background
globalStyle(`${textContainer}.light h2, ${textContainer}.light h3, ${textContainer}.light h4, ${textContainer}.light h5, ${textContainer}.light a`, {
	textShadow: 'none'
})

globalStyle(`${textContainer} a.active`, {
	color: theme.color.lightContrast3
})

globalStyle(`${textContainer} .lightboxImage`, {
	margin: '0 auto'
})
