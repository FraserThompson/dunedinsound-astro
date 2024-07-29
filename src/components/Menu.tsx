import type React from "preact/compat"
import { MenuLink, MenuLi, MenuWrapper } from "./Menu.css"

export interface MenuLink {
	title?: string
	href: string
	image?: string
	id?: string
}

interface Props {
	links: MenuLink[]
	currentPath?: string
	menuType?: 'horizontal' | 'vertical' | 'sideways'
}

/**
 * A simple menu with links to hrefs.
 * 
 * Content can include an image or a title, if both are present it will prefer the image.
 * 
 * @param props 
 * @returns 
 */
const Menu: React.FC<Props> = ({ currentPath, links, menuType = 'horizontal' }) => {
	const isActive = (href: string) => {
		if (!currentPath) {
			return false;
		}
		return href == '/' ? currentPath == href : currentPath.includes(href)
	}
	return <ul className={MenuWrapper}>
		{links.map((link) => (
			<li className={MenuLi[menuType]}>
				<a
					className={`${MenuLink[menuType]} ${isActive(link.href) ? 'active' : ''}`}
					href={link.href}
					title={link.title}
					id={link.id}
				>
					{!link.image && link.title}
					{link.image && <img src={link.image} />}
				</a>
			</li>
		))}
	</ul>
}

export default Menu
