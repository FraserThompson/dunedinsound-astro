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
import { WinampTitlebar } from "./CompactPlayer.css"
import PlayerCurrentTrack from "../player/PlayerCurrentTrack"

interface Props {
	title: string
	artistAudio: ArtistAudio[]
	playOnLoad?: boolean
}

const PlayerSidebar: FunctionalComponent<Props> = ({ title, artistAudio, playOnLoad, children }) => (
	<PlayerProvider artistAudio={artistAudio} playOnLoad={playOnLoad}>
		<div class={PlayerSidebarWrapper}>
			<div className={WinampTitlebar} data-title={title.toLocaleUpperCase()} />
			<div class={PlayerSidebarWaveWrapper}>
				<PlayerWaveform />
				<div style={{ display: "flex", marginTop: "5px" }}>
					<PlayerTransport />
					<div style={{ marginLeft: "5px" }}>
						<PlayerCurrentTrack />
					</div>
				</div>
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
