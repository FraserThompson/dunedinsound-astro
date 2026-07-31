/**
 * The waveform container for the player.
 * 
 * Holds the wavesurfer waveform, with duration/length overlays.
 */

import { useEffect, useRef } from "preact/hooks"
import { playerEngine } from "./playerEngine"
import { LengthWrapper, WaveWrapper } from "./PlayerWaveform.css"
import { usePlayer } from "./usePlayer"
import { formatTime } from "./wavesurferShared"
import LoadingSpinner from "../LoadingSpinner"
import { getCurrentScreensize } from "@src/util/helpers"

interface Props {
	hideMobile?: boolean
}

export default function PlayerWaveform({ hideMobile }: Props) {
	const containerRef = useRef<HTMLDivElement | null>(null)

	const { ready, loading, currentTime, duration } = usePlayer()

	const isMobile = getCurrentScreensize() === 'xs'

	// Avoid attaching to a hidden wavesurfer container
	if (isMobile && hideMobile) {
		return null
	}

	useEffect(() => {
		const el = containerRef.current
		if (!el) return

		// Attach WaveSurfer canvas to this persistent DOM slot
		playerEngine.mountContainer(el)

		const resizeObserver = new ResizeObserver(() => {
			playerEngine.mountContainer(el)
		})

		resizeObserver.observe(el)

		return () => resizeObserver.disconnect()
	}, [])

	return (
		<>
			<div className={WaveWrapper} id="waveform" ref={containerRef}>
				{ready && !!currentTime && <div className={LengthWrapper} style={{ left: '0px' }}>{formatTime(currentTime)}</div>}
				{ready && !!duration && <div className={LengthWrapper} style={{ right: '0px' }}>{formatTime(duration)}</div>}
			</div>
			{loading && (
				<div style={{ position: 'absolute', zIndex: '10' }}>
					<LoadingSpinner />
				</div>
			)}
		</>
	)
}
