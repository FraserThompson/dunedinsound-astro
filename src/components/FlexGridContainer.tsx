import React from 'preact/compat'
import { FlexGridWrapper, flexDefault, flexXs, widthDefault, widthXs, flexMd, widthMd, flexLg, widthLg, maxWidth2 } from './FlexGridContainer.css'
import { assignInlineVars } from '@vanilla-extract/dynamic'

interface Props {
	children: React.ReactNode,
	xs?: number,
	sm?: number,
	md?: number,
	lg?: number,
	maxWidth?: string
	fixedWidth?: boolean
	id?: string
}

const FlexGridContainer: React.FC<Props> = ({children, xs = 6, sm = 4, md = 3, lg = 3, maxWidth, fixedWidth, id}) => {
	const cols = 12

	return <div className={FlexGridWrapper} id={id} style={assignInlineVars({
		[flexDefault]: `1 1 ${100 * (xs / cols)}%`,
		[widthDefault]: fixedWidth ? `${100 * (xs / cols)}%` : undefined,
		[flexXs]: `1 1 ${100 * (sm / cols)}%`,
		[widthXs]: fixedWidth ? `${ 100 * (sm / cols)}%` : undefined,
		[flexMd]: `1 1 ${100 * (md / cols)}%`,
		[widthMd]: fixedWidth ? `$100 * (md / cols)}%` : undefined,
		[flexLg]: `1 1 ${100 * (lg / cols)}%`,
		[widthLg]: fixedWidth ? `${100 * (lg / cols)}%` : undefined,
		[maxWidth2]: maxWidth
	})}>
		{children}
	</div>
}

export default FlexGridContainer;
