import React from 'react'
import { dividerWrapper } from './Divider.css'
import { assignInlineVars } from '@vanilla-extract/dynamic'

interface Props {
	href: string,
	color?: string,
	backgroundColor?: string,
	className?: string
	sticky?: boolean,
}

const Divider: React.FC<Props> = ({ href, color, sticky, backgroundColor, children, className }) => (
	<div className={`${dividerWrapper[sticky ? 'sticky' : 'normal']} ${className}`} style={assignInlineVars({
		color: color,
		backgroundColor: backgroundColor
	})}>
		{href && <a href={href}>{children}</a>}
		{!href && children}
	</div>
)

export default Divider
