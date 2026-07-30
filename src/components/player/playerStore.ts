/**
 * Holds state for the global player.
 */

import { atom } from "nanostores"
import type { PlayerAudio } from "@src/util/collection"

export interface PlayerState {
	playlist: PlayerAudio[]
	selectedTrack: number
	playing: boolean
	ready: boolean
	loading: boolean
	currentTime: number
	currentPeaks: number[]
	duration: number
}

export const initialPlayerState: PlayerState = {
	playlist: [],
	selectedTrack: 0,
	playing: false,
	ready: false,
	loading: false,
	currentTime: 0,
	currentPeaks: [],
	duration: 0,
}

export const playerState = atom<PlayerState>(initialPlayerState)

export const updatePlayerState = (partial: Partial<PlayerState>) => {
	const current = playerState.get()
	const hasChanges = Object.entries(partial).some(
		([key, value]) => current[key as keyof PlayerState] !== value
	)
	if (!hasChanges) return
	playerState.set({
		...current,
		...partial,
	})
}
