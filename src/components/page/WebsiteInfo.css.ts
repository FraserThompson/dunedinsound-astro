import { style, keyframes } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const infoHeader = style({
	backgroundColor: 'black',
	backgroundImage:
		'radial-gradient(white, rgba(255, 255, 255, 0.2) 2px, transparent 40px), radial-gradient(white, rgba(255, 255, 255, 0.15) 1px, transparent 30px), radial-gradient(white, rgba(255, 255, 255, 0.1) 2px, transparent 40px), radial-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1) 2px, transparent 30px)',
	backgroundSize: '550px 550px, 350px 350px, 250px 250px, 150px 150px',
	backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px'
})

export const infoContent = style({
	maxWidth: '740px',
	padding: theme.dimensions.basePaddingMobile,
	margin: '0 auto',
	'@media': {
		'screen and (--md)': {
			padding: theme.dimensions.basePadding
		}
	}
})

const fade = keyframes({
	to: { opacity: '1' }
})

export const infoTitle = style({
	margin: '0 auto',
	borderBottom: '5px solid',
	borderImageSlice: '1',
	borderImageSource: 'linear-gradient(to left, #743ad5, #d53a9d)',
	position: 'relative',
	selectors: {
		'&:after': {
			position: 'absolute',
			bottom: '-5px',
			left: '0',
			content: "''",
			width: '100%',
			opacity: '0',
			borderBottom: '5px solid',
			borderImageSlice: '1',
			borderImageSource: 'linear-gradient(to right, #00ccd5, #d53a9d)',
			animation: `2s ${fade} infinite`,
			animationDirection: 'alternate'
		}
	}
})
