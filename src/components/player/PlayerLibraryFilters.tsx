/**
 * Filters displayed in the library.
 * 
 * This includes venues and artists.
 * 
 * Props:
 *  - artistOptions: List of artists for filtering.
 *  - venueOptions: List of venues for filtering.
 *  - selectedArtistId: Which artist is selected.
 *  - selectedVenueId: Which venue is selected.
 *  - onSelectArtist: Handler for when an artist is selected.
 *  - onSelectVenue: Handler for when an venue is selected.
 *  - venueFilteredCount: Count of tracks matching current venue filter.
 *  - artistFilteredCount: Count of tracks matching current artist filter.
 *  - artistCounts: Counts of gigs matching each artist.
 *  - venueCounts: Counts of gigs matching each venue.
 */

import type { FunctionalComponent } from "preact"
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
	return (
		<div className={PlayerLibraryFiltersWrapper}>
			<div className={PlayerLibraryColumn}>
				<div className={PlayerTableHeader}>
					<div className={PlayerLibraryHeaderButton}>Artist</div>
				</div>
				<ul className={TracklistWrapper}>
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
				<ul className={TracklistWrapper}>
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
