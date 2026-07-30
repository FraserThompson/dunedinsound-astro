/**
 * Library of all audio on the website.
 * 
 * Props:
 *  - playerAudio: Array of audio to display in library.
 *  - columns: What columns to display (artist, gig, and venue by default)
 *  - columnTemplate: CSS grid template for columns.
 *  - artistOptions: List of artists for filtering.
 *  - venueOptions: List of venues for filtering.
 *  - initialArtistId: Artist which should be selected initially.
 *  - initialVenueId: Venue which should be selected initially.
 *  - title: Title to show in header.
 *  - maxWidth: the max width
 *  - maxHeight: the max height
 *  - maxHeightDesktop: the max height on desktop.
 */

import type { FunctionalComponent } from "preact"
import { useState } from "preact/hooks"
import { assignInlineVars } from "@vanilla-extract/dynamic"
import type { PlayerAudio } from "@src/util/collection"
import { usePlayer } from "./usePlayer"
import { WinampTitlebar } from "../CompactPlayer.css"
import {
	TracklistWrapper,
	maxHeightVar,
	maxHeightDesktopVar,
} from "@src/components/player/PlayerTracklist.css"
import {
	PlayerLibraryContainer,
	PlayerLibraryControls,
	PlayerLibraryHeaderButton,
	PlayerTableHeader,
} from './PlayerLibrary.css'
import { playerLibraryPreviewEventName, type PlayerLibraryPreviewEventDetails } from "@src/util/events"
import {
	PlayerLibraryFilters,
	ALL_FILTER_ID,
	type PlayerLibraryFilterOption,
} from "./PlayerLibraryFilters"
import { PlayerLibraryActionButtons } from "./PlayerLibraryActionButtons"
import TracklistTrack from "./PlayerTracklistTrack"

type ValidColumn = 'artist' | 'gig' | 'venue'

interface Props {
	playerAudio?: PlayerAudio[]
	columns?: ValidColumn[]
	columnTemplate?: string
	artistOptions?: PlayerLibraryFilterOption[]
	venueOptions?: PlayerLibraryFilterOption[]
	initialArtistId?: string
	initialVenueId?: string
	title?: string
	maxWidth?: string
	maxHeight?: string
	maxHeightDesktop?: string
}

const matchesFilter = (item: PlayerAudio, artistId: string, venueId: string) => {
	const matchesArtist = artistId === ALL_FILTER_ID || item.artist?.id === artistId
	const matchesVenue = venueId === ALL_FILTER_ID || item.venue?.id === venueId
	return matchesArtist && matchesVenue
}

const getOptionCount = (items: PlayerAudio[], options: PlayerLibraryFilterOption[], kind: 'artist' | 'venue') => {
	return options.reduce<Record<string, number>>((acc, option) => {
		acc[option.id] = items.filter((item) => kind === 'artist' ? item.artist?.id === option.id : item.venue?.id === option.id).length
		return acc
	}, {})
}

