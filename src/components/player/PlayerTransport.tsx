/**
 * The transport for the player. 
 * 
 * Must be instantiated inside a PlayerProvider.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./PlayerContext"
import { TransportButton } from "./PlayerTransport.css"

const PlayerTransport: FunctionalComponent = () => {
	const { playing, playPause, previous, next, ready } = usePlayer()

	return (
		<div>
			<button
				className={`${TransportButton} left hideMobile`}
				disabled={!ready}
				id="prev"
				onClick={() => previous()}
				aria-label="Previous track">
			</button>
			<button
				disabled={!ready}
				className={playing ? `${TransportButton} pause` : `${TransportButton} play`}
				onClick={() => playPause()}
				aria-label="Play/Pause">
			</button>
			<button
				className={`${TransportButton} right hideMobile`}
				disabled={!ready}
				id="next"
				onClick={() => next()}
				aria-label="Next track">
			</button>
		</div>
	)
}

export default PlayerTransport
