import { darken, lighten, invert } from 'polished'
import {
  createThemeContract,
  createGlobalTheme
} from '@vanilla-extract/css';

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
		lightContrast2: '',
		lightForeground: '',
  },
  font: {
		baseSize: '',
		baseLineHeight: '',
		family: '',
		bodyWeight: '',
		headerWeight: '',
		boldWeight: '',
  },
	borders: {
		primary: '',
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
		viewportHeight: '',
		footerHeight: '',
		contentContainerWidth: '',
		defaultBannerHeight: '',
	}
});

const headerHeight = '3.22rem'
const headerHeightMobile = '2.415rem'
const subheaderHeight = '30px'

const foregroundColor = '#3f92f7'
const primaryColor = '#0F0E0E'
const contrastColor2 = '#96ff7d'
const textColor = '#ccc'

createGlobalTheme(':root', theme, {
  color: {
		background: '#08090C', // dark navy
		primary: primaryColor, // smoky black
		foreground: '#3f92f7', // lightblue
		secondary: '#367e80', // teal
		contrast: '#FAF9F9', // ice white
		contrast2: contrastColor2, // purple
		text: textColor,
		lightText: lighten(0.5, textColor),
		darkText: invert(textColor),
		lightContrast2: lighten(0.2, contrastColor2),
		lightForeground: lighten(0.2, foregroundColor),
  },
  font: {
		baseSize: '16px',
		baseLineHeight: '1.61rem',
		family: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;',
		bodyWeight: '400',
		headerWeight: '700',
		boldWeight: '700',
  },
	breakpoints: {
		xs: '768px',
		md: '992px',
		lg: '1600px'
	},
	borders: {
		primary: `1px solid ${darken(0.025, primaryColor)}`,
	},
	dimensions: {
		basePadding: '0.86558rem',
		headerHeight,
		headerHeightMobile,
		headerHeightMobileTwice: `calc(${headerHeightMobile} + ${headerHeightMobile})`,
		headerHeightMobileWithSubheader: `calc(${headerHeightMobile}  + ${subheaderHeight} + 1px)`,
		headerHeightWithSubheader: `calc(${headerHeight} + ${subheaderHeight} + 1px)`,
		headerHeightNeg: `-${headerHeight}`,
		subheaderHeight,
		viewportHeight: `calc(100vh - ${headerHeight})`,
		footerHeight: '280px',
		contentContainerWidth: '740px',
		defaultBannerHeight: '70vh',
	}
});
