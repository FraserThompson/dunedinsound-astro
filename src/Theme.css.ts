import { darken, lighten, invert, transparentize } from 'polished'
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
		darkContrast2: '',
		lightContrast3: '',
		darkContrast3: '',
		lightForeground: '',
		transparentForeground: ''
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

const backgroundColor = 'rgb(8, 9, 12)'
const primaryColor = 'rgb(15, 14, 14)'
const foregroundColor = 'rgb(0, 77, 68)'
const secondaryColor = 'rgb(27, 69, 120)'
const contrastColor = 'rgb(250, 249, 249)'
const contrastColor2 = 'rgb(150, 255, 125)'
const contrastColor3 = 'rgb(130, 9, 51)'
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
		dullText: darken(0.1, textColor),
		darkText: invert(textColor),
		lightPrimary: lighten(0.2, primaryColor),
		lightSecondary: lighten(0.6, secondaryColor),
		darkSecondary: darken(0.2, secondaryColor),
		lightContrast2: lighten(0.2, contrastColor2),
		darkContrast2: darken(0.5, contrastColor2),
		lightContrast3: lighten(0.2, contrastColor3),
		darkContrast3: darken(0.5, contrastColor3),
		lightForeground: lighten(0.4, foregroundColor),
		transparentForeground: transparentize(0.4, foregroundColor)
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
