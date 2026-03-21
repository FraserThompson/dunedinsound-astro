import { createContext } from "preact"
import { useContext } from "preact/hooks"
import type { ArtistAudio } from "src/util/collection"
import type WaveSurfer from "wavesurfer.js"

export interface PlayerState {
	playing: boolean
	ready: boolean
	shuffle: boolean
	selectedTrack: number
	currentTrackTitle: string
	currentTime?: number
	duration?: number
}

export interface PlayerActions {
	playPause: () => void
	next: (play?: boolean) => void
	previous: () => void
	selectTrack: (index: number, play?: boolean, seek?: string) => void
	seekToTime: (time: string, artistIndex: number, play?: boolean) => void
	toggleShuffle: () => void
}

export type PlayerContextValue = PlayerState & PlayerActions & {
	artistAudio?: ArtistAudio[]
	waveformRef: preact.RefObject<HTMLDivElement>
	wavesurfer?: WaveSurfer
	loading: boolean
}

export const PlayerContext = createContext<PlayerContextValue | null>(null)

export const usePlayer = () => {
	const ctx = useContext(PlayerContext)
	if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider")
	return ctx
}
