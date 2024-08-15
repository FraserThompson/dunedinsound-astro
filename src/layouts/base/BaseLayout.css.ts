import { globalStyle } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

/**
 * Base element style defaults.
 */
globalStyle('html', {
	fontFamily: 'sans-serif',
	overflowY: 'auto'
})

globalStyle('body', {
	color: theme.color.text,
	fontFamily: theme.font.family,
	fontWeight: theme.font.bodyWeight,
	wordWrap: 'break-word',
	fontKerning: 'normal',
	fontFeatureSettings: '"kern", "liga", "clig", "calt"',
	margin: '0',
	backgroundColor: theme.color.background,
	maxWidth: '100vw',
	height: '100%',
	width: '100%'
})

globalStyle('h1, h2, h3, h4, h5, h6', {
	marginLeft: '0',
	marginRight: '0',
	marginTop: '0',
	paddingBottom: '0',
	paddingLeft: '0',
	paddingRight: '0',
	paddingTop: '0',
	marginBottom: theme.font.baseLineHeight,
	color: 'inherit',
	fontFamily: theme.font.family,
	fontWeight: theme.font.headerWeight,
	textRendering: 'optimizeLegibility'
})

globalStyle('p, span', {
	fontSize: theme.font.baseSize
})

globalStyle('h1, h2, h3, h4, h5', {
	textShadow: '0px 0px 3px rgba(0, 0, 0, 1)'
})

globalStyle('h1', {
	fontSize: `calc(${theme.font.baseSize} * 2)`,
	lineHeight: '1.1'
})

globalStyle('h2', {
	fontSize: `calc(${theme.font.baseSize} * 1.6)`,
	lineHeight: '1.1'
})

globalStyle('h3', {
	fontSize: `calc(${theme.font.baseSize} * 1.2)`,
	lineHeight: '1.1'
})

globalStyle('h4', {
	fontSize: `calc(${theme.font.baseSize} * 1)`,
	fontWeight: '600',
	color: theme.color.dullText,
	lineHeight: '1.1'
})

globalStyle('h5', {
	fontSize: `calc(${theme.font.baseSize} * 1)`,
	fontWeight: '200',
	lineHeight: '1.1'
})

globalStyle('h6', {
	fontSize: `calc(${theme.font.baseSize} * 0.8)`,
	lineHeight: '1.1'
})

globalStyle('blockquote', {
	fontSize: `calc(${theme.font.baseSize} * 1.6)`,
	backgroundColor: 'black',
	fontStyle: 'italic',
	lineHeight: '1.1'
})

globalStyle('blockquote > p', {
	fontSize: `inherit`,
	fontStyle: 'italic',
	lineHeight: '1.1'
})

globalStyle('button', {
	boxSizing: 'border-box',
	display: 'inline-block',
	marginBottom: '0',
	textAlign: 'center',
	verticalAlign: 'middle',
	touchAction: 'manipulation',
	cursor: 'pointer',
	whiteSpace: 'nowrap',
	height: `calc(${theme.dimensions.subheaderHeight} - 2px)`,
	paddingTop: '0px',
	paddingBottom: '0px',
	paddingRight: theme.dimensions.basePadding,
	paddingLeft: theme.dimensions.basePadding,
	color: theme.color.lightText,
	backgroundColor: theme.color.primary
})

globalStyle('button:hover', {
	backgroundColor: theme.color.lightPrimary
})

globalStyle('button.active,button:active', {
	color: theme.color.lightText,
	cursor: 'default',
	borderStyle: 'inset',
	backgroundColor: theme.color.secondary
})

globalStyle('a', {
	color: theme.color.contrast2,
	transition: 'color 0.1s ease-in-out',
	textDecoration: 'none',
	overflow: 'hidden',
	backgroundColor: 'transparent'
})

globalStyle('a:hover', {
	color: theme.color.lightSecondary
})

globalStyle('input[type="text"]', {
	backgroundImage: 'none',
	border: '1px solid #000',
	minWidth: '0px',
	maxWidth: '100%',
	paddingLeft: theme.dimensions.basePaddingMobile,
	paddingRight: theme.dimensions.basePaddingMobile,
	width: '100%',
	boxSizing: 'border-box',
	height: `calc(${theme.dimensions.headerHeightMobile} - 2px)`,
	boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
	transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
	'@media': {
		'screen and (--lg)': {
			maxWidth: `calc(${theme.dimensions.sidebarWidth} - ${theme.dimensions.basePadding} - ${theme.dimensions.basePadding})`,
			paddingLeft: theme.dimensions.basePadding,
			paddingRight: theme.dimensions.basePadding
		},
		'screen and (--xs)': {
			height: `calc(${theme.dimensions.headerHeight} - 2px)`
		}
	}
})

globalStyle('select', {
	backgroundImage: 'none',
	padding: '4px 6px',
	border: '1px solid #000',
	minWidth: '0px',
	maxWidth: '100%',
	width: '100%',
	boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
	transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
	'@media': {
		'screen and (--md)': {
			width: 'auto'
		}
	}
})

globalStyle('input[type="text"]:focus', {
	border: theme.borders.secondary,
	boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)',
	outline: 0
})

globalStyle('table', {
	marginLeft: '0',
	marginRight: '0',
	marginTop: '0',
	padding: '0',
	marginBottom: '1.61rem',
	fontSize: '1rem',
	lineHeight: '1.61rem',
	borderCollapse: 'collapse',
	width: '100%'
})

globalStyle('table td, table th', {
	textAlign: 'left',
	borderBottom: '1px solid hsla(0, 0%, 0%, 0.12)',
	fontFeatureSettings: "'tnum'",
	paddingTop: '1rem',
	paddingBottom: 'calc(1rem - 1px)'
})

/**
 * Utility classes
 */
globalStyle('.hidden', {
	display: 'none !important'
})

globalStyle('.showMobile', {
	display: 'inline-block !important',
	'@media': {
		'screen and (--md)': {
			display: 'none !important'
		}
	}
})

globalStyle('.showMobile.flex', {
	display: 'flex !important',
	'@media': {
		'screen and (--md)': {
			display: 'none !important'
		}
	}
})

globalStyle('.hideMobile', {
	display: 'none !important',
	'@media': {
		'screen and (--md)': {
			display: 'inline-block !important'
		}
	}
})

globalStyle('.hideMobile.flex', {
	display: 'none !important',
	'@media': {
		'screen and (--md)': {
			display: 'flex !important'
		}
	}
})

globalStyle('.flex', {
	display: 'flex'
})

globalStyle('.visible', {
	display: 'inline-block'
})

globalStyle('.hidden', {
	display: 'none'
})

globalStyle('.center', {
	textAlign: 'center'
})

globalStyle('.monospace', {
	fontFamily: 'monospace'
})

globalStyle('.fullWidth', {
	width: '100%'
})

globalStyle('.padding', {
	padding: theme.dimensions.basePadding
})

globalStyle('.noPadding', {
	padding: '0 !important',
	minWidth: '0 !important',
	minHeight: '0 !important'
})

globalStyle('.headerButton', {
	width: '30px !important',
	height: '30px !important'
})

globalStyle('.left0', {
	left: 0,
	marginLeft: 0
})
