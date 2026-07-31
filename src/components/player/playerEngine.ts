/**
 * Encapsulates all behavior for driving the global player.
 * 
 * This includes:
 *  - Binding events to Wavesurfer
 *  - Methods for controlling the player
 *  - Methods for manipulating the playlist
 */

import WaveSurfer from "wavesurfer.js"
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js"
import type { PlayerAudio } from "@src/util/collection"
import { timeToSeconds, shuffleArray } from "@src/util/helpers"
import { initialPlayerState, playerState, updatePlayerState } from "./playerStore"
import {
	createStyledWaveSurfer,
	getOrCreateSharedPlayerAudioElement,
	loadWaveSurferTrack,
} from "./wavesurferShared"

type RegionsPluginInstance = ReturnType<typeof RegionsPlugin.create>

class PlayerEngine {
	private ws: WaveSurfer | null = null
	private regions: RegionsPluginInstance | null = null
	private currentTrackId: string | null = null

	private loadRequestId: string | null = null
	private pendingPlayRequestId: string | null = null
	private pendingSeekTime?: string

	/**
	 * Attaches the HTML container to the wavesurfer instance.
	 * 
	 * @param container 
	 *   The HTML element for wavesurfer to attach to.
	 */
	public mountContainer(container: HTMLDivElement) {
		if (typeof window === "undefined") return

		if (!this.ws) {
			const audioElement = getOrCreateSharedPlayerAudioElement()
			this.ws = createStyledWaveSurfer(container, audioElement)
			this.regions = this.ws.registerPlugin(RegionsPlugin.create())
			this.bindEvents()

			const state = playerState.get()
			if (state.playlist && state.playlist.length > 0 && !this.currentTrackId) {
				this.loadTrackIndex(state.selectedTrack, state.playing)
			}
		} else {
			this.ws.setOptions({ container })
		}
	}

	/**
	 * Initializes all engine values.
	 */
	private init() {
		updatePlayerState(initialPlayerState)
		this.currentTrackId = null
		this.loadRequestId = null
		this.pendingPlayRequestId = null
	}

	/**
	 * Binds wavesurfer events.
	 */
	private bindEvents() {
		if (!this.ws) return

		this.ws.on("play", () => updatePlayerState({ playing: true, ready: true, loading: false }))
		this.ws.on("pause", () => updatePlayerState({ playing: false }))
		this.ws.on("load", () => updatePlayerState({ loading: true, ready: false, playing: false }))
		this.ws.on("finish", () => this.next(true))
		this.ws.on("audioprocess", (time) => updatePlayerState({ currentTime: time }))

		this.ws.on("ready", (duration) => {
			updatePlayerState({ ready: true, duration, loading: false, playing: this.ws?.isPlaying() })
			this.applyRegions()

			if (this.pendingPlayRequestId === this.loadRequestId) {
				if (this.pendingSeekTime) {
					this.seekTo(this.pendingSeekTime)
					this.pendingSeekTime = undefined
				}
				this.safePlay()

				// Make sure it's actually playing
				const currentSrc = this.getCurrentSrc()
				if (currentSrc?.pathname == this.pendingPlayRequestId && this.ws?.isPlaying()) {
					this.pendingPlayRequestId = null
				}
			}
		})
	}

	private async safePlay() {
		if (!this.ws) return
		try {
			await this.ws.play()
		} catch (err) {
			console.warn("Playback blocked or failed:", err)
			updatePlayerState({ playing: false })
		}
	}

	public getWaveSurfer(): WaveSurfer | null {
		return this.ws
	}

	/**
	 * Gets the src of the file current loaded in the player.
	 * @returns URL object of current src in player.
	 */
	public getCurrentSrc(): URL | undefined {
		const src = this.ws?.getMediaElement().currentSrc
		if (src) {
			return new URL(src)
		}
	}

	public async setPlaylist(playlist: PlayerAudio[], autoPlay = false) {
		updatePlayerState({ playlist, selectedTrack: 0 })

		if (!playlist || playlist.length === 0) {
			await this.ws?.stop()
			await this.ws?.empty()
			this.init()
			return
		}

		this.loadTrackIndex(0, autoPlay)
	}

