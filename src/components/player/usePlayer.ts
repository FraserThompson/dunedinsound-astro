/**
 * Allows components to use the player.
 * 
 * Acts like a provider to give access to player methods and state.
 */

import { useStore } from "@nanostores/preact"
import type { PlayerAudio } from "@src/util/collection"
import { playerState } from "./playerStore"
import { playerEngine } from "./playerEngine"
import type WaveSurfer from "@node_modules/wavesurfer.js/dist/wavesurfer"

export interface PlayerActions {
	wavesurfer: () => WaveSurfer,
	playPause: () => void
	addTracksToPlaylist: (track: PlayerAudio, play?: boolean) => void
	clearPlaylist: () => void
	next: (play?: boolean) => void
	previous: () => void
	selectTrack: (index: number, play?: boolean, seek?: string) => void
	toggleShuffle: () => void
	setPlaylist: (audio: PlayerAudio[]) => void,
	seekToTime: (time: string, artistIndex?: number, play?: boolean) => void
}

export const usePlayer = () => {
	const state = useStore(playerState)

	return {
		...state,
		wavesurfer: playerEngine.getWaveSurfer() as WaveSurfer | undefined,
		playPause: () => playerEngine.playPause(),
		next: (play?: boolean) => playerEngine.next(play),
		previous: () => playerEngine.previous(),
		selectTrack: (index: number, play?: boolean, seek?: string) =>
			playerEngine.loadTrackIndex(index, play, seek),
		setPlaylist: (playlist: PlayerAudio[], autoPlay = false) =>
			playerEngine.setPlaylist(playlist, autoPlay),
		seekToTime: (time: string, artistIndex?: number, play = true) => {
			const currentTrack = playerState.get().selectedTrack
			if (artistIndex !== undefined && artistIndex !== currentTrack) {
				playerEngine.loadTrackIndex(artistIndex, play, time)
			} else {
				playerEngine.seekTo(time)
				if (play) playerEngine.playPause()
			}
		},
		toggleShuffle: () => playerEngine.toggleShuffle(),
		addTracksToPlaylist: (track: PlayerAudio[], play = true) =>
			playerEngine.addTracksToPlaylist(track, play),
		clearPlaylist: () => playerEngine.setPlaylist([]),
	}
}

export type { PlayerState } from "./playerStore"
