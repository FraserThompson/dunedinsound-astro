import React from 'preact/compat'
import { gridWrapper, colXs, colSm, colMd, colLg, centered } from './GridContainer.css'
import { assignInlineVars } from '@vanilla-extract/dynamic'

interface Props {
	children: React.ReactNode,
	xs?: number,
	sm?: number,
	md?: number,
	lg?: number,
	center?: boolean
}

const GridContainer: React.FC<Props> = ({ children, xs = 12, sm = 6, md = 4, lg = 4, center }) =>
	<div className={gridWrapper} style={assignInlineVars({
		[colXs]: `span ${xs}`,
		[colSm]: `span ${sm}`,
		[colMd]: `span ${md}`,
		[colLg]: `span ${lg}`,
		[centered]: center ? "center" : "initial"
	})}>
		{children}
	</div>

export default GridContainer
