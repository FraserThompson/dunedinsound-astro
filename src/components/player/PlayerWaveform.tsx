/**
 * The waveform for the player. 
 * 
 * Must be instantiated inside a PlayerProvider.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./PlayerContext"
import LoadingSpinner from "../LoadingSpinner"
import { LengthWrapper, WaveWrapper } from "./PlayerWaveform.css"

const formatTime = (time?: number) => {
	if (time == null) return "0:00"
	const mins = Math.floor(time / 60)
	const secs = String(Math.floor(time % 60)).padStart(2, "0")
	return `${mins}:${secs}`
}

const PlayerWaveform: FunctionalComponent = () => {
	const { waveformRef, loading, ready, currentTime, duration } = usePlayer()

	return (
		<>
			<div className={WaveWrapper} id="waveform" ref={waveformRef}>
				{ready && <div className={LengthWrapper} style={{ left: '0px' }}>{formatTime(currentTime)}</div>}
				{ready && <div className={LengthWrapper} style={{ right: '0px' }}>{duration && formatTime(duration)}</div>}
			</div>
			{loading && (
				<div style={{ position: 'absolute', zIndex: '10' }}>
					<LoadingSpinner />
				</div>
			)}
		</>
	)
}

export default PlayerWaveform
