import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const textContainer = style({
	fontSize: '16px',
	maxWidth: theme.dimensions.contentContainerWidth,
	margin: '0 auto',
	paddingTop: theme.dimensions.basePaddingMobile,
	selectors: {
		'&.light': {
			backgroundColor: "white",
			color: "black"
		}
	},
	'@media': {
		'screen and (--xs)': {
			paddingTop: theme.dimensions.basePadding,
		}
	}
})

globalStyle(`${textContainer} > *:not(blockquote):not(h1):not(h2)`, {
	fontSize: 'inherit'
})

globalStyle(`${textContainer} section > *:not(blockquote):not(h1):not(h2)`, {
	fontSize: 'inherit'
})

globalStyle(`${textContainer} > *:not(.lightboxImage):not(ul):not(ol):not(hr)`, {
	margin: '0 auto',
	padding: theme.dimensions.basePadding,
	maxWidth: theme.dimensions.contentContainerWidth
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
	color: 'white'
})

globalStyle(`${textContainer} .lightboxImage`, {
	margin: '0 auto'
})
