/**
 * The transport for the player. 
 * 
 * Must be instantiated inside a PlayerProvider.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./PlayerContext"
import { TransportButton } from "./PlayerTransport.css"

interface Props {
	showShuffle?: boolean
}

const PlayerTransport: FunctionalComponent<Props> = ({ showShuffle }) => {
	const { playing, playPause, previous, next, ready, toggleShuffle } = usePlayer()

	return (
		<div>
			<button
				className={`${TransportButton} left hideMobile`}
				disabled={!ready}
				id="prev"
				onClick={() => previous()}
				aria-label="Previous track"
			>
			</button>
			<button
				disabled={!ready}
				className={playing ? `${TransportButton} pause` : `${TransportButton} play`}
				onClick={() => playPause()}
				aria-label="Play/Pause"
			>
			</button>
			<button
				className={`${TransportButton} right hideMobile`}
				disabled={!ready}
				id="next"
				onClick={() => next()}
				aria-label="Next track"
			>
			</button>
			{showShuffle && <button
				className={`${TransportButton} shuffle`}
				disabled={!ready}
				id="shuffle"
				onClick={() => toggleShuffle()}
				aria-label="Toggle shuffle"
			>
			</button>}
		</div>
	)
}

export default PlayerTransport
