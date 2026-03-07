/**
 * Display with the current track.
 * 
 * Must be instantiated inside a PlayerProvider.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./PlayerContext"
import { WinampInset } from "./PlayerTracklist.css"
import { CurrentTrackText } from "./PlayerCurrentTrack.css"

const PlayerCurrentTrack: FunctionalComponent = () => {
	const { currentTrackTitle } = usePlayer()

	return (
		<div className={WinampInset}>
			<p className={CurrentTrackText}><marquee> *** {currentTrackTitle} *** </marquee></p>
		</div>
	)
}

export default PlayerCurrentTrack
