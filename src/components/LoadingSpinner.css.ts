import { style, globalStyle, keyframes } from '@vanilla-extract/css'

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

export const LoadingSpinnerWrapper = style({
})

globalStyle(`${LoadingSpinnerWrapper} .lds-ring`, {
	display: 'inline-block',
	position: 'relative',
	width: '80px',
	height: '80px',
})
globalStyle(`${LoadingSpinnerWrapper} .lds-ring div`, {
	boxSizing: 'border-box',
	display: 'block',
	position: 'absolute',
	width: '64px',
	height: '64px',
	margin: '8px',
	border: '8px solid #fff',
	borderRadius: "50%",
	animation: `${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
	borderColor: '#fff transparent transparent transparent'
})
globalStyle(`${LoadingSpinnerWrapper} .lds-ring div:nth-of-type(1)`, {
	animationDelay: "-0.45s"
})
globalStyle(`${LoadingSpinnerWrapper} .lds-ring div:nth-of-type(2)`, {
	animationDelay: "-0.3s"
})
globalStyle(`${LoadingSpinnerWrapper} .lds-ring div:nth-of-type(3)`, {
	animationDelay: "-0.15s"
})
