/**
 * A track displayed in a tracklist (and the library).
 * 
 * Props:
 *  - track: The track to display.
 *  - hideTracklist: Whether to hide the subtracklist.
 *  - isSelected: Whether it's selected.
 *  - isPlayingTrack: Whether it's playing.
 *  - isPausedTrack: Whether it's paused.
 *  - rowTemplate: A CSS grid template string to encapsulate the row.
 *  - currentTime: The current time if it's playing.
 *  - duration: The duration.
 *  - onTrackClick: Handler for when a track is clicked.
 *  - onSeekClick: Handler for when a sub-playlist is seeked.
 *  - children: Content shown inside each track.
 * 
 */

import type { ComponentChildren, FunctionalComponent } from "preact"
import type { PlayerAudio } from "@src/util/collection"
import DownloadIcon from "~icons/iconoir/download"
import PlayerVisualizer from "./PlayerVisualizer"
import { PlayerLibraryColumnLabel } from "@src/components/player/PlayerLibrary.css"
import { SubTracklist, TracklistTrackWrapper } from "./PlayerTracklistTrack.css"

interface Props {
	track: PlayerAudio
	hideTracklist?: boolean
	isSelected?: boolean
	isPlayingTrack?: boolean
	isPausedTrack?: boolean
	rowTemplate?: string
	currentTime?: number
	duration?: number
	onTrackClick?: (track: PlayerAudio) => void
	onSeekClick?: (track: PlayerAudio, time: string) => void
	children?: ComponentChildren
}

export const TrackListTrack: FunctionalComponent<Props> = ({
	track,
	hideTracklist = false,
	isSelected = false,
	isPlayingTrack = false,
	isPausedTrack = false,
	rowTemplate,
	currentTime,
	duration,
	onTrackClick,
	onSeekClick,
	children,
}) => {
	const progressPercent =
		(isPlayingTrack || isPausedTrack) && duration
			? Math.max(0, Math.min((currentTime ?? 0) / duration, 1)) * 100
			: 0

	const progressOverlayColor = isPlayingTrack
		? "rgba(121, 187, 255, 0.45)"
		: "rgba(121, 187, 255, 0.25)"

	const rowStyle = rowTemplate
		? {
			cursor: "pointer",
			display: "grid",
			gridTemplateColumns: rowTemplate,
		}
		: { cursor: "pointer", display: "flex" }

	const progressStyle =
		isPlayingTrack || isPausedTrack
			? {
				...rowStyle,
				position: "relative" as const,
				backgroundImage: `linear-gradient(to right, ${progressOverlayColor} ${progressPercent}%, transparent ${progressPercent}%)`,
			}
			: rowStyle

	return (
		<li
			role="button"
			onClick={() => onTrackClick?.(track)}
			className={`${TracklistTrackWrapper} ${isSelected ? "active" : ""}`}
		>
			{/* Visualizer overlay when actively playing */}
			{isPlayingTrack && (
				<div style={{ position: "absolute", top: "0px" }}>
					<PlayerVisualizer width={600} height={27} />
				</div>
			)}

			{/* Track Content Wrapper */}
			<div className={PlayerLibraryColumnLabel} style={{ width: "100%" }}>
				<div style={progressStyle}>
					{children ?? <span className="track-title">{track.title}</span>}
				</div>

				{/* Sub-tracklist timestamp seek links */}
				{!hideTracklist && track.tracklist && (
					<ul className={SubTracklist}>
						{track.tracklist.map((trackItem) => (
							<li key={trackItem.title}>
								<a
									onClick={(event) => {
										event.stopPropagation()
										onSeekClick?.(track, trackItem.time)
									}}
									style={{ cursor: "pointer" }}
									role="button"
								>
									{trackItem.title} ({trackItem.time})
								</a>
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Download MP3 Button */}
			{track.files?.[0] && (
				<a
					style={{
						marginLeft: "auto",
						display: "flex",
						justifyContent: "center",
						width: "100%",
					}}
					title={"Download MP3: " + track.title}
					href={track.files[0]}
					target="_blank"
					onClick={(event) => event.stopPropagation()}
				>
					<DownloadIcon height={"1.5rem"} />
				</a>
			)}
		</li>
	)
}

export default TrackListTrack
