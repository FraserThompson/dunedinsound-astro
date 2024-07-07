import { stripUnit } from 'polished'
import { theme } from 'src/Theme.css'
import fbIcon from 'src/assets/fb-icon.png'
import bcIcon from 'src/assets/bc-icon.png'
import instaIcon from 'src/assets/instagram-icon.png'
import type { z } from 'astro/zod'
import type { webLinks } from 'src/content/config'
import type { MenuLink } from 'src/components/Menu'

/**
 * Turns a 00:00 timestring into total seconds.
 * @param str
 * @returns
 */
export const timeToSeconds = (str: string) => {
	const a = str.split(':')
	return a.length == 2 ? +a[0] * 60 + +a[1] : +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
}

/*
  Decides when the header should change.
  If the banner element is on the page, just use the height of it.
  Otherwise do a calculation:
  - On mobile this is the window minus the headerheight * the banner height as a decimal.
  - On desktop it's just the window height * the banner height as a decimal.
*/
export const calculateScrollHeaderOffset = (window: any, modifierDesktop = 0, modifierMobile = 0) => {
	const bannerEl = document.querySelector<HTMLElement>('#top')
	const bannerHeight = (stripUnit(theme.dimensions.defaultBannerHeight) as number) / 100 // assumes it's a vh unit
	const mobileHeaderHeight =
		(stripUnit(theme.dimensions.headerHeightMobile) as number) + (stripUnit(theme.dimensions.subheaderHeight) as number) // assumes they're px units
	if (window.innerWidth < stripUnit(theme.breakpoints.xs)) {
		if (bannerEl) {
			return bannerEl.offsetHeight - mobileHeaderHeight + modifierMobile
		} else {
			return (window.innerHeight - mobileHeaderHeight + modifierMobile) * bannerHeight
		}
	} else {
		if (bannerEl) {
			return bannerEl.offsetHeight + modifierDesktop
		} else {
			return (window.innerHeight + modifierDesktop) * bannerHeight
		}
	}
}

/**
 * Click listener for an anchor element.
 * Scrolls to any anchor on the page. If no anchor supplied, scrolls to the clicked's href.
 * 
 * @param e
 * @param anchor
 * @param headerOffset
 * @param behavior
 * @returns
 */
export const scrollTo = (e: MouseEvent, anchor?: string, headerOffset?: number, behavior: ScrollBehavior = 'smooth') => {
	if (!(e.target instanceof HTMLAnchorElement)) return

	e.preventDefault()
	e.stopPropagation()

	const scrollTarget = anchor || e.target?.hash

	const element = document.querySelector(scrollTarget)

	if (!element) return

	if (!headerOffset) {
		element && element.scrollIntoView({ behavior: behavior })
	} else {
		const y = element.getBoundingClientRect().top + window.scrollY
		window.scrollTo(0, y - headerOffset)
	}
}

/**
 * Turns social links into items for a menu.
 * @param links
 * @returns
 */
export const socialLinksToMenuItems = (links?: z.infer<typeof webLinks>): MenuLink[] => {
	const iconMap: { [key: string]: string } = {
		bandcamp: bcIcon.src,
		instagram: instaIcon.src,
		facebook: fbIcon.src
	}

	return links
		? Object.entries(links).map(([type, artistLink]) => ({
				href: typeof artistLink !== 'string' ? artistLink.link : artistLink,
				image: iconMap[type] || undefined
		  }))
		: []
}
