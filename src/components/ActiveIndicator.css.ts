import { style } from "@vanilla-extract/css";
import { darken, lighten } from "polished";
import { theme } from "src/Theme.css";

const activeColor = "#54a868";
const defunctColor = "#a63d3d";

export const activeIcon = style({
	backgroundColor: activeColor,
	fontWeight: "bold",
	padding: "3px",
	borderRadius: '3px',
	border: `2px solid ${darken(0.3, activeColor)}`,
	color: darken(0.3, activeColor)
})

export const defunctIcon = style({
	backgroundColor: defunctColor,
	fontWeight: "bold",
	padding: "3px",
	borderRadius: '3px',
	border: `2px solid ${darken(0.3, defunctColor)}`,
	color: darken(0.3, defunctColor)
})
