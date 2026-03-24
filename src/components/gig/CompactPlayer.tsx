/**
 * A simple player in the style of winamp with a tracklist and waveform.
 */

import type { FunctionalComponent } from "preact"
import type { ArtistAudio } from "src/util/collection"
import PlayerProvider from "../player/PlayerProvider"
import PlayerTransport from "../player/PlayerTransport"
import PlayerWaveform from "../player/PlayerWaveform"
import PlayerTracklist from "../player/PlayerTracklist"
import { AudioWrapper, CompactPlayerWrapper, WinampTitlebar } from "./CompactPlayer.css"

interface Props {
	title?: string
	artistAudio: ArtistAudio[]
	playOnLoad?: boolean
}

const CompactPlayer: FunctionalComponent<Props> = ({ title = "AUDIO PLAYER", artistAudio, playOnLoad }) => {
	return (
		<PlayerProvider artistAudio={artistAudio} playOnLoad={playOnLoad}>
			<div className={CompactPlayerWrapper}>
				<div className={WinampTitlebar} data-title={title}/>
				<div className={AudioWrapper}>
					<PlayerTransport />
					<PlayerWaveform />
				</div>
				<div style={{ margin: "5px" }}>
					<PlayerTracklist maxHeight={'160px'} />
				</div>
			</div>
		</PlayerProvider>
	)
}

export default CompactPlayer