	public addTracksToPlaylist(tracks: PlayerAudio[], play = false, seekTime?: string) {
		if (!tracks.length) return

		const state = playerState.get()
		const currentPlaylist = state.playlist ?? []

		// Deduplicate against existing tracks in playlist
		const deduped: PlayerAudio[] = []
		for (const track of tracks) {
			const existingIndex = currentPlaylist.findIndex((item) => item.id === track.id)
			if (existingIndex < 0) {
				deduped.push(track)
			}
		}

		const newPlaylist = [...currentPlaylist, ...deduped]
		const isFirstLoad = !currentPlaylist.length || !this.currentTrackId

		if (play) {
			// Find where the target track is located in the updated playlist
			let targetIndex = newPlaylist.findIndex((item) => item.id === tracks[0].id)
			if (targetIndex < 0) targetIndex = 0

			updatePlayerState({ playlist: newPlaylist, selectedTrack: targetIndex })
			this.loadTrackIndex(targetIndex, true, seekTime)
			return
		}

		if (isFirstLoad) {
			// Player is empty: load track 0 into WaveSurfer to render waveform, BUT autoPlay = false
			updatePlayerState({ playlist: newPlaylist, selectedTrack: 0, playing: false })
			this.loadTrackIndex(0, false)
		} else {
			// Player already has an active track: just append to playlist without touching WaveSurfer
			updatePlayerState({ playlist: newPlaylist })
		}
	}

	public async loadTrackIndex(index: number, autoPlay = false, seekTime?: string) {
		const state = playerState.get()
		const playlist = state.playlist ?? []
		const track = playlist[index]
		if (!track) return

		this.loadRequestId = track.id
		const requestId = this.loadRequestId

		this.pendingPlayRequestId = autoPlay ? requestId : null
		this.pendingSeekTime = seekTime

		updatePlayerState({ selectedTrack: index, currentPeaks: [] })

		if (!this.ws) return

		// Play it and don't load if we already have it.
		if (this.currentTrackId === track.id) {
			if (seekTime) this.seekTo(seekTime)
			if (autoPlay) this.safePlay()
			updatePlayerState({ ready: true, loading: false })
			return
		}

		this.currentTrackId = track.id
		this.regions?.clearRegions()
		this.ws.stop()
		this.ws.empty()

		await loadWaveSurferTrack({
			wavesurfer: this.ws,
			trackFile: track.files[0],
			peaksFile: track.files[1],
			isCurrentRequest: () => this.loadRequestId === requestId,
			onPeaks: (peaks) => {
				if (this.loadRequestId === requestId) {
					updatePlayerState({ currentPeaks: peaks })
				}
			},
			onError: (err) => {
				if (this.loadRequestId === requestId) {
					console.error("Audio Load Error:", err)
					this.currentTrackId = null
					updatePlayerState({ currentPeaks: [] })
				}
			},
		})

	}

	public async playPause() {
		if (!this.ws) return
		try {
			if (this.ws.isPlaying()) {
				this.ws.pause()
			} else {
				await this.ws.play()
			}
		} catch (err) {
			console.warn("Play/Pause action blocked:", err)
		}
	}

	public seekTo(time: string) {
		if (!this.ws) return
		const seconds = timeToSeconds(time)
		const duration = this.ws.getDuration()
		if (duration > 0) {
			this.ws.seekTo(seconds / duration)
		}
	}

	public next(autoPlay = true) {
		const state = playerState.get()
		updatePlayerState({ ready: false, playing: false })
		if (state.playlist && state.selectedTrack < state.playlist.length - 1) {
			this.loadTrackIndex(state.selectedTrack + 1, autoPlay)
		}
	}

	public previous() {
		const state = playerState.get()
		if (state.selectedTrack > 0) {
			this.loadTrackIndex(state.selectedTrack - 1, true)
		}
	}

	public toggleShuffle() {
		const state = playerState.get()
		const playlist = state.playlist
		if (!playlist || playlist.length === 0) return

		const currentTrackId = playlist[state.selectedTrack]?.id
		const shuffled = shuffleArray(playlist)

		let selectedTrack = state.selectedTrack
		if (state.playing || state.currentTime > 0) {
			const newIndex = shuffled.findIndex((track) => track.id === currentTrackId)
			selectedTrack = newIndex >= 0 ? newIndex : 0
		}

		updatePlayerState({
			playlist: shuffled,
			selectedTrack
		})
	}

	private applyRegions() {
		if (!this.regions) return
		this.regions.clearRegions()

		const state = playerState.get()
		const track = state.playlist?.[state.selectedTrack]

		track?.tracklist?.forEach((item) => {
			this.regions?.addRegion({
				content: item.title,
				start: timeToSeconds(item.time),
				drag: false,
				resize: false,
				color: "#28da1d",
			})
		})
	}
}

export const playerEngine = new PlayerEngine()
