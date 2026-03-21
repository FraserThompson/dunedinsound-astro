/**
 * A player in the style of winamp with a tracklist in the sidebar and a space for content.
 * 
 * Props:
 *  - Title: Displayed at the top of the window.
 *  - artistAudio: Audio array.
 *  - playOnLoad (optional): If true, will start playing immediately.
 *  - sidebar (optional): An extra sidebar block (use slot="sidebar").
 */

import type { FunctionalComponent } from "preact"
import type { ArtistAudio } from "src/util/collection"
import PlayerProvider from "../player/PlayerProvider"
import PlayerTransport from "../player/PlayerTransport"
import PlayerWaveform from "../player/PlayerWaveform"
import PlayerTracklist from "../player/PlayerTracklist"
import { PlayerSidebarTracklist, PlayerSidebarWrapper, PlayerSidebarSidebarWrapper, PlayerSidebarWaveWrapper, PlayerSidebarContentWrapper, PlayerSidebarBottomWrapper, PlayerSidebarChildrenWrapper, PlayerSiderMenubar } from "./SidebarPlayer.css"
import { WinampTitlebar } from "./CompactPlayer.css"
import PlayerCurrentTrack from "../player/PlayerCurrentTrack"

interface Props {
	title: string
	artistAudio?: ArtistAudio[]
	playOnLoad?: boolean,
	sidebar?: HTMLElement
	menu?: HTMLElement
}

const PlayerSidebar: FunctionalComponent<Props> = ({ title, artistAudio, playOnLoad, sidebar, menu, children }) => (
	<PlayerProvider artistAudio={artistAudio} playOnLoad={playOnLoad}>
		<div class={PlayerSidebarWrapper}>
			<div className={WinampTitlebar} data-title={title.toLocaleUpperCase()} />
			{menu && 
				<div className={PlayerSiderMenubar}>
					{menu}
				</div>
			}
			<div class={PlayerSidebarWaveWrapper}>
				<PlayerWaveform />
				<div style={{ display: "flex", marginTop: "5px" }}>
					<PlayerTransport showShuffle={true} />
					<div style={{ marginLeft: "5px" }}>
						<PlayerCurrentTrack />
					</div>
				</div>
			</div>
			<div class={PlayerSidebarBottomWrapper}>
				<div class={PlayerSidebarSidebarWrapper}>
					{sidebar &&
						<div class={PlayerSidebarTracklist}>
							<div className={WinampTitlebar} data-title="PLAYLIST" />
							{sidebar}
						</div>
					}
					<div class={PlayerSidebarTracklist} style={{ flexGrow: 1 }}>
						<div className={WinampTitlebar} data-title="PLAYLIST" />
						<PlayerTracklist maxHeight="30svh" maxHeightDesktop="100%" />
					</div>
				</div>
				{children && <div class={`${PlayerSidebarContentWrapper} flex`}>
					<div className={WinampTitlebar} data-title="CONTENT" />
					<div className={PlayerSidebarChildrenWrapper}>
						{children}
					</div>
				</div>}
			</div>
		</div>
	</PlayerProvider>
)

export default PlayerSidebar
