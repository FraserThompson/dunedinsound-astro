import React from 'preact/compat'
import { assignInlineVars } from "@vanilla-extract/dynamic"
import { columns, container } from "./MasonryContainer.css"

interface Props {
	children: React.ReactNode,
	columns?: number,
}

const MasonryContainer: React.FC<Props> = (props) =>
	<div className={container} style={
		assignInlineVars({
			[columns]: `${props.columns} 200px`
		})
	}>
		{props.children}
	</div>

export default MasonryContainer
