import { style } from "@vanilla-extract/css";
import { theme } from "src/Theme.css";

export const activeIcon = style({
	color: "#54a868",
	fontSize: theme.font.baseSize
})

export const defunctIcon = style({
	color: "#a63d3d",
	fontSize: theme.font.baseSize
})
