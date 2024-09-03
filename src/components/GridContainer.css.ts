import { styleVariants } from '@vanilla-extract/css'

export const gridWrapper = styleVariants({
	autoflow: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
		gridAutoFlow: 'dense',
		'@media': {
			'screen and (--xs)': {
				gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
			}
		}
	},
	fixed: {
		display: 'grid',
		gridTemplateColumns: 'repeat(12, [col-start] 1fr)',
		gridAutoFlow: 'dense'
	}
})
