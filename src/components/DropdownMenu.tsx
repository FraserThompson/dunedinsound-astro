/**
 * A dropdown (or up) menu which can either hrefs, or hashes on the current page.
 * If hashes are present it will scroll to them smoothly, but won't update the URL.
 * It also highlights menu items based on the URL hash.
 * 
 * If a list of DropdownItems is provided it will render that.
 * Otherwise for more complex needs you can just pass child <li> elements.
 * 
 * Fires events:
 *  dropdown-item-click: When an item is clicked.
 * 
 * TODO: Refactor this into an Astro component?
 * 
 * @param param0 
 * @returns 
 */

import { useState, useEffect, useCallback, useRef, type MutableRef } from "preact/hooks"
import type { FunctionalComponent } from "preact"
import MenuIcon from '~icons/iconoir/menu'
import { background, dropdownButtonIcon, dropdownButtonWrapper, dropdownLi, dropdownLink, dropdownMenu, dropdownTop, dropdownTopMobile, dropdownWrapper, menuWidth, color, dropdownHeight, dropdownHeightMobile } from './DropdownMenu.css'
import { scrollToElement } from 'src/util/helpers'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { replaceEventName } from "src/util/history"
import { theme } from "../Theme.css"

export const dropdownClickEventName = "dropdown-item-click"

export interface DropdownClickEventDetails {
	target: HTMLAnchorElement
}

export interface MenuLink {
	title?: string
	subtitle?: string
	href: string // If it's a hash it'll scroll to it, otherwise a regular link
	image?: string
	id?: string
	class?: string
}

interface Props {
	list?: MenuLink[]
	menuTitle?: string
	direction: "up" | "down"
	top?: string
	topMobile?: string
	width?: string
	height?: string
	heightMobile?: string
	backgroundColor?: string
	textColor?: string,
	children?: any
}

const DropdownMenu: FunctionalComponent<Props> = ({ list, menuTitle, direction, top, topMobile, width, height, heightMobile, backgroundColor, textColor, children }) => {
	const [open, setOpen] = useState(false)
	const dropdownRef: MutableRef<any> = useRef()

	/**
	 * Attach listeners
	 */
	useEffect(() => {
		document.addEventListener(replaceEventName, (e: any) => handleURLChange(e.detail))
		// We do this instead of onclick so we can handle custom menu children
		dropdownRef.current?.querySelectorAll('.menuLink')
			.forEach((el: HTMLAnchorElement) => el.addEventListener('click', (e: MouseEvent) => select(e)))
		// Handle initial navigation on create
		handleURLChange(new URL(window.location.href))
		return () => document.removeEventListener(replaceEventName, (e: any) => handleURLChange(e.detail))
	}, [list])

	/**
	 * When the URL hash changes, scroll to the right thing.
	 * @param url 
	 */
	const handleURLChange = (url: URL) => {
		if (url.hash) {
			// This is kinda mid.
			// Remove all active links so we can add the new one.
			dropdownRef.current?.querySelectorAll(`.menuLink`)
				.forEach((el: HTMLAnchorElement) => el.parentElement?.classList.remove('active'))
			const menuLink = dropdownRef.current?.querySelector(`.menuLink[href="${url.hash}"]`)
			if (menuLink) {
				menuLink.parentElement?.classList.add('active');
			}
		}
	}

	/**
	 * Open and close this menu.
	 */
	const toggleMenu = useCallback(
		(e: any) => {
			e.stopPropagation()
			e.preventDefault()
			setOpen(!open)
		},
		[open]
	)

	/**
	 * Called when clicking a link in the dropdown.
	 */
	const select = useCallback((e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const target = e.target as HTMLAnchorElement
		const scrollTarget = target?.hash

		if (scrollTarget) {
			const scrollTargetElement = document.querySelector(scrollTarget)
			scrollTargetElement && scrollToElement(scrollTargetElement)
			setOpen(false)
		}

		// Let everyone know
		const detail: DropdownClickEventDetails = {
			target
		}
		const event = new CustomEvent(dropdownClickEventName, {
			detail
		})
		window.dispatchEvent(event)
	}, [])

	return (
		<div ref={dropdownRef} className={`${dropdownWrapper}`} style={assignInlineVars({
			[dropdownTop]: top,
			[dropdownTopMobile]: topMobile,
			[dropdownHeight]: height,
			[dropdownHeightMobile]: heightMobile,
			[menuWidth]: width,
			[background]: backgroundColor
		})}>
			<a className={dropdownButtonWrapper} aria-haspopup="true" onClick={toggleMenu}>
				<div className={dropdownButtonIcon} style={assignInlineVars({
					[color]: textColor,
					[dropdownHeight]: height,
					[dropdownHeightMobile]: heightMobile,
				})}>
					{menuTitle}
					<MenuIcon />
				</div>
			</a>
			<ul className={`${dropdownMenu} ${open ? 'open' : ''} ${direction}`}>
				{list && list.map((item) =>
					<li
						className={`${dropdownLi}`}
						style={assignInlineVars({
							[background]: backgroundColor,
							[color]: textColor
						})}>
						<a
							className={`${dropdownLink} menuLink menu-title`}
							title={item.title}
							href={`${item.href}`}
							style={assignInlineVars({
								[background]: backgroundColor,
								[color]: textColor
							})}
						>
							{item.title}
							<span style={{ marginLeft: 'auto', color: theme.color.dullText }}>{item.subtitle}</span>
						</a>
					</li>
				)}
				{children}
			</ul>
		</div >
	)
}

export default DropdownMenu
