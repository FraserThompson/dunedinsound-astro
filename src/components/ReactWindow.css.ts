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
