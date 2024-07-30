import { darken, lighten, invert } from 'polished'
import { createThemeContract, createGlobalTheme } from '@vanilla-extract/css'

export const theme = createThemeContract({
	color: {
		background: '',
		primary: '',
		foreground: '',
		secondary: '',
		contrast: '',
		contrast2: '',
		text: '',
		lightText: '',
		dullText: '',
		darkText: '',
		lightSecondary: '',
		lightContrast2: '',
		lightForeground: ''
	},
	font: {
		baseSize: '',
		baseLineHeight: '',
		family: '',
		bodyWeight: '',
		headerWeight: '',
		boldWeight: ''
	},
	borders: {
		primary: '',
		secondary: '',
		background: '',
		contrast: '',
		shadow: '',
		shadowLight: '',
		shadowTop: ''
	},
	breakpoints: {
		xs: '',
		md: '',
		lg: ''
	},
	dimensions: {
		basePadding: '',
		headerHeight: '',
		headerHeightMobile: '',
		headerHeightWithSubheader: '',
		headerHeightNeg: '',
		subheaderHeight: '',
		sidebarWidth: '',
		viewportHeight: '',
		footerHeight: '',
		contentContainerWidth: '',
		defaultBannerHeight: ''
	}
})

const headerHeight = '30px'
const headerHeightMobile = '40px'
const subheaderHeight = '30px'

const backgroundColor = '#08090C' // dark navy
const primaryColor = '#0F0E0E' // smoky black
const foregroundColor = '#3f92f7' // lightblue
const secondaryColor = '#00807F' // teal
const contrastColor = '#FAF9F9' // ice white
const contrastColor2 = '#96ff7d' // purple
const textColor = '#ccc'

createGlobalTheme(':root', theme, {
	color: {
		background: backgroundColor,
		primary: primaryColor,
		foreground: foregroundColor,
		secondary: secondaryColor,
		contrast: contrastColor,
		contrast2: contrastColor2,
		text: textColor,
		lightText: lighten(0.5, textColor),
		dullText: darken(0.2, textColor),
		darkText: invert(textColor),
		lightSecondary: lighten(0.5, secondaryColor),
		lightContrast2: lighten(0.2, contrastColor2),
		lightForeground: lighten(0.2, foregroundColor)
	},
	font: {
		baseSize: '16px',
		baseLineHeight: '1.61rem',
		family: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;',
		bodyWeight: '400',
		headerWeight: '700',
		boldWeight: '700'
	},
	breakpoints: {
		xs: '768px',
		md: '992px',
		lg: '1600px'
	},
	borders: {
		primary: `1px solid ${darken(0.025, primaryColor)}`,
		secondary: `1px solid ${secondaryColor}`,
		contrast: `1px solid ${contrastColor}`,
		background: `1px solid ${backgroundColor}`,
		shadow: '0 0px 10px black',
		shadowLight: '0 2px 12px rgba(0,0,0,0.4)',
		shadowTop: '0 -3px 8px rgba(0, 0, 0, 0.25)'
	},
	dimensions: {
		basePadding: '0.86558rem',
		headerHeight: headerHeight,
		headerHeightMobile: headerHeightMobile,
		headerHeightWithSubheader: `calc(${headerHeight} + ${subheaderHeight} + 1px)`,
		headerHeightNeg: `-${headerHeight}`,
		subheaderHeight,
		sidebarWidth: '320px',
		viewportHeight: `calc(100vh - ${headerHeight})`,
		footerHeight: '280px',
		contentContainerWidth: '740px',
		defaultBannerHeight: '60vh'
	}
})
