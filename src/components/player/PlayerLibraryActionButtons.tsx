/**
 * Buttons for doing things with the selected PlayerLibrary track.
 * 
 * Props:
 *  - onPlayAll: Handler for PLAY ALL Button.
 *  - onAddAll: Handler for ADD ALL Button.
 *  - onPlaySelected: Handler for PLAY SELECTED Button.
 *  - onAddSelected: Handler for ADD SELECTED Button.
 *  - hasTracks: Whether there are library tracks.
 *  - hasSelection: Whether a track is selected.
 */

import type { FunctionalComponent } from "preact"
import PlayIcon from '~icons/iconoir/play'
import PlusIcon from '~icons/iconoir/plus'
import { TransportButton } from "./PlayerTransport.css"
import { PlayerLibraryActionBar } from "./PlayerLibrary.css"

interface Props {
	onPlayAll: () => void
	onAddAll: () => void
	onPlaySelected: () => void
	onAddSelected: () => void
	hasTracks: boolean
	hasSelection: boolean
}

export const PlayerLibraryActionButtons: FunctionalComponent<Props> = ({
	onPlayAll,
	onAddAll,
	onPlaySelected,
	onAddSelected,
	hasTracks,
	hasSelection,
}) => {
	return (
		<div className={PlayerLibraryActionBar}>
			<button className={`${TransportButton} clear`} disabled={!hasTracks} onClick={onPlayAll}>
				<PlayIcon /> PLAY ALL
			</button>
			<button className={`${TransportButton} clear`} style={{ marginRight: "0.5rem" }} disabled={!hasTracks} onClick={onAddAll}>
				<PlusIcon /> ADD ALL
			</button>
			<button className={`${TransportButton} clear`} disabled={!hasSelection} onClick={onPlaySelected}>
				<PlayIcon /> PLAY SELECTED
			</button>
			<button className={`${TransportButton} clear`} disabled={!hasSelection} onClick={onAddSelected}>
				<PlusIcon /> ADD SELECTED
			</button>
		</div>
	)
}
