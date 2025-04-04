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
		contrast3: '',
		text: '',
		lightText: '',
		dullText: '',
		darkText: '',
		lightPrimary: '',
		lightSecondary: '',
		darkSecondary: '',
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
		contrast2: '',
		groove: '',
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
		basePaddingMobile: '',
		headerHeight: '',
		headerHeightMobile: '',
		headerHeightWithSubheader: '',
		headerHeightMobileWithSubheader: '',
		headerHeightNegative: '',
		headerHeightMobileNegative: '',
		subheaderHeight: '',
		subheaderHeightNegative: '',
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
const basePadding = '0.86558rem'

const backgroundColor = '#08090C' // dark navy
const primaryColor = '#0F0E0E' // smoky black
const foregroundColor = '#3f92f7' // lightblue
const secondaryColor = '#049f9d' // teal
const contrastColor = '#FAF9F9' // ice white
const contrastColor2 = '#96ff7d' // lime green
const contrastColor3 = '#4b004d' // purple
const textColor = '#ccc'

createGlobalTheme(':root', theme, {
	color: {
		background: backgroundColor,
		primary: primaryColor,
		foreground: foregroundColor,
		secondary: secondaryColor,
		contrast: contrastColor,
		contrast2: contrastColor2,
		contrast3: contrastColor3,
		text: textColor,
		lightText: lighten(0.5, textColor),
		dullText: darken(0.2, textColor),
		darkText: invert(textColor),
		lightPrimary: lighten(0.2, primaryColor),
		lightSecondary: lighten(0.5, secondaryColor),
		darkSecondary: darken(0.2, secondaryColor),
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
		contrast: `2px solid ${contrastColor}`,
		contrast2: `1px solid ${contrastColor2}`,
		background: `1px solid ${backgroundColor}`,
		groove: '3px groove #585662',
		shadow: '0 2px 12px black',
		shadowLight: '0 2px 12px rgba(0,0,0,0.4)',
		shadowTop: '0 -3px 12px black'
	},
	dimensions: {
		basePadding: basePadding,
		basePaddingMobile: `calc(${basePadding} / 2)`,
		headerHeight: headerHeight,
		headerHeightMobile: headerHeightMobile,
		headerHeightNegative: `-${headerHeight}`,
		headerHeightMobileNegative: `-${headerHeightMobile}`,
		headerHeightWithSubheader: `calc(${headerHeight} + ${subheaderHeight})`,
		headerHeightMobileWithSubheader: `calc(${headerHeightMobile} + ${subheaderHeight})`,
		subheaderHeight: subheaderHeight,
		subheaderHeightNegative: `-${subheaderHeight}`,
		sidebarWidth: '320px',
		viewportHeight: `calc(100% - ${headerHeight})`,
		footerHeight: '280px',
		contentContainerWidth: '740px',
		defaultBannerHeight: '60vh'
	}
})
