/**
 * A simple menu with links to hrefs.
 * 
 * Props:
 *  - links: an array of MenuLink objects.
 *  - currentPath: the current path, will highlight menu items based on this.
 *  - menuType: how to display the menu.
 * 
 * Menu links:
 *  - can specify a title or an image. if both are present it will prefer the image.
 *  - also can use a number of preset icons.
 * 
 * @param props 
 * @returns 
 */

import type React from "preact/compat"
import HomeIcon from '~icons/bx/home'
import { MenuLinkWrapper, MenuLi, MenuWrapper } from "./Menu.css"

type PresetIcons = 'home' | 'something'

export interface MenuLink {
	title?: string
	href: string
	image?: string
	id?: string,
	class?: string,
	icon?: PresetIcons
}

interface Props {
	links: MenuLink[]
	currentPath?: string
	menuType?: 'horizontal' | 'vertical' | 'sideways'
}

const Menu: React.FC<Props> = ({ currentPath, links, menuType = 'horizontal' }) => {

	const isActive = (href: string) => {
		if (!currentPath) {
			return false;
		}
		return href == '/' ? currentPath == href : currentPath.includes(href)
	}

	const getIcon = (icon: PresetIcons) => {
		if (icon === 'home') {
			return <HomeIcon />
		}
	}

	return <ul className={MenuWrapper}>
		{links.map((link) => (
			<li className={MenuLi[menuType]}>
				<a
					className={`${MenuLinkWrapper[menuType]} ${isActive(link.href) ? 'active' : ''} ${link.class || ''}`}
					href={link.href}
					title={link.title}
					id={link.id}
				>
					{!link.image && link.title}
					{link.image && <img src={link.image} />}
					{link.icon && getIcon(link.icon)}
				</a>
			</li>
		))}
	</ul>
}

export default Menu
