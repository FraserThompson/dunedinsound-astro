/**
 * A player in the style of winamp with a tracklist in the sidebar and a space for content.
 */

import type { FunctionalComponent } from "preact"
import type { ArtistAudio } from "src/util/collection"
import PlayerProvider from "../player/PlayerProvider"
import PlayerTransport from "../player/PlayerTransport"
import PlayerWaveform from "../player/PlayerWaveform"
import PlayerTracklist from "../player/PlayerTracklist"
import { PlayerSidebarTracklist, PlayerSidebarWrapper, PlayerSidebarWaveWrapper, PlayerSidebarContentWrapper, PlayerSidebarBottomWrapper, PlayerSidebarChildrenWrapper } from "./SidebarPlayer.css"
import { WinampTitlebar } from "./WinampPlayer.css"

interface Props {
	artistTitle: string
	artistAudio: ArtistAudio[]
	playOnLoad?: boolean
}

const PlayerSidebar: FunctionalComponent<Props> = ({ artistTitle, artistAudio, playOnLoad, children }) => (
	<PlayerProvider artistAudio={artistAudio} playOnLoad={playOnLoad}>
		<div class={PlayerSidebarWrapper}>
			<div id="player-title" className={WinampTitlebar} data-title={artistTitle.toLocaleUpperCase()} />
			<div class={PlayerSidebarWaveWrapper}>
				<PlayerWaveform />
				<PlayerTransport />
			</div>
			<div class={PlayerSidebarBottomWrapper}>
				<div class={PlayerSidebarTracklist}>
					<div className={WinampTitlebar} data-title="PLAYLIST" />
					<PlayerTracklist />
				</div>
				<div class={PlayerSidebarContentWrapper}>
					<div className={WinampTitlebar} data-title="CONTENT" />
					<div className={PlayerSidebarChildrenWrapper}>
						{children}
					</div>
				</div>
			</div>
		</div>
	</PlayerProvider>
)

export default PlayerSidebar
