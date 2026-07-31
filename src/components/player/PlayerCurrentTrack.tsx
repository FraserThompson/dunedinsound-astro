/**
 * Display with the current track title and a playing visualizer.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./usePlayer"
import { WinampInset } from "./PlayerTracklist.css"
import { CurrentTrackPanel } from "./PlayerCurrentTrack.css"
import PlayerVisualizer from "./PlayerVisualizer"
import { MarqueeText } from "../MarqueeText"

const PlayerCurrentTrack: FunctionalComponent = () => {
	const { playlist, selectedTrack, playing } = usePlayer()
	const currentTrackTitle = playlist?.[selectedTrack]?.title

	return (
		<div className={`${WinampInset} ${CurrentTrackPanel}`} style={{ flex: 1 }}>
			<div style={{ position: 'absolute', overflow: 'hidden' }}>
				<PlayerVisualizer width={600} height={18} />
			</div>
			<MarqueeText text={currentTrackTitle} isPlaying={playing} placeholder="Add a track to begin"></MarqueeText>
		</div>
	)
}

export default PlayerCurrentTrack
