import type React from "preact/compat"
import { useRef, useState, useEffect, useCallback } from "preact/compat"
import MenuIcon from '~icons/bx/menu'
import { background, dropdownButtonIcon, dropdownButtonWrapper, dropdownLi, dropdownLink, dropdownMenu, dropdownTop, dropdownWrapper, menuWidth, color, additionalLink } from './DropdownMenu.css'
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
	width?: string
	backgroundColor?: string
	textColor?: string
}

/**
 * A dropdown (or up) menu which can either hrefs, or hashes on the current page.
 * If hashes are present it will scroll to them smoothly, but won't update the URL.
 * It also highlights menu items based on the URL hash.
 * 
 * @param param0 
 * @returns 
 */
const DropdownMenu: React.FC<Props> = ({ list, menuTitle, direction, top, width, backgroundColor, textColor }) => {
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
		scrollTo(e, '#' + hash)
		setOpen(false)
	}, [])

	return (
		<div className={`${dropdownWrapper}`} style={assignInlineVars({
			[dropdownTop]: top,
			[menuWidth]: width,
			[background]: backgroundColor
		})}>
			<a className={dropdownButtonWrapper} aria-haspopup="true" onClick={toggleMenu}>
				<div className={dropdownButtonIcon}>
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
							href={`${item.href ? item.href : item.hash ? ('#' + item.hash) : ''}`}
							style={assignInlineVars({
								[color]: textColor
							})}
						>
							{item.title}
						</a>
						{item.additionalLinks && <div style={{ display: "flex" }}>
							{item.additionalLinks?.map((link) =>
								<a class={additionalLink} href={link.href}>
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
