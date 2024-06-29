import { createVar, style } from '@vanilla-extract/css'

export const columns = createVar()

export const container = style({
  columnGap: 0,
  backgroundColor: "black",
  columns: "1 200px",
	'@media': {
		'screen and (--xs)': {
			columns
		},
	}
})
