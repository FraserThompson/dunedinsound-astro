import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const textContainer = style({
	fontSize: '18px',
	maxWidth: theme.dimensions.contentContainerWidth,
	margin: '0 auto',
	selectors: {
		'&.light': {
			backgroundColor: theme.color.contrast,
			color: "black"
		}
	}
})

globalStyle(`${textContainer} > *:not(blockquote):not(h1):not(h2), ${textContainer} section > *:not(blockquote):not(h1):not(h2)`, {
	fontSize: 'inherit'
})

globalStyle(`${textContainer} section`, {
	padding: `0 !important`,
})

globalStyle(`${textContainer} > *:not(.lightboxImage):not(ul):not(ol):not(hr):not(.noCenter), ${textContainer} section > *:not(.lightboxImage):not(ul):not(ol):not(hr):not(.noCenter)`, {
	margin: '0 auto',
	padding: theme.dimensions.basePadding,
	paddingTop: '8px',
	paddingBottom: '8px',
	maxWidth: `min(100vw, 740px)`
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

globalStyle(`${textContainer} a.active`, {
	color: theme.color.lightContrast3
})

globalStyle(`${textContainer} .lightboxImage`, {
	margin: '0 auto'
})
