/**
 * The transport for the player.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./usePlayer"
import { TransportButton } from "./PlayerTransport.css"

const PlayerTransport: FunctionalComponent = () => {
	const { playing, playPause, previous, next, ready } = usePlayer()
	const controlsDisabled = !ready && !playing

	return (
		<div>
			<button
				className={`${TransportButton} hideMobile left`}
				disabled={controlsDisabled}
				id="prev"
				onClick={() => previous()}
				aria-label="Previous track"
			>
			</button>
			<button
				disabled={controlsDisabled}
				className={playing ? `${TransportButton} pause` : `${TransportButton} play`}
				onClick={() => playPause()}
				aria-label="Play/Pause"
			>
			</button>
			<button
				className={`${TransportButton} hideMobile right`}
				disabled={controlsDisabled}
				id="next"
				onClick={() => next()}
				aria-label="Next track"
			>
			</button>
		</div>
	)
}

export default PlayerTransport
