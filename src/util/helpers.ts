import fbIcon from 'src/assets/fb-icon.png'
import bcIcon from 'src/assets/bc-icon.png'
import instaIcon from 'src/assets/instagram-icon.png'
import type { z } from 'astro/zod'
import type { webLinks } from 'src/content.config'
import MarkdownIt from 'markdown-it'
import { convert } from 'html-to-text'
import type { MenuLink } from 'src/components/DropdownMenu'
import type { ProcessedEntry } from './collection'
import { scrollIntoView } from 'seamless-scroll-polyfill'

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
	const bannerHeight = 60 / 100
	const mobileHeaderHeight = 0
	if (window.innerWidth < 768) {
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
export const scrollTo = (
	e: MouseEvent,
	anchor?: string,
	headerOffset?: number,
	behavior: ScrollBehavior = 'smooth'
) => {
	if (!(e.target instanceof HTMLAnchorElement)) return

	e.preventDefault()
	e.stopPropagation()

	const scrollTarget = anchor || e.target?.hash

	const element = document.querySelector(scrollTarget)

	if (!element) return

	scrollToElement(element, headerOffset, behavior)
}

/**
 * Scroll to any element.
 *
 * @param element
 * @param headerOffset
 * @param parent
 * @param behavior
 * @returns
 */
export const scrollToElement = (
	element: Element,
	headerOffset?: number,
	parent: any = window,
	behavior: ScrollBehavior = 'smooth'
) => {
	if (!headerOffset) {
		scrollIntoView(element, { behavior })
	} else {
		const y = element.getBoundingClientRect().top + parent.scrollTop
		parent.scrollTo(0, y - headerOffset)
	}
}

/**
 * Turns social links into items for a menu.
 * @param links
 * @returns
 */
export const socialLinksToMenuItems = (links?: z.infer<typeof webLinks>): MenuLink[] => {
	if (!links) return []

	const iconMap: { [key: string]: string } = {
		bandcamp: bcIcon.src,
		instagram: instaIcon.src,
		facebook: fbIcon.src
	}

	const menuItems = Object.entries(links).map(([type, artistLink]) => ({
		href: typeof artistLink !== 'string' ? artistLink.link : artistLink,
		title: type.toUpperCase(),
		image: iconMap[type] || undefined
	}))

	return menuItems
}

/**
 * Returns true if an element is visible in the viewport.
 * @param el The element to check for
 * @param container The container (whole page by default)
 * @returns
 */
export const elementIsVisibleInViewport = (el: HTMLElement, container?: HTMLElement | Element | null) => {
	const { top, left, bottom, right } = el.getBoundingClientRect()
	const html = document.querySelector<HTMLElement>('html') as HTMLElement
	const containerRect = container ? container.getBoundingClientRect() : html.getBoundingClientRect()
	return (
		top >= containerRect.top &&
		left >= containerRect.left &&
		bottom <= containerRect.bottom &&
		right <= containerRect.right
	)
}

/**
 * Takes a list of artist entries and turns them into a comma seperated string.
 * @param artistList
 * @returns
 */
export const artistsToString = (artistList: ProcessedEntry<'artist'>[]) => {
	return artistList.reduce((acc, artist, i) => {
		acc += artist.entry.data.title + (i < artistList.length - 1 ? ', ' : '')
		return acc
	}, '')
}

/**
 * Generate a short excerpt from markdown.
 * @param body
 * @returns excerpt
 */
export const generateExcerpt = (body: string) => {
	const parser = new MarkdownIt()
	const html = parser.render(body.replace(/^(import ).*['"]/gm, ''))
	const options = {
		wordwrap: null,
		typographer: true,
		selectors: [
			{ selector: 'a', options: { ignoreHref: true } },
			{ selector: 'img', format: 'skip' },
			{ selector: 'figure', format: 'skip' }
		]
	}

	const text = convert(html, options)
	const distilled = convert(text, options)

	const excerpt = distilled.split(' ').slice(0, 68).join(' ')

	return excerpt + '...'
}

/**
 * Utter a phrase.
 * @param text
 */
export const speak = (text: string) => {
	const msg = new SpeechSynthesisUtterance()

	const synth = window.speechSynthesis
	const voices = synth.getVoices()
	const numberOfVoices = voices.length

	const voiceIndex = getRandom(0, numberOfVoices, true)

	msg.voice = voices[voiceIndex]
	msg.volume = 1
	msg.rate = getRandom(0.1, 2)
	msg.pitch = getRandom(0, 2)
	msg.text = text
	msg.lang = 'en-US'

	synth.speak(msg)
}

/**
 * Gets a random float between min and max. Floor will make it an integer.
 * @param min
 * @param max
 * @param floor
 * @returns
 */
export function getRandom(min: number, max: number, floor?: boolean) {
	const randomFloat = Math.random() * (max - min + 1) + min
	return floor ? Math.floor(randomFloat) : randomFloat
}

interface StoredScrollPosition {
	collection: string
	position: string
}

/**
 * Maintains the scroll position of the sidebar during page transitions.
 *
 * Uses events from the Astro Transitionms API.
 *
 * @param collection name of the collection the sidebar appears on
 */
export function maintainSidebarScrollPosition(collection: string) {
	// On first load scroll to active element
	document.addEventListener(
		'astro:page-load',
		() => {
			const sidebarMenu = document.querySelector('#sidebar-menu')
			const activeElement = sidebarMenu?.querySelector('.active')
			if (activeElement) {
				scrollIntoView(activeElement, { behavior: 'instant', block: 'center' })
			}
			// Probably not there but remove it anyway
			sessionStorage.removeItem(`scrollPosition`)
		},
		{ once: true }
	)

	// Before going to the next page, store the scroll position
	document.addEventListener('astro:before-swap', () => {
		const scrollPosition = document.querySelector('#sidebar-menu')?.scrollTop.toString()
		if (scrollPosition) {
			const storedScroll: StoredScrollPosition = { position: scrollPosition, collection: collection }
			sessionStorage.setItem(`scrollPosition`, JSON.stringify(storedScroll))
		}
	})

	// After going to next page, scroll to correct position, unless the collection changed
	document.addEventListener('astro:after-swap', () => {
		const scrollPosition = sessionStorage.getItem(`scrollPosition`)
		const storedScroll: StoredScrollPosition = scrollPosition ? JSON.parse(scrollPosition) : null

		const depth = window.location.pathname.split('/').length
		const sidebarMenu = document.querySelector<HTMLElement>('#sidebar-menu')
		const activeElement = sidebarMenu?.querySelector<HTMLElement>('.active')

		// Only remember scroll positions for collection entries, not the parent page
		// Also forget it when changing collections
		if (storedScroll && storedScroll.collection === collection && depth > 2) {
			sidebarMenu?.scrollTo({
				top: parseInt(storedScroll.position, 10),
				behavior: 'instant'
			})

			// It's possible for someone on mobile to scroll really fast so that the 
			// stored scrollbar position is wrong because it hasn't finished scrolling.
			// We do this to ensure the active element is always visible in these cases.
			if (activeElement && !elementIsVisibleInViewport(activeElement, sidebarMenu)) {
				scrollIntoView(activeElement, { behavior: 'instant', block: 'center' })
			}

		} else if (activeElement) {
			scrollIntoView(activeElement, { behavior: 'instant', block: 'center' })
		}
		sessionStorage.removeItem(`scrollPosition`)
	})
}

/**
 * Returns true of the currentPath includes part or all of the href.
 *
 * If strict is passed only returns true if currentPath includes part, but NOT all of the href.
 *
 * @param href
 * @param currentPath
 * @param strict
 */
export const isPartiallyActive = (href: string, currentPath: string, strict?: boolean) => {
	if (!currentPath) {
		return ''
	}

	const isItActive = href == '/' ? currentPath == href : currentPath.includes(href.replace(/\/$/, ''))

	if (strict) {
		return isItActive && currentPath !== href
	}

	return isItActive
}
