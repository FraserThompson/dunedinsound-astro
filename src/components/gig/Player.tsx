/*
* Player.js
* An audio player for playing media from one or more artists.
* Parameters:
*  - artistAudio: Media to be displayed. An array of artistMedia objects.
	 - barebones (optional): If true it will just render the waveform without tracklist/transport.
	 - hideNextPrevOnMobile (optional): If true next/prev buttons hidden on mobile.
	 - playOnLoad (optional): If true it will play the track once it loads.
	 - setWaveSurferCallback (optional): Used to access the Wavesurfer object from outside.
*/

import { useRef, useState, useEffect, useCallback } from "preact/hooks"
import type { FunctionalComponent } from "preact"
import DownloadIcon from '~icons/iconoir/download'
import LoadingSpinner from '../LoadingSpinner.tsx'
import { timeToSeconds } from '../../util/helpers.ts'
import { AudioWrapper, LengthWrapper, PlayerWrapper, Titlebar, TracklistTrack, TracklistWrapper, TransportButton, WaveWrapper } from './Player.css.ts'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import type { ArtistAudio } from "src/util/collection.ts"

interface Props {
	artistAudio: ArtistAudio[]
	barebones?: boolean
	playOnLoad?: boolean
	hideNextPrevOnMobile?: boolean
	setWaveSurferCallback?: (wavesurfer: WaveSurfer | undefined) => any
}

