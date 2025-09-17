/**
 * A dropdown (or up) menu which can either hrefs, or hashes on the current page.
 * If hashes are present it will scroll to them smoothly, but won't update the URL.
 * It also highlights menu items based on the URL hash.
 * 
 * If a list of DropdownItems is provided it will render that.
 * Otherwise for more complex needs you can just pass child <li> elements.
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
import { scrollTo } from 'src/util/helpers'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { replaceEventName } from "src/util/history"
import { theme } from "../ThemeContract.css"

export interface MenuLink {
	title?: string
	href: string
	image?: string
	id?: string
	class?: string
}

interface DropdownItem {
	title?: string
	subtitle?: string
	href?: string
	image?: string
	id?: string
	hash?: string
}

interface Props {
	list?: DropdownItem[]
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

	useEffect(() => {
		document.addEventListener(replaceEventName, (e: any) => handleURLChange(e.detail))
		// We do this instead of onclick so we can handle custom menu children
		dropdownRef.current?.querySelectorAll('.menuLink')
			.forEach((el: HTMLAnchorElement) => el.addEventListener('click', (e: MouseEvent) => select(e)))
		// Handle initial navigation on create
		handleURLChange(new URL(window.location.href))
		return () => document.removeEventListener(replaceEventName, (e: any) => handleURLChange(e.detail))
	}, [])

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

	const toggleMenu = useCallback(
		(e: any) => {
			e.stopPropagation()
			e.preventDefault()
			setOpen(!open)
		},
		[open]
	)

	const select = useCallback((e: MouseEvent) => {
		const target = e.target as HTMLAnchorElement
		if (target?.hash) {
			scrollTo(e, target.hash)
			setOpen(false)
		}
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
							href={`${item.href ? item.href : item.hash ? ('#' + item.hash) : ''}`}
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
