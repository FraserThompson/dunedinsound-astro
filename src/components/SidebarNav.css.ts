import { createVar, style, fallbackVar, styleVariants, globalStyle, keyframes } from '@vanilla-extract/css'
import { theme } from '../Theme.css'

const defaultWidth = '100vw'

export const leftOffset = createVar()

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
	height: `calc(100% - ${fallbackVar(offsetTopMobile, '0px')} - ${fallbackVar(offsetBottomMobile, '0px')} - ${theme.dimensions.headerHeightMobile
		})`,
	left: fallbackVar(leftOffset, '0px'),
	width: defaultWidth,
	zIndex: '10',
	boxShadow: theme.borders.shadow,
	borderRight: theme.borders.primary,
	transform: `translateY(calc(100vh - ${fallbackVar(offsetTopMobile, '0px')} - ${theme.dimensions.headerHeightMobile
		}))`,
	transition: 'transform 0.3s ease-in',
	willChange: 'transform',
	selectors: {
		'&.open': {
			visibility: 'visible',
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
			marginTop: theme.dimensions.headerHeightMobile,
			height: `calc(100% - ${theme.dimensions.headerHeightMobile})`
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

const fade = keyframes({
	to: { width: '32px', opacity: 0.5 }
})

const sidebarButtonBase = style({
	borderRadius: '10px 10px 0px 0px',
	boxSizing: 'border-box',
	selectors: {
		'&.open': {
			boxShadow: `inset 0px 0px 2px 2px ${theme.color.darkContrast3}`,
			borderColor: theme.color.darkContrast3,
			borderStyle: "solid",
			borderWidth: "2px 2px 0"
		},
		'&::after': {
			opacity: 0,
			position: 'absolute',
			top: '4px',
			animation: `${fade} 0.4s forwards`,
			borderRadius: '5px',
			height: '3px',
			width: '0px',
			backgroundColor: 'white',
			content: ''
		},
		'&:active, &:focus': {
			backgroundColor: theme.color.darkContrast3,
		},
		'&.open::after': {
			opacity: '0.8 !important'
		}
	},
	'@media': {
		'screen and (--md)': {
			borderRadius: '0px 10px 10px 0px',
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


globalStyle('.openWithSidebar', {
	'@media': {
		'screen and (--md)': {
			zIndex: 'auto'
		}
	}
})

// Open with sidebar at bottom (default)
globalStyle('.openWithSidebar.bottom', {
	bottom: '-100px !important',
	transition: 'bottom 0.5s ease-in-out',
})
globalStyle('.openedWithSidebar.bottom', {
	bottom: `${theme.dimensions.headerHeightMobile} !important`,
	'@media': {
		'screen and (--md)': {
			bottom: 'auto'
		}
	}
})

// Open with sidebar at top
globalStyle('.openWithSidebar.top', {
	top: '-100px !important',
	transition: 'top 0.5s ease-in-out',
	'@media': {
		'screen and (--md)': {
			zIndex: 'auto'
		}
	}
})
globalStyle('.openedWithSidebar.top', {
	top: `0px !important`,
	'@media': {
		'screen and (--md)': {
			top: 'auto'
		}
	}
})
