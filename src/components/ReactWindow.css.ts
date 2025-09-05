import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const reactWindowWrapper = style({
    height: `calc(100vh - ${theme.dimensions.headerHeightMobile})`,
    '@media': {
        'screen and (--md)': {
            height: `calc(100vh - ${theme.dimensions.headerHeight})`,
        }
    }
})

export const filtersWrapper = style({
    display: "flex",
    marginLeft: "0",
    '@media': {
		'screen and (--md)': {
			marginLeft: "auto",
		}
	}
})