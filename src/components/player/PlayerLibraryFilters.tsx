/**
 * Filters displayed in the library.
 * 
 * This includes venues and artists.
 */

import type { FunctionalComponent } from "preact"
import { useRef, useEffect } from "preact/hooks"
import { TracklistWrapper } from "@src/components/player/PlayerTracklist.css"
import {
	PlayerLibraryColumnLabel,
	PlayerLibraryHeaderButton,
	PlayerTableHeader,
} from "@src/components/player/PlayerLibrary.css"
import { PlayerLibraryFiltersWrapper, PlayerLibraryColumn } from "./PlayerLibraryFilters.css"
import { TracklistTrackWrapper } from "./PlayerTracklistTrack.css"

export interface PlayerLibraryFilterOption {
	id: string
	title: string
	count?: number
}

interface Props {
	artistOptions: PlayerLibraryFilterOption[]
	venueOptions: PlayerLibraryFilterOption[]
	selectedArtistId: string
	selectedVenueId: string
	onSelectArtist: (id: string) => void
	onSelectVenue: (id: string) => void
	venueFilteredCount: number
	artistFilteredCount: number
	artistCounts: Record<string, number>
	venueCounts: Record<string, number>
}

export const ALL_FILTER_ID = 'all'

// Helper to scroll the active child element into view within its parent scroll container
const scrollToActive = (container: HTMLElement | null) => {
	if (!container) return
	const activeEl = container.querySelector<HTMLElement>('.active')
	if (!activeEl) return

	const elTop = activeEl.offsetTop
	const elBottom = elTop + activeEl.offsetHeight
	const containerTop = container.scrollTop
	const containerBottom = containerTop + container.clientHeight

	if (elTop < containerTop) {
		container.scrollTop = elTop
	} else if (elBottom > containerBottom) {
		container.scrollTop = elBottom - container.clientHeight
	}
}

export const PlayerLibraryFilters: FunctionalComponent<Props> = ({
	artistOptions,
	venueOptions,
	selectedArtistId,
	selectedVenueId,
	onSelectArtist,
	onSelectVenue,
	venueFilteredCount,
	artistFilteredCount,
	artistCounts,
	venueCounts,
}) => {
	const artistListRef = useRef<HTMLUListElement>(null)
	const venueListRef = useRef<HTMLUListElement>(null)

	// Scroll active artist into view on initial mount or selection change
	useEffect(() => {
		scrollToActive(artistListRef.current)
	}, [selectedArtistId, artistOptions])

	// Scroll active venue into view on initial mount or selection change
	useEffect(() => {
		scrollToActive(venueListRef.current)
	}, [selectedVenueId, venueOptions])

	return (
		<div className={PlayerLibraryFiltersWrapper}>
			<div className={PlayerLibraryColumn}>
				<div className={PlayerTableHeader}>
					<div className={PlayerLibraryHeaderButton}>Artist</div>
				</div>
				<ul ref={artistListRef} className={TracklistWrapper}>
					<li
						role="button"
						onClick={() => onSelectArtist(ALL_FILTER_ID)}
						className={selectedArtistId === ALL_FILTER_ID ? `${TracklistTrackWrapper} active` : TracklistTrackWrapper}
					>
						<span className={PlayerLibraryColumnLabel}>ALL ({venueFilteredCount})</span>
					</li>
					{artistOptions.map((option) => (
						<li
							key={option.id}
							role="button"
							onClick={() => onSelectArtist(option.id)}
							className={selectedArtistId === option.id ? `${TracklistTrackWrapper} active` : TracklistTrackWrapper}
						>
							<span className={PlayerLibraryColumnLabel}>
								{option.title} ({artistCounts[option.id] ?? option.count ?? 0})
							</span>
						</li>
					))}
				</ul>
			</div>
			<div className={PlayerLibraryColumn}>
				<div className={PlayerTableHeader}>
					<div className={PlayerLibraryHeaderButton}>Venue</div>
				</div>
				<ul ref={venueListRef} className={TracklistWrapper}>
					<li
						role="button"
						onClick={() => onSelectVenue(ALL_FILTER_ID)}
						className={selectedVenueId === ALL_FILTER_ID ? `${TracklistTrackWrapper} active` : TracklistTrackWrapper}
					>
						<span className={PlayerLibraryColumnLabel}>ALL ({artistFilteredCount})</span>
					</li>
					{venueOptions.map((option) => (
						<li
							key={option.id}
							role="button"
							onClick={() => onSelectVenue(option.id)}
							className={selectedVenueId === option.id ? `${TracklistTrackWrapper} active` : TracklistTrackWrapper}
						>
							<span className={PlayerLibraryColumnLabel}>
								{option.title} ({venueCounts[option.id] ?? option.count ?? 0})
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