const Player: FunctionalComponent<Props> = ({ artistAudio, barebones, playOnLoad, hideNextPrevOnMobile, setWaveSurferCallback }) => {
	const waveformRef = useRef(null)

	const [playing, setPlaying] = useState(false)
	const [ready, setReady] = useState(false) // used only on initial load
	const [loading, setLoading] = useState(true)
	const [currentTime, setCurrentTime] = useState(undefined as number | undefined)
	const [duration, setDuration] = useState(undefined as number | undefined)
	const [selectedArtist, setSelectedArtist] = useState(0)
	const [queuePlay, setQueuePlay] = useState(false)
	const [queueSeek, setQueueSeek] = useState(undefined as string | undefined)

	const [wavesurfer, setWaveSurfer] = useState(undefined as WaveSurfer | undefined)
	const [regionsPlugin, setRegionsPlugin] = useState(undefined as RegionsPlugin | undefined)

	const waveformColor = '#bfced9'
	const waveformProgressColor = '#fffadf'

	// Create instance on mount
	useEffect(() => {
		if (window) {
			(window as any).cached_json = (window as any).cached_json || {}
		}

		if (!waveformRef.current) return;

		const ws = WaveSurfer.create({
			container: waveformRef.current,
			waveColor: waveformColor,
			height: 60,
			hideScrollbar: true,
			normalize: true,
			progressColor: waveformProgressColor,
			barWidth: 2,
		})

		const wsRegions = ws.registerPlugin(RegionsPlugin.create())

		setWaveSurfer(ws)
		setRegionsPlugin(wsRegions)
	}, [])

	// Attach callbacks when we have the instance
	useEffect(() => {
		if (!wavesurfer) return
		wavesurfer.on('ready', (duration) => {
			setReady(true)
			setLoading(false)
			setDuration(duration)
		})
		wavesurfer.on('seeking', () => wavesurfer.isPlaying() && setLoading(true))
		wavesurfer.on('loading', () => setLoading(true))
		wavesurfer.on('finish', () => next(true))
		wavesurfer.on('audioprocess', () => {
			setLoading(false)
		})
		wavesurfer.on('play', () => {
			setPlaying(true)
			setLoading(false)
		})
		wavesurfer.on('pause', () => setPlaying(false))
		wavesurfer.on('timeupdate', (time) => setCurrentTime(time))
		return () => wavesurfer && wavesurfer.destroy()
	}, [wavesurfer])

	// Update UI when ready
	useEffect(() => {
		if (!wavesurfer || !regionsPlugin) return

		// So other components can respond to Wavesurfer being ready
		const event = new Event('wavesurfer_ready')
		window && window.dispatchEvent(event)

		setCurrentTime(wavesurfer.getCurrentTime())

		regionsPlugin.clearRegions()

		if (playOnLoad) {
			wavesurfer.play()
		}

		// So we can trigger these after the player is ready
		if (queuePlay) {
			// We need this timeout for some reason
			setTimeout(() => wavesurfer.play(), 200)
			setQueuePlay(false)
		}

		if (queueSeek) {
			seekToTime(queueSeek, selectedArtist, true)
			setQueueSeek(undefined)
		}

		artistAudio[selectedArtist].tracklist?.forEach((track) => {
			const region = {
				content: track.title,
				start: timeToSeconds(track.time),
				drag: false,
				resize: false,
				color: "#28da1d"
			}
			regionsPlugin.addRegion(region)
		})
	}, [ready])

	useEffect(() => {
		if (playing) {
			const event = new Event('wavesurfer_play')
			window && window.dispatchEvent(event)
		} else {
			const event = new Event('wavesurfer_stop')
			window && window.dispatchEvent(event)
		}
	}, [playing])

	// Load media if selected artist changes
	useEffect(() => {
		wavesurfer && load(artistAudio[selectedArtist].files[0], artistAudio[selectedArtist].files[1])
	}, [artistAudio, selectedArtist, wavesurfer])

	useEffect(() => {
		setWaveSurferCallback && setWaveSurferCallback(wavesurfer)
	}, [wavesurfer])

	// Fetches the file and loads it into wavesurfer
	const load = useCallback(
		(mp3: string, json: string) => {
			if (!wavesurfer) return
			setReady(false)
			if (json) {
				if (!(window as any).cached_json[json]) {
					// If we have a URL and no cache we need to fetch it
					fetch(json.replace('#', '%23'))
						.then((response) => response.json())
						.then((data) => {
							// Support new JSON waveforms and old ones
							const theData = "data" in data ? data.data : data;
							(window as any).cached_json[json] = theData
							wavesurfer.load(mp3, (window as any).cached_json[json])
						})
						.catch((err) => {
							console.log('Fetch Error :-S', err)
						})
				} else {
					// Else we can just use the cached one
					wavesurfer.load(mp3, (window as any).cached_json[json])
				}
			}
		},
		[wavesurfer]
	)

	const seekToTime = useCallback(
		(time: string, artistIndex: number, play?: boolean) => {
			if (!wavesurfer) return;

			// If we haven't loaded it we need to load THEN seek
			if (artistIndex !== selectedArtist) {
				selectArtist(artistIndex, play, time)
				return
			}

			const timeSeconds = timeToSeconds(time)
			const totalTimeSeconds = wavesurfer.getDuration()
			const ratio = timeSeconds / totalTimeSeconds

			wavesurfer.seekTo(ratio)
			if (play) wavesurfer.play()
		},
		[wavesurfer]
	)

	const formatTime = useCallback((time: number) => {
		const mins = ~~(time / 60)
		const secs = ('0' + ~~(time % 60)).slice(-2)
		return mins + ':' + secs
	}, [])

	const playPause = useCallback(() => {
		if (!wavesurfer) return
		wavesurfer.playPause()
	}, [wavesurfer])

	const previous = useCallback(() => {
		const newSelectedArtist = Math.max(selectedArtist - 1, 0)
		selectArtist(newSelectedArtist)
	}, [selectedArtist])

	const next = useCallback(
		(play?: boolean) => {
			const newSelectedArtist = Math.min(selectedArtist + 1, artistAudio.length - 1)
			selectArtist(newSelectedArtist, play)
		},
		[selectedArtist, artistAudio]
	)

	const selectArtist = useCallback(
		(newSelectedArtist: number, play?: boolean, seek?: string) => {
			setQueuePlay(!!play)
			setQueueSeek(seek)
			setSelectedArtist(newSelectedArtist)

			// If we're trying to select an artist we already have loaded and we want to play then just do it
			if (selectedArtist === newSelectedArtist && wavesurfer) {
				if (play) wavesurfer.playPause()
				return
			}

			wavesurfer && wavesurfer.stop()
			wavesurfer && wavesurfer.empty()
		},
		[selectedArtist, wavesurfer]
	)

	return (
		<div className={PlayerWrapper}>
			{!barebones && <div className={Titlebar} />}
			<div className={AudioWrapper}>
				{!barebones && (
					<div>
						<button
							className={`${TransportButton} left ${hideNextPrevOnMobile ? 'hideMobile' : ''}`}
							disabled={!ready}
							id="prev"
							onClick={() => previous()}
							aria-label="Previous track">
						</button>
						<button
							disabled={!ready}
							className={playing ? `${TransportButton} pause` : `${TransportButton} play`}
							onClick={() => playPause()}
							aria-label="Play/Pause">
						</button>
						<button
							className={`${TransportButton} right ${hideNextPrevOnMobile ? 'hideMobile' : ''}`}
							disabled={!ready}
							id="next"
							onClick={() => next()}
							aria-label="Next track">
						</button>
					</div>
				)}
				<div className={WaveWrapper} id="waveform" ref={waveformRef}>
					{ready && <div className={LengthWrapper} style={{ left: '0px' }}>{currentTime ? formatTime(currentTime) : "00:00"}</div>}
					{ready && <div className={LengthWrapper} style={{ right: '0px' }}>{duration && formatTime(duration)}</div>}
				</div>
				{loading && (
					<div style={{ position: 'absolute', zIndex: '10' }}>
						<LoadingSpinner />
					</div>
				)}
			</div>

			{!barebones && (
				<ul className={TracklistWrapper}>
					{artistAudio.map((item, index) => (
						<li key={item.title} className={selectedArtist == index ? TracklistTrack + ' active' : TracklistTrack}>
							<span style={{ flexGrow: 1 }}>
								<a role="button" onClick={() => selectArtist(index)} style={{ cursor: "pointer", display: 'block' }}>
									{index + 1}. {item.title}
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
			)}
		</div>
	)
}

export default Player
