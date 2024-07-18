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
		contrast: ''
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
		headerHeightMobileTwice: '',
		headerHeightMobileWithSubheader: '',
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

const headerHeight = '40px'
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
		contrast: `1px solid ${contrastColor}`
	},
	dimensions: {
		basePadding: '0.86558rem',
		headerHeight: headerHeight,
		headerHeightMobile: headerHeightMobile,
		headerHeightMobileTwice: `calc(${headerHeightMobile} + ${headerHeightMobile})`,
		headerHeightMobileWithSubheader: `calc(${headerHeightMobile} + ${subheaderHeight} + 1px)`,
		headerHeightWithSubheader: `calc(${headerHeight} + ${subheaderHeight} + 1px)`,
		headerHeightNeg: `-${headerHeight}`,
		subheaderHeight,
		sidebarWidth: '300px',
		viewportHeight: `calc(100vh - ${headerHeight})`,
		footerHeight: '280px',
		contentContainerWidth: '740px',
		defaultBannerHeight: '70vh'
	}
})
