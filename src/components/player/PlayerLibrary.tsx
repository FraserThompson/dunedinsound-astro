/**
 * Library of all audio on the website with virtualized list rendering.
 */

import type { FunctionalComponent } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
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
	rowHeight?: number
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
	columnTemplate = 'minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)',
	artistOptions = [],
	venueOptions = [],
	initialArtistId,
	initialVenueId,
	maxWidth,
	maxHeight = "160px",
	title,
	maxHeightDesktop,
	rowHeight = 24,
}) => {
	const {
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

	// Virtualization state
	const scrollRef = useRef<HTMLUListElement>(null)
	const [scrollTop, setScrollTop] = useState(0)
	const [containerHeight, setContainerHeight] = useState(300)

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

	// Reset scroll top when filter changes so you aren't stuck scrolled down
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = 0
			setScrollTop(0)
		}
	}, [selectedArtistId, selectedVenueId])

	// Track scroll position for virtualization window
	useEffect(() => {
		const container = scrollRef.current
		if (!container) return

		const handleScroll = () => setScrollTop(container.scrollTop)
		const handleResize = () => setContainerHeight(container.clientHeight)

		handleResize()
		container.addEventListener("scroll", handleScroll, { passive: true })
		window.addEventListener("resize", handleResize)

		return () => {
			container.removeEventListener("scroll", handleScroll)
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	// Calculate visible row window
	const overscan = 5 // Extra rows above and below to prevent flashing while scrolling
	const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
	const visibleCount = Math.ceil(containerHeight / rowHeight) + 2 * overscan
	const endIndex = Math.min(filteredItems.length, startIndex + visibleCount)

	const visibleItems = filteredItems.slice(startIndex, endIndex)
	const paddingTop = startIndex * rowHeight
	const paddingBottom = Math.max(0, (filteredItems.length - endIndex) * rowHeight)

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

				{/* Virtualized Tracklist */}
				<ul
					ref={scrollRef}
					className={TracklistWrapper}
					style={assignInlineVars({
						[maxHeightVar]: maxHeight,
						[maxHeightDesktopVar]: maxHeightDesktop,
					})}
				>
					{!filteredItems.length && (
						<li className="tracklist-track">No tracks match this filter.</li>
					)}

					{/* Top Virtual Spacer */}
					{paddingTop > 0 && <li style={{ height: `${paddingTop}px`, pointerEvents: 'none' }} aria-hidden="true" />}

					{/* Visible Track Window */}
					{visibleItems.map((track) => {
						const inPlaylistIndex = findTrackInPlayerPlaylist(track)
						const isSelected = track.id === selectedTrackId
						const isGlobalSelectedTrack = !!track.id && track.id === selectedId && inPlaylistIndex === selectedTrack
						const isPlayingTrack = isGlobalSelectedTrack && playing
						const isPausedTrack = isGlobalSelectedTrack && !playing && !!currentTime
						return (
							<TracklistTrack
								key={track.id}
								track={track}
								hideTracklist={true}
								isSelected={isSelected}
								isPlayingTrack={isPlayingTrack}
								isPausedTrack={isPausedTrack}
								currentTime={currentTime}
								duration={duration}
								onTrackClick={onTrackClick}
								rowTemplate={columnTemplate}
							>
								{columns.map((column) => (
									<span key={column}>{track[column]?.title}</span>
								))}
							</TracklistTrack>
						)
					})}

					{/* Bottom Virtual Spacer */}
					{paddingBottom > 0 && <li style={{ height: `${paddingBottom}px`, pointerEvents: 'none' }} aria-hidden="true" />}
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
