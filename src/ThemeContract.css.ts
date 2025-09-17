import { createGlobalThemeContract } from '@vanilla-extract/css'

export const theme = createGlobalThemeContract({
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
		dullDarkText: '',
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
