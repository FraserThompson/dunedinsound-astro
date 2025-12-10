import { globalStyle } from '@vanilla-extract/css'

globalStyle(`.grid-row`, {
	display: 'grid',
	'gridTemplateColumns': 'repeat(4, 1fr);'
})
