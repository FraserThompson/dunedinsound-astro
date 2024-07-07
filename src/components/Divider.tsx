import React from 'react'
import { dividerWrapper, dividerColor, dividerBackgroundColor, stickyTop } from './Divider.css'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { scrollTo } from 'src/util/helpers'

interface Props {
	href: string,
	color?: string,
	backgroundColor?: string,
	className?: string
	sticky?: boolean | string,
	smoothScroll?: boolean
}

/**
 * A clickable divider.
 * If smoothScroll is true it will scroll smoothly to the anchor specified in the href, and not update the URL.
 * 
 * @param param0 
 * @returns 
 */
const Divider: React.FC<Props> = ({ href, color, sticky, backgroundColor, children, className, smoothScroll }) => (
	<div className={`${dividerWrapper[sticky ? 'sticky' : 'normal']} ${className}`} style={assignInlineVars({
		[dividerColor]: color,
		[dividerBackgroundColor]: backgroundColor,
		[stickyTop]: typeof sticky === 'string' ? sticky : undefined
	})}>
		{href && <a href={href} onClick={(e: any) => smoothScroll && scrollTo(e)}>{children}</a>}
		{!href && children}
	</div>
)

export default Divider
