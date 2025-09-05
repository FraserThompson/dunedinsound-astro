import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const sideTextWrapper = style({
    height: '100%',
    minHeight: 0,
    '@media': {
        'screen and (--md)': {
            minHeight: '70vh'
        }
    }
})