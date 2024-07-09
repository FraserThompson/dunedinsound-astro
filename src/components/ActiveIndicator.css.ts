import { style } from "@vanilla-extract/css";
import { theme } from "src/Theme.css";

export const activeIcon = style({
	color: "#31a24c",
	fontSize: theme.font.baseSize
})

export const defunctIcon = style({
	color: "#ab0000",
	fontSize: theme.font.baseSize
})
