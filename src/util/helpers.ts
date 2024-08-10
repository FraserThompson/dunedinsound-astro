import { stripUnit } from 'polished'
import { theme } from 'src/Theme.css'
import fbIcon from 'src/assets/fb-icon.png'
import bcIcon from 'src/assets/bc-icon.png'
import instaIcon from 'src/assets/instagram-icon.png'
import type { z } from 'astro/zod'
import type { webLinks } from 'src/content/config'
import type { CollectionEntry } from 'astro:content'
import { toMachineName } from './names'
import MarkdownIt from 'markdown-it'
import { convert } from 'html-to-text'
import type { MenuLink } from 'src/components/DropdownMenu'

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
	const mobileHeaderHeight = 30 + 30
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
		element.scrollIntoView({ behavior: behavior })
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

export const monthMap: { [i: number]: string } = {
	0: 'January',
	1: 'February',
	2: 'March',
	3: 'April',
	4: 'May',
	5: 'June',
	6: 'July',
	7: 'August',
	8: 'September',
	9: 'October',
	10: 'November',
	11: 'December'
}

/**
 * Returns true if an element is visible in the viewport.
 * @param el
 * @param partiallyVisible
 * @returns
 */
export const elementIsVisibleInViewport = (el: Element, partiallyVisible = false) => {
	const { top, left, bottom, right } = el.getBoundingClientRect()
	const { innerHeight, innerWidth } = window
	return partiallyVisible
		? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
				((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
		: top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth
}

/**
 * Takes a list of artist entries and turns them into a comma seperated string.
 * @param artistList
 * @returns
 */
export const artistsToString = (artistList: CollectionEntry<'artist'>[]) => {
	return artistList.reduce((acc, artist, i) => {
		acc += artist.data.title + (i < artistList.length - 1 ? ', ' : '')
		return acc
	}, '')
}

/**
 * Takes a string and encodes it into a hash.
 * @param string
 * @returns
 */
export const makeHash = (string: string) => 'h' + encodeURIComponent(toMachineName(string))

/**
 * Generate a short excerpt from markdown.
 * @param body
 * @returns excerpt
 */
export const generateExcerpt = (body: string) => {
	const parser = new MarkdownIt()
	const html = parser.render(body.replace(/^(import ).*'/gm, ''))
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
