/**
 * A player in the style of winamp with a tracklist in the sidebar and a space for content.
 * 
 * Props:
 *  - Title: Displayed at the top of the window.
 *  - playerAudio: Audio array.
 * 	- artistOptions: Artist filter options for the library.
 *  - venueOptions: Venue filter options for the library.
 *  - initialArtistId: The artist selected initially.
 *  - initialVenueId: The venue selected initially.
 *  - waveform: The waveform element.
 *  - children: Content to put in the arbitrary "content" panel.
 *  - footer: An element to put in the footer of the "content" panel.
 */

import type { FunctionalComponent } from "preact"
import type { PlayerAudio } from "@src/util/collection"
import PlayerTransport from "./player/PlayerTransport"
import PlayerTracklist from "./player/PlayerTracklist"
import {
	LibraryPlayerPlaylistWrapper,
	LibraryPlayerWrapper,
	LibraryPlayerSidebarWrapper,
	LibraryPlayerWaveWrapper,
	LibraryPlayerContentWrapper,
	LibraryPlayerBottomWrapper,
	LibraryPlayerChildrenWrapper,
} from "./LibraryPlayer.css"
import { WinampTitlebar } from "./CompactPlayer.css"
import PlayerCurrentTrack from "./player/PlayerCurrentTrack"
import PlayerLibrary from "./player/PlayerLibrary"
import type { PlayerLibraryFilterOption } from "./player/PlayerLibraryFilters"
import { getCurrentScreensize } from "@src/util/helpers"
import { useEffect, useState } from "preact/hooks"
import { playerContainerToggle, type PlayerContainerToggleEventDetails } from "@src/util/events"

interface Props {
	title: string
	playerAudio?: PlayerAudio[]
	artistOptions?: PlayerLibraryFilterOption[]
	venueOptions?: PlayerLibraryFilterOption[]
	initialArtistId?: string
	initialVenueId?: string
	waveform?: HTMLElement
	footer?: HTMLElement
}

const LibraryPlayer: FunctionalComponent<Props> = ({
	title,
	playerAudio,
	artistOptions,
	venueOptions,
	initialArtistId,
	initialVenueId,
	waveform,
	children,
	footer
}) => {
	const [playerOpenedPadding, setPlayerOpenedPadding] = useState(null as number | null)

	// When the mini-player opens this will move the library up on mobile.
	const onPlayerOpen = (e: any) => {
		const detail = e.detail as PlayerContainerToggleEventDetails
		if (detail.open) {
			const height = e.target.getBoundingClientRect().height
			setPlayerOpenedPadding(height)
		} else {
			setPlayerOpenedPadding(null)
		}
	}

	useEffect(() => {
		const playerWrapper = document.querySelector<HTMLElement>("player-wrapper") as
			| (HTMLElement & { open?: boolean })
			| null

		if (!playerWrapper) return

		// On mobile we want the mini player to be visible, on desktop we dont want it at all
		if ("visible" in playerWrapper) {
			if (getCurrentScreensize() === 'xs') {
				playerWrapper.visible = true
				playerWrapper.addEventListener(playerContainerToggle, onPlayerOpen)
				const height = playerWrapper.getBoundingClientRect().height
				if (playerWrapper.open) {
					setPlayerOpenedPadding(height)
				}
			} else {
				playerWrapper.remove()
			}
		}
		return () => playerWrapper.removeEventListener(playerContainerToggle, onPlayerOpen)
	}, [])

	return (
		<div class={`${LibraryPlayerWrapper}`} style={{ paddingBottom: playerOpenedPadding }}>
			<div className={WinampTitlebar} data-title={title.toLocaleUpperCase()} />
			<div class={`${LibraryPlayerWaveWrapper} hideMobile`}>
				{waveform ?? <div style={{ minHeight: "65px" }} />}
				<div style={{ display: "flex", marginTop: "5px" }}>
					<PlayerTransport />
					<div style={{ marginLeft: "5px" }}>
						<PlayerCurrentTrack />
					</div>
				</div>
			</div>
			<div class={LibraryPlayerBottomWrapper}>
				<div class={`${LibraryPlayerSidebarWrapper}`}>
					<PlayerLibrary
						playerAudio={playerAudio}
						artistOptions={artistOptions}
						venueOptions={venueOptions}
						initialArtistId={initialArtistId}
						initialVenueId={initialVenueId}
						maxHeight="100%"
						maxHeightDesktop="100%"
					/>
				</div>
				{children && <div class={`${LibraryPlayerContentWrapper} flex hideMobile`}>
					<div className={WinampTitlebar} data-title="PREVIEW" />
					<div className={LibraryPlayerChildrenWrapper}>
						{children}
					</div>
					{footer && <div>
						{footer}
					</div>}
				</div>}
				<div class={`${LibraryPlayerPlaylistWrapper} flex hideMobile`}>
					<div className={WinampTitlebar} data-title="PLAYLIST" />
					<PlayerTracklist maxHeight="100%" maxHeightDesktop="100%" showClear={true} showShuffle={true} />
				</div>
			</div>
		</div>
	)
}

export default LibraryPlayer
