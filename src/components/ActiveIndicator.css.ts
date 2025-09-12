import { style } from "@vanilla-extract/css";
import { darken } from "polished";
import { theme } from "src/Theme.css";

const activeColor = "#23ae44ff";
const defunctColor = "#b41c1cff";

export const statusIcon = style({
	fontWeight: "bold",
	display: "block",
	opacity: 0.8,
	paddingRight: theme.dimensions.basePaddingMobile,
	paddingLeft: theme.dimensions.basePaddingMobile,
	zIndex: 3,
	'@media': {
		'screen and (--md)': {
			paddingRight: theme.dimensions.basePadding,
			paddingLeft: theme.dimensions.basePadding,
		}
	}
})

export const activeIcon = style({
	color: activeColor,
	backgroundColor: darken(0.2, activeColor),
})

export const defunctIcon = style({
	color: defunctColor,
	backgroundColor: darken(0.2, defunctColor),
})
