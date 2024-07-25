import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const siteContainerBase = style({
	minHeight: theme.dimensions.viewportHeight,
	backgroundColor: theme.color.background,
	boxShadow: theme.borders.shadow,
	height: '100%',
	width: '100%',
	zIndex: '2',
	position: 'relative',
	bottom: '0'
})

export const siteContainer = styleVariants({
	normal: [
		siteContainerBase,
		{
			marginBottom: theme.dimensions.footerHeight,
			'@media': {
				'screen and (--md)': {
					marginBottom: theme.dimensions.footerHeight
				}
			}
		}
	],
	hideFooter: [siteContainerBase]
})
