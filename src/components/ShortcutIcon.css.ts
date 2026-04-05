import { globalStyle, style } from '@vanilla-extract/css'

export const shortcutIconWrapper = style({
	position: "relative",
	width: "100px",
	color: "black",
	display: "flex",
	alignItems: "center",
	flexDirection: "column",
	borderRadius: "3px",
	padding: "3px",
	selectors: {
		'&:hover': {
			background: "rgba(255,255,255,0.3)",
		}
	}
})

globalStyle(`${shortcutIconWrapper} > .musicIcon`, {
	color: "#ebb318",
	zIndex: 1,
	width: "5em",
	height: "5em"
})

globalStyle(`${shortcutIconWrapper} > .shortcutIcon`, {
	zIndex: 1,
	position: "absolute",
	left: "0px",
	bottom: "20px",
	color: "black",
	background: "white",
	borderRadius: "5px",
	border: "1px solid black"
})

globalStyle(`${shortcutIconWrapper} > .musicIcon`, {
	color: "#ebb318",
	zIndex: 1
})

globalStyle(`${shortcutIconWrapper} > .square`, {
	width: "50px",
	position: "absolute",
	height: "50px",
	top: "15px",
	background: "white",
	transform: "rotate(45deg)",
	border: "3px solid black",
	borderRadius: "5px",
	zIndex: 0
})

globalStyle(`${shortcutIconWrapper} > .text`, {
	color: "white",
	fontSize: "12px",
	textAlign: "center",
	zIndex: 1,
	textShadow: "1px 1px black"
})
