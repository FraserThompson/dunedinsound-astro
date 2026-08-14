/**
 * A track displayed in a tracklist (and the library).
 * 
 * Props:
 *  - track: The track to display.
 *  - hideTracklist: Whether to hide the subtracklist.
 *  - isSelected: Whether it's selected.
 *  - isPlayingTrack: Whether it's playing.
 *  - isPausedTrack: Whether it's paused.
 *  - columnTemplate: A CSS grid template string to encapsulate the row.
 *  - currentTime: The current time if it's playing.
 *  - duration: The duration.
 *  - subMenuMode: In playlist mode there is a remove button.
 *     In library mode there are links to track metadata pages.
 *  - onTrackClick: Handler for when a track is clicked.
 *  - onSeekClick: Handler for when a sub-playlist is seeked.
 *  - children: Content shown inside each track.
 * 
 */

import type { ComponentChildren, FunctionalComponent } from "preact"
import { useState } from "preact/hooks"
import type { PlayerAudio } from "@src/util/collection"
import PlayerVisualizer from "./PlayerVisualizer"
import { PlayerLibraryColumnLabel } from "@src/components/player/PlayerLibrary.css"
import {
	SubTracklist,
	TrackActionButton,
	TracklistTrackWrapper,
} from "./PlayerTracklistTrack.css"
import { playerLibraryPreviewEventName, type PlayerLibraryPreviewEventDetails } from "@src/util/events"
import PlayIcon from '~icons/iconoir/play'
import PauseIcon from '~icons/iconoir/pause'
import PlayerTracklistTrackSubmenu from "./PlayerTracklistTrackSubmenu"

interface Props {
	track: PlayerAudio
	hideTracklist?: boolean
	isSelected?: boolean
	isInPlaylist?: boolean
	isPlayingTrack?: boolean
	isPausedTrack?: boolean
	columnTemplate?: string
	currentTime?: number
	duration?: number
	subMenuMode?: 'playlist' | 'library'
	onAddClick?: (track: PlayerAudio) => void
	onRemoveClick?: (track: PlayerAudio) => void
	onTrackClick?: (track: PlayerAudio) => void
	onSeekClick?: (track: PlayerAudio, time: string) => void
	children?: ComponentChildren
}

export const TrackListTrack: FunctionalComponent<Props> = ({
	track,
	hideTracklist = false,
	isSelected = false,
	isInPlaylist = false,
	isPlayingTrack = false,
	isPausedTrack = false,
	columnTemplate,
	currentTime,
	duration,
	subMenuMode = 'playlist',
	onAddClick,
	onRemoveClick,
	onTrackClick,
	onSeekClick,
	children,
}) => {
	const [menuOpen, setMenuOpen] = useState(false)

	const onClick = () => {
		onTrackClick?.(track)
		if (track.artist && track.gig) {
			const detail: PlayerLibraryPreviewEventDetails = {
				artist: track.artist,
				gig: track.gig,
			}
			window.dispatchEvent(new CustomEvent(playerLibraryPreviewEventName, { detail }))
		}
	}

	const progressPercent =
		(isPlayingTrack || isPausedTrack) && duration
			? Math.max(0, Math.min((currentTime ?? 0) / duration, 1)) * 100
			: 0

	const progressOverlayColor = isPlayingTrack
		? "rgba(121, 187, 255, 0.45)"
		: "rgba(121, 187, 255, 0.25)"

	const rowStyle = columnTemplate
		? {
			cursor: "pointer",
			display: "grid",
			gap: "3px",
			gridTemplateColumns: columnTemplate,
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
			title="Play track"
			onClick={onClick}
			className={`${TracklistTrackWrapper} ${(isSelected || menuOpen || isPlayingTrack || isPausedTrack) ? "active" : ""}`}
		>
			{/* Visualizer overlay when actively playing */}
			{isPlayingTrack && (
				<div style={{ position: "absolute", top: "0px" }}>
					<PlayerVisualizer width={600} height={27} />
				</div>
			)}

			{/* Play icon */}
			<div className={`${TrackActionButton}`}>
				{!isPlayingTrack && <PlayIcon />}
				{isPlayingTrack && <PauseIcon />}
			</div>

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

			<PlayerTracklistTrackSubmenu
				track={track}
				isInPlaylist={isInPlaylist}
				subMenuMode={subMenuMode}
				onAddClick={onAddClick}
				onRemoveClick={onRemoveClick}
				onMenuOpenChange={setMenuOpen}
			/>
		</li>
	)
}

export default TrackListTrack
