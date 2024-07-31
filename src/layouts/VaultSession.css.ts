import { style } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const ArtistMetadata = style({
	padding: theme.dimensions.basePadding,
	transitionProperty: 'z-index, transform, box-shadow',
	transitionDuration: '0.2s',
	transitionTimingFunction: 'ease-in-out',
	position: 'absolute',
	right: '0',
	zIndex: '3',
	transformOrigin: 'right center',
	fontFamily: 'monospace',
	selectors: {
		'&:hover': {
			zIndex: '10',
			boxShadow: '0 0 30px purple',
			transform: 'rotateY(80deg)',
			background: 'rgba(0, 0, 0, 1)'
		}
	}
})

export const VaultTracklist = style({
	padding: theme.dimensions.basePadding,
	transitionProperty: 'z-index, transform, box-shadow',
	transitionDuration: '0.2s',
	transitionTimingFunction: 'ease-in-out',
	position: 'absolute',
	left: '0',
	zIndex: '3',
	background: 'rgba(0, 0, 0, 0)',
	transformOrigin: 'left center',
	fontFamily: 'monospace',
	selectors: {
		'&:hover': {
			zIndex: '13',
			boxShadow: '0 0 30px purple',
			transform: 'rotateY(-80deg)',
			background: 'rgba(0, 0, 0, 1)'
		}
	}
})

export const VaultTrackLink = style({
	fontFamily: 'monospace',
	cursor: 'pointer',
	selectors: {
		'&.active': {
			fontWeight: 'bold',
			color: theme.color.contrast
		}
	}
})
