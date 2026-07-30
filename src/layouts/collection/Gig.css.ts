import { style } from '@vanilla-extract/css'
import { theme } from '../../Theme.css'
import { WinampBackground } from '@src/components/player/PlayerTracklist.css'

export const GigBannerPlayer = style({
	padding: '0px',
	zIndex: 1,
	width: '100%',
	boxSizing: 'border-box',
	marginTop: 'auto',
	'@media': {
		'screen and (--md)': {
			padding: theme.dimensions.basePadding,
		}
	}
})

export const LibraryLoadingPlaceholder = style([WinampBackground, {
	position: 'relative',
	width: '100%',
	maxWidth: '600px',
	minHeight: '212px',
}])

export const GigFeatureVid = style({
	height: 'auto',
	width: '100%',
	aspectRatio: '16/9',
	padding: 0,
	paddingTop: "25px",
	'@media': {
		'screen and (--md)': {
			padding: theme.dimensions.basePadding,
			height: '100%',
			margin: '0 auto',
			width: 'auto'
		}
	}
})
