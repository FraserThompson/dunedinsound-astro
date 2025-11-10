import { style, keyframes } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'

const twinkle = keyframes({
	to: { 	backgroundImage:
		'radial-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.19) 2px, transparent 38px), radial-gradient(white, rgba(255, 255, 255, 0.16) 1px, transparent 30px), radial-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.19) 2px, transparent 40px), radial-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2) 2px, transparent 28px)', }
})

export const infoHeader = style({
	backgroundColor: 'black',
	backgroundImage:
		'radial-gradient(white, rgba(255, 255, 255, 0.2) 2px, transparent 40px), radial-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.15) 1px, transparent 28px), radial-gradient(rgba(255, 255, 255, 0.69), rgba(255, 255, 255, 0.2) 2px, transparent 38px), radial-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.19) 2px, transparent 30px)',
	backgroundSize: '550px 550px, 350px 350px, 250px 250px, 150px 150px',
	backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px',
	animation: `0.8s ease-in-out 0.5s ${twinkle} infinite`
})

export const infoContent = style({
	maxWidth: '740px',
	padding: theme.dimensions.basePadding,
	margin: '0 auto'
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
