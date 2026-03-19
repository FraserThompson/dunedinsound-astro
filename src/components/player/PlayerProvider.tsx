/*
* PlayerProvider
*
* An audio player for playing media from one or more artists.
*
* This uses the provider/context pattern so we can decouple its visual components and
* have more control over how they're displayed.
*  
* See CompactPlayer.tsx for an example of implementation.
* 
* Parameters:
*  - artistAudio: Media to be displayed. An array of artistMedia objects.
*  - playOnLoad (optional): If true it will play the track once it loads.
* 
* Events:
*  - {playerTrackChange} (see events.ts): Fired when track changes.
*/

import { useRef, useState, useEffect, useCallback, useMemo } from "preact/hooks"
import type { FunctionalComponent } from "preact"
import { timeToSeconds } from '../../util/helpers.ts'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import type { ArtistAudio } from "src/util/collection.ts"
import { PlayerContext } from "./PlayerContext.tsx"
import { playerTrackChange, type PlayerTrackChangeEventDetails } from "src/util/events.ts"

interface Props {
	artistAudio?: ArtistAudio[]
	playOnLoad?: boolean
}

const PlayerProvider: FunctionalComponent<Props> = ({ artistAudio, playOnLoad, children }) => {
	const waveformRef = useRef(null)

	const [playing, setPlaying] = useState(false)
	const [ready, setReady] = useState(false) // used only on initial load
	const [loading, setLoading] = useState(true)
	const [shuffle, setShuffle] = useState(false)

	const [currentTime, setCurrentTime] = useState(undefined as number | undefined)
	const [duration, setDuration] = useState(undefined as number | undefined)
	const [selectedTrack, setselectedTrack] = useState(0)
	const [currentTrackTitle, setCurrentTrackTitle] = useState("")

	const [queuePlay, setQueuePlay] = useState(false)
	const [queueSeek, setQueueSeek] = useState(undefined as string | undefined)

	const [wavesurfer, setWaveSurfer] = useState(undefined as WaveSurfer | undefined)
	const [regionsPlugin, setRegionsPlugin] = useState(undefined as RegionsPlugin | undefined)

	const waveformColor = '#bfced9'
	const waveformProgressColor = '#fffadf'

	/**
	 * On component mount.
	 */
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

		if (!artistAudio) {
			setLoading(false)
		}
	}, [])

	/**
	 * On wavesurfer instance available.
	 */
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

	/**
	 * On wavesurfer ready.
	 */
	useEffect(() => {
		if (!wavesurfer || !regionsPlugin || !artistAudio) return

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
			seekToTime(queueSeek, selectedTrack, true)
			setQueueSeek(undefined)
		}

		artistAudio[selectedTrack].tracklist?.forEach((track) => {
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

	/**
	 * On play state change.
	 */
	useEffect(() => {
		if (playing) {
			const event = new Event('wavesurfer_play')
			window && window.dispatchEvent(event)
		} else {
			const event = new Event('wavesurfer_stop')
			window && window.dispatchEvent(event)
		}
	}, [playing])

	/**
	 * On selected track change.
	 */
	useEffect(() => {
		if (!artistAudio) return

		const track = artistAudio[selectedTrack]
		const title = track.title

		// Send an event
		const detail: PlayerTrackChangeEventDetails = {
			track
		}

		const event = new CustomEvent(playerTrackChange, {
			detail
		})

		window.dispatchEvent(event)

		setCurrentTrackTitle(title)

		wavesurfer && load(track.files[0], track.files[1])
	}, [artistAudio, selectedTrack, wavesurfer])

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
			if (artistIndex !== selectedTrack) {
				selectTrack(artistIndex, play, time)
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

	const playPause = useCallback(() => {
		if (!wavesurfer) return
		wavesurfer.playPause()
	}, [wavesurfer])

	const previous = useCallback(() => {
		const newselectedTrack = Math.max(selectedTrack - 1, 0)
		selectTrack(newselectedTrack)
	}, [selectedTrack])

	const next = useCallback(
		(play?: boolean) => {
			if (!artistAudio) return
			const lastTrackIndex = artistAudio.length - 1
			const newselectedTrack = !shuffle ? Math.min(selectedTrack + 1, lastTrackIndex) : Math.floor(Math.random() * ((lastTrackIndex) + 1));
			selectTrack(newselectedTrack, play)
		},
		[selectedTrack, artistAudio]
	)

	const selectTrack = useCallback(
		(newselectedTrack: number, play?: boolean, seek?: string) => {
			setQueuePlay(!!play)
			setQueueSeek(seek)
			setselectedTrack(newselectedTrack)

			// If we're trying to select an artist we already have loaded and we want to play then just do it
			if (selectedTrack === newselectedTrack && wavesurfer) {
				if (play) wavesurfer.playPause()
				return
			}

			wavesurfer && wavesurfer.stop()
			wavesurfer && wavesurfer.empty()
		},
		[selectedTrack, wavesurfer]
	)

	const toggleShuffle = useCallback(
		() => {
			setShuffle(!shuffle)
		},
		[shuffle]
	)

	const value = useMemo(
		() => ({
			artistAudio,
			waveformRef,
			playing,
			ready,
			loading,
			shuffle,
			currentTime,
			duration,
			selectedTrack,
			currentTrackTitle,
			playPause,
			next,
			previous,
			selectTrack,
			seekToTime,
			toggleShuffle
		}),
		[artistAudio, playing, ready, loading, shuffle, currentTime, duration, selectedTrack, currentTrackTitle, playPause, next, previous, selectTrack, seekToTime, toggleShuffle]
	)

	return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export default PlayerProvider
