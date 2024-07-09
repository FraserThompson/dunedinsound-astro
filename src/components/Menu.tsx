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
	backgroundColor?: string
	height?: string
	width?: string
	horizontal?: boolean
}

/**
 * A simple menu with links to hrefs.
 * 
 * Content can include an image or a title, if both are present it will prefer the image.
 * 
 * @param props 
 * @returns 
 */
const Menu: React.FC<Props> = (props) => {
	const isActive = (href: string) => {
		if (!props.currentPath) {
			return false;
		}
		return href == '/' ? props.currentPath == href : props.currentPath.includes(href)
	}
	const menuType = props.horizontal ? 'horizontal' : 'vertical'
	return <ul className={MenuWrapper}>
		{props.links.map((link) => (
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
