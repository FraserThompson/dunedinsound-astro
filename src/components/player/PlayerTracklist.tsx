/**
 * The tracklist for the player.
 * 
 * Props:
 *  - maxHeight: the max height
 *  - maxHeightDesktop: the max height on desktop
 *  - showShuffle: whether to show the shuffle button
 *  - showClear: whether to show the clear button
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./usePlayer"
import { TracklistWrapper, maxHeightVar, maxHeightDesktopVar } from "./PlayerTracklist.css"
import { assignInlineVars } from "@vanilla-extract/dynamic"
import { TransportButton } from "./PlayerTransport.css"
import TracklistTrack from "./PlayerTracklistTrack"

interface Props {
	maxHeight?: string
	maxHeightDesktop?: string
	showShuffle?: boolean
	showClear?: boolean
}

const PlayerTracklist: FunctionalComponent<Props> = ({ maxHeight, maxHeightDesktop, showShuffle = false, showClear = false }) => {
	const { playlist, selectedTrack, selectTrack, seekToTime, ready, playing, currentTime, toggleShuffle, clearPlaylist } = usePlayer()


	return (
		<div style={{ display: 'contents' }}>
			<ul className={TracklistWrapper} style={assignInlineVars({
				[maxHeightVar]: maxHeight,
				[maxHeightDesktopVar]: maxHeightDesktop,
			})}>
				{playlist?.map((track, index) => {
					const isSelected = selectedTrack == index
					const isPlayingTrack = playing && isSelected
					const isPausedTrack = !playing && !!currentTime && isSelected
					return <TracklistTrack
						key={track.id}
						track={track}
						onTrackClick={(track) => selectTrack(index)}
						onSeekClick={(track, time) => seekToTime(time, index)}
						isSelected={isSelected}
						isPlayingTrack={isPlayingTrack}
						isPausedTrack={isPausedTrack}
					>
						<div style={{ paddingRight: '5px' }}>{(index + 1).toString().padStart(2, '0')}.</div>
						<div class="track-title">{track.title}</div>
					</TracklistTrack>
				})}
				{!playlist && <li>Add a track to begin</li>}
			</ul>
			<div>
				{showShuffle && <button
					className={`${TransportButton} clear`}
					disabled={!ready}
					id="shuffle"
					onClick={() => toggleShuffle()}
					aria-label="Toggle shuffle"
				>
					SHUFFLE
				</button>}
				{showClear && <button
					className={`${TransportButton} clear`}
					disabled={!ready}
					onClick={() => clearPlaylist()}
					aria-label="Clear playlist"
				>
					CLEAR
				</button>}
			</div>
		</div>
	)
}

export default PlayerTracklist
