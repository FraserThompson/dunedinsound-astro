//@ts-nocheck
/**
 * React wrapper for lite YouTube Component which doesnt immediately load 
 * tonnes of Google rubbish.
 * 
 * There are two wrappers so we can use it in React components too.
 * 
 * ts-nocheck is because lite-youtube throws an error.
 */

import { useCallback, useEffect, useRef, type MutableRef } from "preact/hooks"
import type { FunctionalComponent } from "preact"

interface Props {
	videoid: string
	loadAPI?: boolean
	autoload?: boolean
}

const LiteYoutube: FunctionalComponent<Props> = ({ videoid, loadAPI, autoload }) => {

	const ytPlayer: MutableRef<any> = useRef()
	const timeout: MutableRef<any> = useRef()
	const attempts: MutableRef<number> = useRef(0)
	
	/**
	 * Use the YouTube API to autoplay when the iframe loads.
	 */
	const autoPlay = useCallback((e: any) => {
		// If we've already done it, get out
		if (ytPlayer.current) return

		// Get the actual iframe so we can initialize the API
		const youtubeIframe = e.target?.shadowRoot.querySelector('iframe')
		if (!youtubeIframe) return

		try {
			// @ts-ignore
			const player = new YT.Player(youtubeIframe, {
				events: {
					onReady: (e) => playVideo(e)
				}
			})
			if (player) ytPlayer.current = player
		} catch (e) {
			return
		}
	}, [])

	/**
	 * Plays the video via the YouTube API.
	 */
	const playVideo = useCallback((e) => {
		if (!ytPlayer.current) return
		// @ts-ignore
		ytPlayer.current?.setPlaybackQuality('hd720')
		// @ts-ignore
		ytPlayer.current?.playVideo()
	}, [])

	/**
	 * Since it can take a sec for the iframe to load in, we attempt autoplay multiple times.
	 * @param e
	 */
	const trySetupAutoplay = useCallback((e: any) => {

		// If the videoId has changed then our previous iframe is invalid
		if (e.detail.videoId !== videoid) {
			delete ytPlayer.current
		}

		// Consider failed
		if (attempts.current > 10) {
			timeout.current && clearTimeout(timeout.current)
			attempts.current = 0
			return
		}

		attempts.current = attempts.current + 1

		// If there's an iframe and it's not playing, then try to play again.
		// It should have already played via onReady but maybe it didnt.
		// @ts-ignore
		if (ytPlayer.current && ytPlayer.current.getPlayerState() <= 0) {
			playVideo()
		} else if (ytPlayer.current) {
			timeout.current && clearTimeout(timeout.current)
			return
		}

		// Try to autoplay.
		autoPlay(e)

		// If it fails setup a timeout so it tries again
		if (!ytPlayer.current) {
			timeout.current = setTimeout(() => trySetupAutoplay(e), 100)
		}

	}, [autoPlay])

	useEffect(() => {
		// This is because web components have issues with SSR rendering
		import("@justinribeiro/lite-youtube")
		document.addEventListener('liteYoutubeIframeLoaded', trySetupAutoplay)
		return () => document.removeEventListener('liteYoutubeIframeLoaded', trySetupAutoplay)
	}, [])

	return (
		<>
			{loadAPI && <script src="https://www.youtube.com/iframe_api" />}
			<lite-youtube
				autoload={autoload}
				videoid={videoid}
				nocookie={'true'}
				posterquality="maxresdefault"
				params="enablejsapi=1&rel=0">
			</lite-youtube>
		</>
	)
}

export default LiteYoutube
