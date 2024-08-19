import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const LightboxHeader = style({
	position: 'fixed',
	zIndex: 4,
	top: '60px',
	'@media': {
		'screen and (--xs)': {
			top: 0
		}
	}
})

export const LightboxFooter = style({
	position: 'fixed',
	zIndex: 4,
	bottom: '0px',
	padding: theme.dimensions.basePadding
})

// Override global button styling
globalStyle('.yarl__button:hover', {
	backgroundColor: 'transparent'
})
