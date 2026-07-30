/**
 * Inline mini player with per-instance state.
 *
 * Unlike the global docked player, this player does not use the shared store,
 * so multiple inline players on a page can have independent playlists.
 */

import type { FunctionalComponent } from "preact"
import type { PlayerAudio } from "@src/util/collection"
import { useEffect, useMemo, useRef, useState } from "preact/hooks"
import { AudioWrapper, CompactPlayerWaveWrapper, CompactPlayerWrapper, WinampTitlebar } from "./CompactPlayer.css"
import { TracklistWrapper } from "./player/PlayerTracklist.css"
import { TransportButton } from "./player/PlayerTransport.css"
import { LengthWrapper, WaveWrapper } from "./player/PlayerWaveform.css"
import LoadingSpinner from "./LoadingSpinner"
import WaveSurfer from "wavesurfer.js"
import { timeToSeconds } from "@src/util/helpers"
import { createStyledWaveSurfer, formatTime, loadWaveSurferTrack } from "./player/wavesurferShared"
import TrackListTrack from "./player/PlayerTracklistTrack"

interface Props {
	title?: string
	playerAudio?: PlayerAudio[]
}

const CompactPlayer: FunctionalComponent<Props> = ({ title = "AUDIO PLAYER", playerAudio = [] }) => {

	const [playlist, setPlaylist] = useState<PlayerAudio[]>(playerAudio)
	const [selectedTrack, setSelectedTrack] = useState(0)
	const [playing, setPlaying] = useState(false)
	const [ready, setReady] = useState(false)
	const [loading, setLoading] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)

	const waveformElementRef = useRef<HTMLDivElement | null>(null)
	const wavesurferRef = useRef<WaveSurfer | null>(null)
	const loadRequestIdRef = useRef(0)
	const pendingSeekRef = useRef<{ trackIndex: number, time: string } | null>(null)
	const selectedTrackRef = useRef(selectedTrack)
	const playlistLengthRef = useRef(playlist.length)

	const currentTrack = playlist[selectedTrack]
	const currentTracklist = currentTrack?.tracklist ?? []

	const currentTrackMarker = useMemo(() => {
		for (let i = currentTracklist.length - 1; i >= 0; i--) {
			if (currentTime >= timeToSeconds(currentTracklist[i].time)) {
				return i
			}
		}
		return -1
	}, [currentTime, currentTracklist])

	/** 
	 * Initialize on load.
	 */
	useEffect(() => {

		setPlaylist(playerAudio)
		setSelectedTrack(0)
		setCurrentTime(0)
		setDuration(0)

		pendingSeekRef.current = null

		const element = waveformElementRef.current
		if (!element) return

		const wavesurfer = createStyledWaveSurfer(element)

		wavesurferRef.current = wavesurfer

		const onReady = (nextDuration: number) => {
			setReady(true)
			setLoading(false)
			setDuration(nextDuration)
			setCurrentTime(wavesurfer.getCurrentTime())

			const pendingSeek = pendingSeekRef.current
			if (pendingSeek && pendingSeek.trackIndex === selectedTrackRef.current) {
				const total = wavesurfer.getDuration()
				const seekTime = timeToSeconds(pendingSeek.time)
				if (total > 0) {
					wavesurfer.seekTo(seekTime / total)
				}
				pendingSeekRef.current = null
			}
		}

		const onPlay = () => setPlaying(true)
		const onPause = () => setPlaying(false)
		const onLoading = () => setLoading(true)
		const onAudioProcess = () => setLoading(false)
		const onTimeUpdate = (time: number) => setCurrentTime(time)
		const onFinish = () => {
			setSelectedTrack((value) => {
				const lastTrackIndex = Math.max(playlistLengthRef.current - 1, 0)
				if (value >= lastTrackIndex) {
					return value
				}
				return value + 1
			})
		}

		wavesurfer.on('ready', onReady)
		wavesurfer.on('play', onPlay)
		wavesurfer.on('pause', onPause)
		wavesurfer.on('loading', onLoading)
		wavesurfer.on('audioprocess', onAudioProcess)
		wavesurfer.on('timeupdate', onTimeUpdate)
		wavesurfer.on('finish', onFinish)

		return () => {
			wavesurfer.un('ready', onReady)
			wavesurfer.un('play', onPlay)
			wavesurfer.un('pause', onPause)
			wavesurfer.un('loading', onLoading)
			wavesurfer.un('audioprocess', onAudioProcess)
			wavesurfer.un('timeupdate', onTimeUpdate)
			wavesurfer.un('finish', onFinish)
			wavesurfer.destroy()
			wavesurferRef.current = null
		}

	}, [playerAudio])

	/**
	 * Update component refs when state changes.
	 */
	useEffect(() => {
		selectedTrackRef.current = selectedTrack
	}, [selectedTrack])

	useEffect(() => {
		playlistLengthRef.current = playlist.length
	}, [playlist.length])

	/**
	 * Load track when track changes.
	 */
	useEffect(() => {
		const wavesurfer = wavesurferRef.current
		const currentTrack = playlist[selectedTrack]
		if (!wavesurfer || !currentTrack) return

		loadRequestIdRef.current += 1
		const requestId = loadRequestIdRef.current

		setReady(false)
		setLoading(true)
		setCurrentTime(0)
		setDuration(0)

		const json = currentTrack.files[1]

		loadWaveSurferTrack({
			wavesurfer,
			trackFile: currentTrack.files[0],
			peaksFile: json,
			isCurrentRequest: () => requestId === loadRequestIdRef.current,
		})
	}, [playlist, selectedTrack])

	/**
	 * Audio controls.
	 */
	const togglePlayPause = () => {
		const wavesurfer = wavesurferRef.current
		if (!wavesurfer || !currentTrack || !ready) return
		wavesurfer.playPause()
	}

	const previous = () => {
		setSelectedTrack((value) => Math.max(value - 1, 0))
	}

	const next = () => {
		setSelectedTrack((value) => Math.min(value + 1, Math.max(playlist.length - 1, 0)))
	}

	const selectTrack = (index: number) => {
		setSelectedTrack(index)
	}

	const seekToTime = (time: string) => {
		const wavesurfer = wavesurferRef.current
		if (!wavesurfer) return

		const totalTimeSeconds = wavesurfer.getDuration()
		if (!totalTimeSeconds) {
			pendingSeekRef.current = { trackIndex: selectedTrack, time }
			return
		}

		wavesurfer.seekTo(timeToSeconds(time) / totalTimeSeconds)
		if (!wavesurfer.isPlaying()) void wavesurfer.play()
	}


	return (
		<div className={CompactPlayerWrapper}>
			<div className={WinampTitlebar} data-title={title} />
			<div className={CompactPlayerWaveWrapper}>
				<div className={AudioWrapper}>
					<div>
						<button className={`${TransportButton} hideMobile left`} disabled={!playlist.length} onClick={previous} aria-label="Previous track" />
						<button className={playing ? `${TransportButton} pause` : `${TransportButton} play`} disabled={!ready} onClick={togglePlayPause} aria-label="Play/Pause" />
						<button className={`${TransportButton} hideMobile right`} disabled={!playlist.length} onClick={next} aria-label="Next track" />
					</div>
					<div style={{ flexGrow: 1, minWidth: 0, minHeight: "65px", position: 'relative' }}>
						<div className={WaveWrapper} id="local-waveform" ref={waveformElementRef}>
							{ready && <div className={LengthWrapper} style={{ left: '0px' }}>{formatTime(currentTime)}</div>}
							{ready && <div className={LengthWrapper} style={{ right: '0px' }}>{duration && formatTime(duration)}</div>}
						</div>
						{loading && (
							<div style={{ position: 'absolute', zIndex: '10' }}>
								<LoadingSpinner />
							</div>
						)}
					</div>
				</div>
			</div>
			<div className={CompactPlayerWaveWrapper}>
				<ul className={TracklistWrapper} style={{ maxHeight: '160px' }}>
					{playlist?.map((track, index) => {
						const isSelected = selectedTrack == index
						const isPlayingTrack = playing && isSelected
						const isPausedTrack = !playing && !!currentTime && isSelected
						return <TrackListTrack
							track={track}
							onTrackClick={(track) => selectTrack(index)}
							onSeekClick={(track, time) => seekToTime(time)}
							isSelected={isSelected}
							isPlayingTrack={isPlayingTrack}
							isPausedTrack={isPausedTrack}
						/>
					})}
				</ul>
			</div>
		</div>
	)
}

export default CompactPlayer
