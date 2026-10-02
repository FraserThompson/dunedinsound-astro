/**
 * Holds state for the global player.
 */

import { atom } from "nanostores"
import type { PlayerAudio } from "@src/util/collection"

const STORAGE_KEY = "dunedinsound-player-state"
const PERSIST_THROTTLE_MS = 1000

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

const getStoredPlayerState = (): Partial<PlayerState> | null => {
	if (typeof window === "undefined") return null

	try {
		const stored = window.localStorage.getItem(STORAGE_KEY)
		if (!stored) return null

		const parsed = JSON.parse(stored)
		if (!parsed || typeof parsed !== "object") return null

		return {
			playlist: Array.isArray(parsed.playlist) ? parsed.playlist : [],
			selectedTrack: Number.isFinite(parsed.selectedTrack) ? parsed.selectedTrack : 0,
			currentTime: Number.isFinite(parsed.currentTime) ? parsed.currentTime : 0,
			duration: Number.isFinite(parsed.duration) ? parsed.duration : 0,
		}
	} catch {
		return null
	}
}

const persistedState = getStoredPlayerState()

export const playerState = atom<PlayerState>({
	...initialPlayerState,
	...persistedState,
	playing: false,
	ready: false,
	loading: false,
})

let lastPersistedAt = 0
let lastPersistedState: string | undefined

const persistPlayerState = (state: PlayerState) => {
	if (typeof window === "undefined") return

	const serializableState = {
		playlist: state.playlist,
		selectedTrack: state.selectedTrack,
		currentTime: state.currentTime,
		duration: state.duration,
	}
	const json = JSON.stringify(serializableState)
	const now = Date.now()

	if (json === lastPersistedState && now - lastPersistedAt < PERSIST_THROTTLE_MS) return

	lastPersistedState = json
	lastPersistedAt = now

	try {
		window.localStorage.setItem(STORAGE_KEY, json)
	} catch {
		// Ignore storage write issues (private mode, quota, etc.)
	}
}

playerState.listen((state) => {
	persistPlayerState(state)
})

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
