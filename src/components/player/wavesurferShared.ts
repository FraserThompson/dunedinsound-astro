import WaveSurfer from "wavesurfer.js"

declare global {
	interface Window {
		__dunedinsoundPlayerAudio?: HTMLAudioElement
	}
}

interface LoadWaveSurferTrackArgs {
	wavesurfer: WaveSurfer
	trackFile: string
	peaksFile: string
	isCurrentRequest: () => boolean
	onPeaks?: (peaks: number[]) => void
	onError?: (error: unknown) => void
}

export const wavesurferOptions = {
	waveColor: "#bfced9",
	height: 60,
	hideScrollbar: true,
	normalize: true,
	progressColor: "#fffadf",
	barWidth: 2,
}

/**
 * Instantiates a WaveSurfer element.
 * 
 * @param container 
 * @param media 
 * @returns 
 */
export const createStyledWaveSurfer = (container: HTMLElement, media?: HTMLMediaElement) => {
	return WaveSurfer.create({ container, media, ...wavesurferOptions })
}

/**
 * We use one AudioElement so playback can persist between pages.
 * 
 * This method makes it.
 */
export const getOrCreateSharedPlayerAudioElement = () => {
	if (typeof window === "undefined") {
		return undefined
	}

	if (!window.__dunedinsoundPlayerAudio) {
		const audio = document.createElement("audio")
		audio.preload = "auto"
		audio.setAttribute("playsinline", "")
		audio.setAttribute("webkit-playsinline", "")
		window.__dunedinsoundPlayerAudio = audio
	}

	return window.__dunedinsoundPlayerAudio
}

const peaksCache = new Map<string, number[]>()
const inflightPeaksRequests = new Map<string, Promise<number[]>>()

const parsePeaksPayload = (payload: unknown): number[] => {
	const peaks =
		typeof payload === "object" && payload !== null && "data" in payload
			? (payload as { data: unknown }).data
			: payload

	if (!Array.isArray(peaks)) {
		throw new Error("Invalid peaks payload")
	}

	return peaks as number[]
}

export const loadWaveSurferTrack = async ({
	wavesurfer,
	trackFile,
	peaksFile,
	isCurrentRequest,
	onPeaks,
	onError,
}: LoadWaveSurferTrackArgs) => {

	// Try cache first
	const cachedPeaks = peaksCache.get(peaksFile)
	if (cachedPeaks) {
		if (!isCurrentRequest()) return
		onPeaks?.(cachedPeaks)
		return wavesurfer.load(trackFile, [cachedPeaks])
	}

	// Fetch if not in cache...
	let peaksRequest = inflightPeaksRequests.get(peaksFile)
	if (!peaksRequest) {
		peaksRequest = fetch(peaksFile.replace("#", "%23"))
			.then((response) => response.json())
			.then((data: unknown) => {
				const peaks = parsePeaksPayload(data)
				peaksCache.set(peaksFile, peaks)
				return peaks
			})
			.finally(() => {
				inflightPeaksRequests.delete(peaksFile)
			})

		inflightPeaksRequests.set(peaksFile, peaksRequest)
	}

	return peaksRequest
		.then((peaks) => {
			if (!isCurrentRequest()) return
			onPeaks?.(peaks)
			return wavesurfer.load(trackFile, [peaks])
		})
		.catch((error) => {
			if (!isCurrentRequest()) return
			onError?.(error)
		})
}

export const formatTime = (time?: number) => {
	if (time == null) return "0:00"
	const mins = Math.floor(time / 60)
	const secs = String(Math.floor(time % 60)).padStart(2, "0")
	return `${mins}:${secs}`
}
