import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const textContainer = style({
	fontSize: '18px',
	maxWidth: theme.dimensions.contentContainerWidth,
	margin: '0 auto',
	paddingTop: theme.dimensions.basePaddingMobile,
	'@media': {
		'screen and (--xs)': {
			paddingTop: theme.dimensions.basePadding,
			fontSize: '21px'
		}
	}
})

globalStyle(`${textContainer} > *:not(blockquote):not(h1):not(h2)`, {
	fontSize: 'inherit'
})

globalStyle(`${textContainer} section > *:not(blockquote):not(h1):not(h2)`, {
	fontSize: 'inherit'
})

globalStyle(`${textContainer} > *:not(.lightboxImage):not(ul):not(ol)`, {
	margin: '0 auto',
	padding: theme.dimensions.basePadding,
	maxWidth: theme.dimensions.contentContainerWidth
})

globalStyle(`${textContainer} > ul`, {
	paddingRight: theme.dimensions.basePadding
})

globalStyle(`${textContainer} a.active`, {
	color: theme.color.foreground
})

globalStyle(`${textContainer} .lightboxImage`, {
	margin: '0 auto'
})
