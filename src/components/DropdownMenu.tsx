import React, { useState, useCallback, useEffect, useRef } from 'react'
import { FaBars } from 'react-icons/fa'
import { dropdownButtonIcon, dropdownButtonWrapper, dropdownLi, dropdownMenu, dropdownTop, dropdownWrapper } from './DropdownMenu.css'
import { scrollTo } from 'src/util/helpers'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import type { MenuLink } from './Menu'
import browserHistory from 'src/util/history';
import type { Location } from 'history'

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
}

/**
 * A dropdown (or up) menu which can either hrefs, or hashes on the current page.
 * If hashes are present it will scroll to them smoothly, but won't update the URL.
 * 
 * @param param0 
 * @returns 
 */
const DropdownMenu: React.FC<Props> = ({ list, menuTitle, direction, top }) => {
	const [open, setOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState(null as string | null)

	const history = useRef(browserHistory)

	useEffect(() => {
		const unlisten = history.current?.listen((location) => handleURLChange(location.location))
		return () => unlisten && unlisten()
	}, [])

	const handleURLChange = (location: Location) => {
		if (location.hash) {
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
		scrollTo(e, hash)
		setOpen(false)
	}, [])

	return (
		<div className={`${dropdownWrapper}`} style={assignInlineVars({
			[dropdownTop]: top
		})}>
			<a className={dropdownButtonWrapper} aria-haspopup="true" onClick={toggleMenu}>
				<div className={dropdownButtonIcon}>
					{menuTitle}
					<FaBars />
				</div>
			</a>
			<ul className={`${dropdownMenu} ${open ? 'open' : ''} ${direction}`}>
				{list.map((item) =>
					<li className={`${dropdownLi} ${selectedItem == item.hash ? 'active' : ''}`}>
						<a className="menu-title" onClick={(e: any) => item.hash && select(e, item.hash)} href={`${item.href ? item.href : item.hash ? ('#' + item.hash) : ''}`}>
							{item.title}
						</a>
						<span style={{ marginLeft: "auto" }}>
							{item.additionalLinks?.map((link) => <a href={link.href}>{link.title} {link.image && <img src={link.image} />}</a>)}
						</span>
					</li>
				)}
			</ul>
		</div>
	)
}

export default DropdownMenu
