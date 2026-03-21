import { style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'

export const fileButton = style({
	color: theme.color.text,
	height: "24px",
})

export const gigMetaWrapper = style({
	display: 'none',
	padding: "3px",
	borderRadius: "5px",
	border: "1px solid white",
	boxShadow: theme.borders.shadow,
	selectors: {
		'&:not([data-artist=""])': {
			display: 'block'
		},
	}
})
