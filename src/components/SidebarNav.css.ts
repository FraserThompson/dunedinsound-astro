import { createVar, style, fallbackVar, styleVariants } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

const defaultWidth = '100vw'

export const offsetTop = createVar()
export const offsetTopMobile = createVar()

export const offsetBottom = createVar()
export const offsetBottomMobile = createVar()

export const sidebarWrapper = style({
	position: 'fixed',
	backgroundColor: theme.color.primary,
	boxSizing: 'border-box',
	top: fallbackVar(offsetTopMobile, '0px'),
	bottom: `calc(${fallbackVar(offsetBottomMobile, '0px')} + ${theme.dimensions.headerHeightMobile})`,
	height: `calc(100% - ${fallbackVar(offsetTopMobile, '0px')} - ${fallbackVar(offsetBottomMobile, '0px')} - ${
		theme.dimensions.headerHeightMobile
	})`,
	left: 0,
	width: defaultWidth,
	zIndex: '10',
	boxShadow: theme.borders.shadow,
	borderRight: theme.borders.primary,
	transform: `translateY(calc(100vh - ${fallbackVar(offsetTopMobile, '0px')} - ${
		theme.dimensions.headerHeightMobile
	}))`,
	transitionProperty: 'opacity, transform',
	transitionDuration: '0.2s',
	transitionTimingFunction: 'ease-in',
	willChange: 'transform',
	selectors: {
		'&.open': {
			visibility: 'visible',
			opacity: 1,
			transform: `translateY(0)`,
			pointerEvents: 'auto'
		}
	},
	'@media': {
		'screen and (--md)': {
			width: theme.dimensions.sidebarWidth,
			height: `calc(100% - ${fallbackVar(offsetTop, '0px')} - ${fallbackVar(offsetBottom, '0px')})`,
			visibility: 'visible',
			top: fallbackVar(offsetTop, '0px'),
			bottom: fallbackVar(offsetBottom, '0px'),
			left: theme.dimensions.headerHeight,
			opacity: 1,
			transform: `translateX(0)`,
			pointerEvents: 'auto'
		}
	}
})

export const sidebarMenuWrapper = style({
	overflowX: 'hidden',
	overflowY: 'scroll',
	scrollbarWidth: 'thin',
	scrollbarColor: 'gray black',
	height: `100%`,
	selectors: {
		'&.hasSubheaderBottomMobile': {
			height: `calc(100% - ${theme.dimensions.headerHeightMobile})`
		},
		'&.hasSubheaderTopMobile': {
			marginTop: theme.dimensions.subheaderHeight,
			height: `calc(100% - ${theme.dimensions.subheaderHeight})`
		},
		'&.hasSubheaderTopMobile.hasSubheaderBottomMobile': {
			height: `calc(100% - ${theme.dimensions.headerHeightMobile} -  ${theme.dimensions.subheaderHeight})`
		}
	},
	'@media': {
		'screen and (--md)': {
			selectors: {
				'&.hasSubheaderBottomMobile': {
					height: `100%`
				},
				'&.hasSubheaderTopMobile': {
					marginTop: 0,
					height: `100%`
				},
				'&.hasSubheaderTopMobile.hasSubheaderBottomMobile': {
					height: `100%`
				}
			}
		}
	}
})

export const contentWrapper = style({
	marginLeft: 0,
	boxSizing: 'border-box',
	'@media': {
		'screen and (--md)': {
			marginLeft: theme.dimensions.sidebarWidth
		}
	}
})

const sidebarButtonBase = style({
	selectors: {
		'&.open': {
			boxShadow: `inset 0px 0px 3px 2px ${theme.color.darkSecondary}`
		},
		'&::after': {
			height: '24px',
			content:
				"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24px' height='24px' class='up-icon'%3E%3Cpath fill='white' d='m6.293 13.293l1.414 1.414L12 10.414l4.293 4.293l1.414-1.414L12 7.586z'%3E%3C/path%3E%3C/svg%3E\")"
		},
		'&.open::after': {
			height: '24px',
			content:
				"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24px' height='24px' class='down-icon hidden'%3E%3Cpath fill='white' d='M16.293 9.293L12 13.586L7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z'%3E%3C/path%3E%3C/svg%3E\")"
		},
		'&:active, &:focus': {
			backgroundColor: theme.color.darkSecondary
		}
	},
	'@media': {
		'screen and (--md)': {
			selectors: {
				'&.open': {
					boxShadow: 'none'
				},
				'&::after': {
					content: ''
				},
				'&.open::after': {
					content: ''
				},
				'&:active, &:focus': {
					backgroundColor: theme.color.darkSecondary
				}
			}
		}
	}
})

export const sidebarButtonWrapper = styleVariants({
	base: [sidebarButtonBase],
	bar: [
		sidebarButtonBase,
		{
			fontSize: '1.5em',
			padding: 0,
			zIndex: '15',
			position: 'fixed',
			bottom: 0,
			height: theme.dimensions.subheaderHeight,
			display: 'flex',
			justifyContent: 'center',
			width: '100vw',
			backgroundColor: theme.color.secondary,
			border: 'none',
			color: 'white',
			'@media': {
				'screen and (--md)': {
					display: 'none'
				}
			}
		}
	]
})
