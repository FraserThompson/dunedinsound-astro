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
	id?: string
}

/**
 * Children of the grid should use the gridChild class.
 * @param param0 
 * @returns 
 */
const GridContainer: React.FC<Props> = ({ children, xs = 12, sm = 6, md = 3, lg = 3, center, id }) =>
	<div className={gridWrapper} id={id} style={assignInlineVars({
		[colXs]: `${xs}`,
		[colSm]: `${sm}`,
		[colMd]: `${md}`,
		[colLg]: `${lg}`,
		[centered]: center ? "center" : "initial"
	})}>
		{children}
	</div>

export default GridContainer
