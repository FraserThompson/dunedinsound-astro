/**
 * A dropdown (or up) menu which can either hrefs, or hashes on the current page.
 * If hashes are present it will scroll to them smoothly, but won't update the URL.
 * It also highlights menu items based on the URL hash.
 * 
 * @param param0 
 * @returns 
 */

import { useState, useEffect, useCallback } from "preact/hooks"
import type { FunctionalComponent } from "preact"
import MenuIcon from '~icons/bx/menu'
import { background, dropdownButtonIcon, dropdownButtonWrapper, dropdownLi, dropdownLink, dropdownMenu, dropdownTop, dropdownTopMobile, dropdownWrapper, menuWidth, color, additionalLink, dropdownHeight, dropdownHeightMobile } from './DropdownMenu.css'
import { scrollTo } from 'src/util/helpers'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { replaceEventName } from "src/util/history"

export interface MenuLink {
	title?: string
	href: string
	image?: string
	id?: string
	class?: string
}

interface DropdownItem {
	title?: string
	href?: string
	image?: string
	id?: string
	hash?: string
	additionalLinks?: MenuLink[]
}

interface Props {
	list: DropdownItem[]
	menuTitle?: string
	direction: "up" | "down"
	top?: string
	topMobile?: string
	width?: string
	height?: string
	heightMobile?: string
	backgroundColor?: string
	textColor?: string
}

const DropdownMenu: FunctionalComponent<Props> = ({ list, menuTitle, direction, top, topMobile, width, height, heightMobile, backgroundColor, textColor }) => {
	const [open, setOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState(null as string | null)


	useEffect(() => {
		document.addEventListener(replaceEventName, (e: any) => handleURLChange(e.detail))
		return () => document.removeEventListener(replaceEventName, (e: any) => handleURLChange(e.detail))
	}, [])

	const handleURLChange = (url: URL) => {
		if (url.hash) {
			const newSelectedId = location.hash.substring(1)
			setSelectedItem(newSelectedId)
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

	const select = useCallback((e: any, hash: string) => {
		scrollTo(e, '#' + hash)
		setOpen(false)
	}, [])

	return (
		<div className={`${dropdownWrapper}`} style={assignInlineVars({
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
				{list.map((item) =>
					<li className={`${dropdownLi} ${(item.hash && selectedItem === item.hash) ? 'active' : ''}`}>
						<a
							className={`${dropdownLink} menu-title`}
							onClick={(e: any) => item.hash && select(e, item.hash)}
							title={item.title}
							href={`${item.href ? item.href : item.hash ? ('#' + item.hash) : ''}`}
							style={assignInlineVars({
								[color]: textColor
							})}
						>
							{item.title}
						</a>
						{item.additionalLinks && <div class="flex">
							{item.additionalLinks?.map((link) =>
								<a class={additionalLink} title={link.title} href={link.href}>
									<small>
										{!link.image && link.title}
										{link.image && <img style={{ height: "25px" }} src={link.image} />}
									</small>
								</a>
							)}
						</div>}
					</li>
				)}
			</ul>
		</div >
	)
}

export default DropdownMenu
