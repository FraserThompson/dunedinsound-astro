import { style } from '@vanilla-extract/css'
import { theme } from '../../ThemeContract.css'

export const sideTextWrapper = style({
    height: '100%',
    minHeight: 0,
    paddingTop: theme.dimensions.basePaddingMobile,
    '@media': {
        'screen and (--md)': {
            paddingTop: theme.dimensions.basePadding,
            minHeight: '70vh'
        }
    }
})
