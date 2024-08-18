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

interface Props {
	videoid: string
	loadAPI?: boolean
	autoload?: boolean
}

const LiteYoutube: React.FC<Props> = ({ videoid, loadAPI, autoload }) => {

	const timeout: MutableRef<any> = useRef()
	const attempts: MutableRef<number> = useRef(0)

	const setupAutoPlay = useCallback((e: any) => {
		const youtubeIframe = e.target.shadowRoot.querySelector('iframe')
		// @ts-ignore
		new YT.Player(youtubeIframe, {
			events: {
				onReady: (e: any) => {
					e.target.setPlaybackQuality('hd720')
					e.target.playVideo()
				}
			}
		})
	}, [])

	const trySetupAutoplay = useCallback((e: any) => {
		// So elements dont respond to other elements events
		// Consider failed after 20 attempts
		if (attempts.current > 20) {
			timeout.current && clearTimeout(timeout.current)
			return
		}

		attempts.current = attempts.current + 1

		try {
			setupAutoPlay(e)
			timeout.current && clearTimeout(timeout.current)
		} catch (error) {
			timeout.current = setTimeout(() => trySetupAutoplay(e), 100)
		}
	}, [setupAutoPlay])

	useEffect(() => {
		// This is because web components have issues with SSR rendering
		import("@justinribeiro/lite-youtube")
		document.addEventListener('liteYoutubeIframeLoaded', (e: any) => trySetupAutoplay(e))
	}
		, [])

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
