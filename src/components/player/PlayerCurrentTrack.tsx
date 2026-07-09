/**
 * Display with the current track.
 * 
 * Must be instantiated inside a PlayerProvider.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./PlayerContext"
import { WinampInset } from "./PlayerTracklist.css"
import { CurrentTrackMarquee, CurrentTrackText } from "./PlayerCurrentTrack.css"
import PlayerVisualizer from "./PlayerVisualizer"

const PlayerCurrentTrack: FunctionalComponent = () => {
	const { currentTrackTitle, playing } = usePlayer()

	return (
		<div className={WinampInset}>
			<div style={{ position: 'absolute' }}>
				<PlayerVisualizer width={230} height={18} />
			</div>
			<div className={CurrentTrackMarquee}>
				{!playing && <p className={CurrentTrackText}>
					{currentTrackTitle ? <>*** {currentTrackTitle} ***</> : "Use the 'file' menu to load a playlist"}
				</p>}
			</div>
		</div>
	)
}

export default PlayerCurrentTrack
