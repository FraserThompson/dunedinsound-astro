/**
 * The tracklist for the player. 
 * 
 * Must be instantiated inside a PlayerProvider.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./PlayerContext"
import DownloadIcon from '~icons/iconoir/download'
import { TracklistTrack, TracklistWrapper, TrackButton, maxHeightVar, maxHeightDesktopVar } from "./PlayerTracklist.css"
import { assignInlineVars } from "@vanilla-extract/dynamic"

interface Props {
	maxHeight?: string
	maxHeightDesktop?: string
}

const PlayerTracklist: FunctionalComponent<Props> = ({ maxHeight, maxHeightDesktop }) => {
	const { artistAudio, selectedTrack, selectTrack, seekToTime } = usePlayer()

	return (
		<ul className={TracklistWrapper} style={assignInlineVars({
			[maxHeightVar]: maxHeight,
			[maxHeightDesktopVar]: maxHeightDesktop,
		})}>
			{artistAudio.map((item, index) => (
				<li key={`${index}. ${item.title}`} className={selectedTrack == index ? TracklistTrack + ' active' : TracklistTrack}>
					<span style={{ width: "92%" }}>
						<a role="button" className={TrackButton} onClick={() => selectTrack(index)}>
							{item.title}
						</a>
						{item.tracklist && (
							<ul className="tracklist">
								{item.tracklist.map((item) => (
									<li key={item.title}>
										<a onClick={() => seekToTime(item.time, index, true)} style={{ cursor: "pointer" }} role="button">
											{item.title} ({item.time})
										</a>
									</li>
								)
								)}
							</ul>
						)}
					</span>
					<span style={{ marginLeft: "auto" }}>
						<a title={'Download MP3: ' + item.title} href={item.files[0]} target="_blank">
							<DownloadIcon />
						</a>
					</span>
				</li>
			))}
		</ul>
	)
}

export default PlayerTracklist
