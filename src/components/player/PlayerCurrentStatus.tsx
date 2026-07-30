/**
 * Displays the time/duration of the current track.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./usePlayer"
import { WinampInset } from "./PlayerTracklist.css"
import {
	CurrentTrackPanel,
	CurrentTrackStatus,
	CurrentTrackStatusText,
} from "./PlayerCurrentTrack.css"
import { formatTime } from "./wavesurferShared"

const PlayerCurrentStatus: FunctionalComponent = () => {
	const { currentTime, duration, playing, playlist } = usePlayer()
	const hasProgress = !!duration && (playing || !!currentTime)
	const progressPercent = hasProgress
		? Math.max(0, Math.min((currentTime ?? 0) / duration, 1)) * 100
		: 0
	const progressOverlayColor = playing
		? "rgba(121, 187, 255, 0.45)"
		: "rgba(121, 187, 255, 0.25)"
	const statusLabel = hasProgress
		? `${formatTime(currentTime)}/${formatTime(duration)}`
		: `Stopped (${playlist?.length ?? 0} tracks)`

	return (
		<div
			className={`${WinampInset} ${CurrentTrackPanel}`}
			style={hasProgress ? {
				backgroundImage: `linear-gradient(to right, ${progressOverlayColor} ${progressPercent}%, transparent ${progressPercent}%)`,
			} : undefined}
		>
			<div className={CurrentTrackStatus}>
				<p className={CurrentTrackStatusText}>{statusLabel}</p>
			</div>
		</div>
	)
}

export default PlayerCurrentStatus
