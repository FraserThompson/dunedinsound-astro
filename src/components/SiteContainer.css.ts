import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const siteContainerBase = style({
	minHeight: theme.dimensions.viewportHeight,
	backgroundColor: theme.color.background,
	boxShadow: '0 6px 12px rgba(0, 0, 0, 0.8)',
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
