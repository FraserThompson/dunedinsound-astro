/*
* Player.js
* An audio player for playing media from one or more artists.
* Parameters:
*  - artistAudio: Media to be displayed. An array of artistMedia objects.
				title: name of artist (required)
				audio: array of audio (required)
					.mp3:
						publicURL: path to mp3 file
					.json:
						publicURL: path to mp3 file
						data: JSON data (optional, but required if no publicURL)
				tracklist: timestamped tracklist (optional)
	 - barebones: If true it will just render the waveform without tracklist/transport.
	 - playOnLoad: If true it will play the track once it loads.
	 - setWaveSurferCallback: Pass a function and this will return the wavesurfer obj
		 when it sets it, so the parent component can use it.
*/

import type React from "preact/compat"
import { useRef, useState, useEffect, useCallback } from "preact/compat"
import { FaPlayCircle, FaPauseCircle, FaBackward, FaForward, FaDownload } from 'react-icons/fa'
import { RoundButton } from './RoundButton.css'
import LoadingSpinner from './LoadingSpinner.tsx'
import { timeToSeconds } from '../util/helpers'
import { AudioWrapper, LengthWrapper, PlayerWrapper, Titlebar, TracklistTrack, TracklistWrapper, TransportButton, WaveWrapper } from './Player.css.ts'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import { MenuLink, MenuWrapper } from './Menu.css.ts'
import type { ArtistAudio } from "src/util/collection.ts"

interface Props {
	artistAudio: ArtistAudio[]
	barebones?: boolean
	playOnLoad?: boolean
	setWaveSurferCallback?: (wavesurfer: WaveSurfer | undefined) => any
}

const Player: React.FC<Props> = ({ artistAudio, barebones = false, playOnLoad = false, setWaveSurferCallback = null }) => {
	const waveformRef = useRef(null)

	const [playing, setPlaying] = useState(false)
	const [ready, setReady] = useState(false)
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
			setDuration(duration)
		})
		wavesurfer.on('finish', () => next(true))
		wavesurfer.on('play', () => setPlaying(true))
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
			}
			regionsPlugin.addRegion(region)
		})
	}, [ready])

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
							(window as any).cached_json[json] = data
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
		<div className={PlayerWrapper[barebones ? 'barebones' : 'normal']}>
			{!barebones && <div className={Titlebar} />}
			<div className={AudioWrapper[barebones ? 'barebones' : 'normal']}>
				{!barebones && (
					<div>
						<button className={TransportButton} disabled={!ready} id="prev" onClick={() => previous()}>
							<FaBackward />
						</button>
						<button disabled={!ready} className={playing ? `${RoundButton} active` : RoundButton} onClick={() => wavesurfer && wavesurfer.playPause()}>
							{!playing ? <FaPlayCircle /> : <FaPauseCircle />}
						</button>
						<button className={TransportButton} disabled={!ready} id="next" onClick={() => next()}>
							<FaForward />
						</button>
					</div>
				)}
				<div className={WaveWrapper} id="waveform" ref={waveformRef}>
					{ready && <div className={LengthWrapper} style={{ left: '0px' }}>{currentTime ? formatTime(currentTime) : "00:00"}</div>}
					{ready && <div className={LengthWrapper} style={{ right: '0px' }}>{duration && formatTime(duration)}</div>}
				</div>
				{!ready && (
					<div style={{ position: 'absolute' }}>
						<LoadingSpinner />
					</div>
				)}
			</div>

			{!barebones && (
				<ul className={TracklistWrapper}>
					{artistAudio.map((item, index) => (
						<div key={item.title}>
							<li className={selectedArtist == index ? TracklistTrack + ' active' : TracklistTrack} onClick={() => selectArtist(index)} style={{ cursor: "pointer" }}>
								<span className="title">
									{index + 1}. {item.title}
								</span>
								<span className="listButton" style={{ float: "right" }}>
									<a title={'Download MP3: ' + item.title} href={item.files[0]} target="_blank">
										<FaDownload />
									</a>
								</span>
							</li>
							{item.tracklist && (
								<ul className="tracklist">
									{item.tracklist.map((item) => {
										return (
											<li key={item.title} onClick={() => seekToTime(item.time, index, true)}>
												{item.title} ({item.time})
											</li>
										)
									})}
								</ul>
							)}
						</div>
					))}
				</ul>
			)}
		</div>
	)
}

export default Player
