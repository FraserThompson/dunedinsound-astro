import { globalStyle } from '@vanilla-extract/css'
import { math, cssVar } from 'polished'
import { theme } from 'src/Theme.css'

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

globalStyle('h1, h2', {
	textShadow: '-1px -1px 0 rgba(0, 0, 0, 0.3)'
})

globalStyle('h1', {
	fontSize: `calc(${theme.font.baseLineHeight} * 1.1)`,
	lineHeight: '1.1'
})

globalStyle('h2', {
	fontSize: `calc(${theme.font.baseLineHeight} * 1)`,
	lineHeight: '1.1'
})

globalStyle('h3', {
	fontSize: `calc(${theme.font.baseLineHeight} * 1)`,
	lineHeight: '1.1'
})

globalStyle('h4', {
	fontSize: `calc(${theme.font.baseLineHeight} * 1)`,
	fontWeight: '200',
	lineHeight: '1.1'
})

globalStyle('h5', {
	fontSize: `calc(${theme.font.baseLineHeight} * 1)`,
	lineHeight: '1.1'
})

globalStyle('h6', {
	fontSize: `calc(${theme.font.baseLineHeight} * 1)`,
	lineHeight: '1.1'
})

globalStyle('button, .button', {
	display: 'inline-block',
	marginBottom: '0',
	textAlign: 'center',
	verticalAlign: 'middle',
	touchAction: 'manipulation',
	cursor: 'pointer',
	whiteSpace: 'nowrap',
	paddingTop: '0px',
	paddingBottom: '0px',
	paddingRight: theme.dimensions.basePadding,
	paddingLeft: theme.dimensions.basePadding,
	color: theme.color.text,
	backgroundColor: 'transparent'
})

globalStyle('a', {
	color: theme.color.contrast2,
	transition: 'color 0.1s ease-in-out',
	textDecoration: 'none',
	overflow: 'hidden',
	backgroundColor: 'transparent'
})

globalStyle('a:hover', {
	color: theme.color.lightContrast2
})
