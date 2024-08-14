import { styleVariants } from '@vanilla-extract/css'

export const gridWrapper = styleVariants({
	autoflow: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
		gridAutoFlow: 'dense'
	},
	fixed: {
		display: 'grid',
		gridTemplateColumns: 'repeat(12, [col-start] 1fr)',
		gridAutoFlow: 'dense'
	}
})
