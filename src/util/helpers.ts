import fbIcon from 'src/assets/fb-icon.png'
import bcIcon from 'src/assets/bc-icon.png'
import instaIcon from 'src/assets/instagram-icon.png'
import youtubeIcon from 'src/assets/youtube-icon.png'
import spotifyIcon from 'src/assets/spotify-icon.png'
import websiteIcon from 'src/assets/web-icon.png'
import type { z } from 'astro/zod'
import type { webLinks } from 'src/content.config'
import MarkdownIt from 'markdown-it'
import { convert } from 'html-to-text'
import type { MenuLink } from 'src/components/DropdownMenu'
import type { ProcessedEntry } from './collection'
import { breakpoints } from 'src/Theme.css'

/**
 * Gets the current screensize we're on based on breakpoints.
 * @returns the current screen size
 */
export const getCurrentScreensize = (): "xs" | "md" | "lg" => {
	const windowWidth = window.innerWidth;
	return windowWidth < breakpoints.xs
		? "xs"
		: windowWidth < breakpoints.md
			? "md"
			: windowWidth < breakpoints.lg
				? "lg"
				: "lg"
}

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
	if (getCurrentScreensize() === "xs") {
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
 * Scrolls to any selector on the page. If no selector supplied, scrolls to the clicked's href.
 *
 * @param e
 * @param anchor
 * @param headerOffset
 * @param behavior
 * @returns
 */
export const scrollTo = (
	e: MouseEvent,
	selector?: string,
	headerOffset?: number,
	behavior: ScrollBehavior = 'smooth'
) => {
	if (!(e.target instanceof HTMLAnchorElement)) return

	e.preventDefault()
	e.stopPropagation()

	const scrollTarget = selector || e.target?.hash

	const elements = document.querySelectorAll(scrollTarget)

	if (!elements.length) return

	elements.forEach((el) => {
		scrollToElement(el, headerOffset, undefined, behavior)
	})
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
	parent?: Element | Window,
	behavior: ScrollBehavior = 'smooth'
) => {
	// If no headerOffset is provided (null or undefined), fall back to native scrollIntoView.
	// We check for null/undefined explicitly so a headerOffset of 0 is honoured.
	if (headerOffset == null) {
		element.scrollIntoView({ behavior, block: 'start', inline: 'start' })
		return
	}

	// If scrolling the window/document
	if (!parent || parent === window) {
		const win = window
		const currentScroll = win.scrollY || win.pageYOffset || document.documentElement.scrollTop || 0
		const y = currentScroll + element.getBoundingClientRect().top
		const top = Math.max(0, y - headerOffset)
		win.scrollTo({ top, behavior })
		return
	}

	// Scrolling a scrollable container element
	const parentEl = parent as HTMLElement
	const parentRect = parentEl.getBoundingClientRect()
	const elRect = element.getBoundingClientRect()

	// Compute element's offset relative to the parent, then add the parent's current scrollTop
	const y = parentEl.scrollTop + (elRect.top - parentRect.top)
	const top = Math.max(0, y - headerOffset)
	parentEl.scrollTo({ top, behavior })
}

/**
 * Turns social links into items for a menu.
 * @param links
 * @returns
 */
export const socialLinksToMenuItems = (links?: z.infer<typeof webLinks>): MenuLink[] => {
	if (!links) return []

	// Links without icons will not be displayed.
	// So add an icon here if there's a new type of link.
	const iconMap: { [key: string]: string } = {
		bandcamp: bcIcon.src,
		instagram: instaIcon.src,
		facebook: fbIcon.src,
		youtube: youtubeIcon.src,
		website: websiteIcon.src,
		spotify: spotifyIcon.src
	}

	const menuItems = Object.entries(links)
		.filter(([type]) => iconMap[type])
		.map(([type, artistLink]) => ({
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
export const generateExcerpt = (body: string, length?: number, suffix?: string) => {
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

	const excerpt = distilled.split(' ').slice(0, length || 68).join(' ')

	return excerpt + (suffix !== undefined ? suffix : '...')
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
