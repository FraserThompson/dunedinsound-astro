/**
 * Global compact player used by the persistent docked player.
 *
 * This version binds to the shared player store/runtime.
 */

import type { FunctionalComponent } from "preact"
import type { PlayerAudio } from "@src/util/collection"
import PlayerTransport from "./player/PlayerTransport"
import PlayerTracklist from "./player/PlayerTracklist"
import { AudioWrapper, CompactPlayerWaveWrapper, CompactPlayerWrapper, WinampTitlebar } from "./CompactPlayer.css"
import { useEffect } from "preact/hooks"
import { usePlayer } from "./player/usePlayer"

interface Props {
	title?: string
	playerAudio?: PlayerAudio[]
	waveform?: HTMLElement
}

const GlobalPlayer: FunctionalComponent<Props> = ({ title = "AUDIO PLAYER", playerAudio, waveform }) => {
	const { setPlaylist } = usePlayer()

	useEffect(() => {
		if (!playerAudio?.length) return
		setPlaylist(playerAudio)
	}, [playerAudio])

	return (
		<div className={CompactPlayerWrapper}>
			<div className={WinampTitlebar} style={{ marginRight: '40px' }} data-title={title} />
			<div className={CompactPlayerWaveWrapper}>
				<div className={AudioWrapper}>
					<PlayerTransport />
					{waveform ?? <div style={{ flexGrow: 1, minWidth: 0, minHeight: "65px" }} />}
				</div>
			</div>
			<div className={CompactPlayerWaveWrapper}>
				<PlayerTracklist showClear={true} showShuffle={true} maxHeight={'240px'} />
			</div>
		</div>
	)
}

export default GlobalPlayer
