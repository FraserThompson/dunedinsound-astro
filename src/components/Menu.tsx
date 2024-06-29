import type React from "preact/compat"
import { MenuLink, MenuLi, MenuWrapper } from "./Menu.css"

interface MenuLink {
	title: string
	href: string
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
					id={link.id}
				>
					{' '}{link.title}{' '}
				</a>
			</li>
		))}
	</ul>
}

export default Menu