export const PlayerLibrary: FunctionalComponent<Props> = ({
	playerAudio = [],
	columns = ['artist', 'gig', 'venue'],
	columnTemplate = 'minmax(0, 1.5fr) minmax(0, 2fr) minmax(0, 1fr)',
	artistOptions = [],
	venueOptions = [],
	initialArtistId,
	initialVenueId,
	maxWidth,
	maxHeight = "160px",
	title,
	maxHeightDesktop
}) => {
	const {
		seekToTime,
		selectTrack,
		selectedTrack,
		currentTime,
		duration,
		addTracksToPlaylist,
		playlist,
		playing,
	} = usePlayer()

	const [selectedArtistId, setSelectedArtistId] = useState(initialArtistId || ALL_FILTER_ID)
	const [selectedVenueId, setSelectedVenueId] = useState(initialVenueId || ALL_FILTER_ID)
	const [selectedTrackId, setSelectedTrackId] = useState('')

	const venueFilteredItems = playerAudio.filter((item) => selectedVenueId === ALL_FILTER_ID || item.venue?.id === selectedVenueId)
	const artistFilteredItems = playerAudio.filter((item) => selectedArtistId === ALL_FILTER_ID || item.artist?.id === selectedArtistId)
	const filteredItems = playerAudio.filter((item) => matchesFilter(item, selectedArtistId, selectedVenueId))

	const artistCounts = getOptionCount(venueFilteredItems, artistOptions, 'artist')
	const venueCounts = getOptionCount(artistFilteredItems, venueOptions, 'venue')
	const availableArtistOptions = artistOptions.filter((option) => (artistCounts[option.id] ?? 0) > 0 || selectedArtistId === option.id)
	const availableVenueOptions = venueOptions.filter((option) => (venueCounts[option.id] ?? 0) > 0 || selectedVenueId === option.id)

	const selectedItem = filteredItems.find((item) => item.id === selectedTrackId)
	const selectedId = playlist[selectedTrack]?.id

	const findTrackInPlayerPlaylist = (track: PlayerAudio) => playlist.findIndex((item) => item.id === track.id)

	// Opens <player-wrapper>
	const openGlobalPlayer = () => {
		const playerWrapper = document.querySelector<HTMLElement>("player-wrapper") as
			| (HTMLElement & { open?: boolean })
			| null

		if (playerWrapper && "open" in playerWrapper) {
			playerWrapper.open = true
		}
	}

	// Plays track or add+play it if missing
	const playTrack = (track: PlayerAudio) => {
		if (!playlist.length) {
			openGlobalPlayer()
		}
		const existingIndex = findTrackInPlayerPlaylist(track)
		if (existingIndex >= 0) {
			selectTrack(existingIndex, true)
		} else {
			addTracksToPlaylist([track], true)
		}
	}

	// Track selection & preview event dispatching
	const onTrackClick = (item: PlayerAudio) => {
		setSelectedTrackId(item.id)

		if (item.artist && item.gig) {
			const detail: PlayerLibraryPreviewEventDetails = {
				artist: item.artist,
				gig: item.gig,
			}
			window.dispatchEvent(new CustomEvent(playerLibraryPreviewEventName, { detail }))
		}
	}

	// Timestamp seeking handler
	const onSeekClick = (track: PlayerAudio, time: string) => {
		const existingIndex = findTrackInPlayerPlaylist(track)
		if (existingIndex >= 0) {
			// Pass existingIndex directly to ensure we seek on the exact target track
			selectTrack(existingIndex, true, time)
		} else {
			addTracksToPlaylist([track], true)
			// Delay seek slightly or pass timestamp through state if possible
			seekToTime(time)
		}
		setSelectedTrackId(track.id)
		openGlobalPlayer()
	}

	// Action button click handlers
	const onPlayAllClick = () => {
		if (filteredItems.length > 0) {
			if (!playlist.length) {
				openGlobalPlayer()
			}
			addTracksToPlaylist(filteredItems, true)
			setSelectedTrackId(filteredItems[0].id)
		}
	}

	const onAddAllClick = () => {
		if (filteredItems.length > 0) {
			addTracksToPlaylist(filteredItems, false)
		}
	}

	const onPlaySelectedClick = () => {
		if (selectedItem) {
			playTrack(selectedItem)
		}
	}

	const onAddSelectedClick = () => {
		if (selectedItem) {
			addTracksToPlaylist([selectedItem], false)
		}
	}

	return (
		<div className={PlayerLibraryContainer} style={{ maxWidth: maxWidth }}>
			<div className={WinampTitlebar} style={{ flexShrink: 0 }} data-title={title || "AUDIO LIBRARY"} />
			{(availableArtistOptions.length > 0 || availableVenueOptions.length > 0) && (
				<PlayerLibraryFilters
					artistOptions={availableArtistOptions}
					venueOptions={availableVenueOptions}
					selectedArtistId={selectedArtistId}
					selectedVenueId={selectedVenueId}
					onSelectArtist={setSelectedArtistId}
					onSelectVenue={setSelectedVenueId}
					venueFilteredCount={venueFilteredItems.length}
					artistFilteredCount={artistFilteredItems.length}
					artistCounts={artistCounts}
					venueCounts={venueCounts}
				/>
			)}
			<div className={PlayerLibraryControls}>
				{/* Header row */}
				<div className={PlayerTableHeader} style={{ gridTemplateColumns: columnTemplate + ' minmax(0, 0.5fr)' }}>
					{columns.map((column) => (
						<div key={column} className={PlayerLibraryHeaderButton}>
							{column.toLocaleUpperCase()}
						</div>
					))}
					<div className={PlayerLibraryHeaderButton}>
						FILE
					</div>
				</div>
				{/* Tracklist */}
				<ul
					className={TracklistWrapper}
					style={assignInlineVars({
						[maxHeightVar]: maxHeight,
						[maxHeightDesktopVar]: maxHeightDesktop,
					})}
				>
					{!filteredItems.length && (
						<li className="tracklist-track">No tracks match this filter.</li>
					)}
					{filteredItems.map((track) => {
						const inPlaylistIndex = findTrackInPlayerPlaylist(track)
						const isSelected = track.id === selectedTrackId
						const isGlobalSelectedTrack = !!track.id && track.id === selectedId && inPlaylistIndex === selectedTrack
						const isPlayingTrack = isGlobalSelectedTrack && playing
						const isPausedTrack = isGlobalSelectedTrack && !playing && !!currentTime
						return (
							<TracklistTrack
								key={track.id}
								track={track}
								isSelected={isSelected}
								isPlayingTrack={isPlayingTrack}
								isPausedTrack={isPausedTrack}
								currentTime={currentTime}
								duration={duration}
								onTrackClick={onTrackClick}
								onSeekClick={onSeekClick}
								rowTemplate={columnTemplate}
							>
								{columns.map((column) => (
									<span key={column}>{track[column]?.title}</span>
								))}
							</TracklistTrack>
						)
					})}
				</ul>

				{/* Bottom Action Bar */}
				<PlayerLibraryActionButtons
					onPlayAll={onPlayAllClick}
					onAddAll={onAddAllClick}
					onPlaySelected={onPlaySelectedClick}
					onAddSelected={onAddSelectedClick}
					hasTracks={filteredItems.length > 0}
					hasSelection={!!selectedItem}
				/>
			</div>
		</div>
	)
}

export default PlayerLibrary
