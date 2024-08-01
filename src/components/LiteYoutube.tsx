//@ts-nocheck
/**
 * React wrapper for lite YouTube Component which doesnt immediately load 
 * tonnes of Google rubbish.
 * 
 * There are two wrappers so we can use it in React components too.
 * 
 * ts-nocheck is because lite-youtube throws an error.
 */

import type React from "preact/compat"
import { useCallback, useEffect } from "preact/compat"

interface Props {
	videoid: string
	loadAPI?: boolean
	autoload?: boolean
}

const LiteYoutube: React.FC<Props> = ({ videoid, loadAPI, autoload }) => {

	const autoPlay = useCallback((e: any) => {
		// @ts-ignore
		new YT.Player(e.target.shadowRoot.querySelector('iframe'), {
			events: {
				onReady: (e: any) => {
					e.target.setPlaybackQuality('hd720')
					e.target.playVideo()
				}
			}
		})
	}, [])

	const tryAutoplay = useCallback((e: any) => {
		try {
			autoPlay(e)
		} catch (error) {
			setTimeout(() => tryAutoplay(e), 100)
		}
	}, [autoPlay])

	useEffect(() => {
		// This is because web components have issues with SSR rendering
		import("@justinribeiro/lite-youtube")
		document.addEventListener('liteYoutubeIframeLoaded', (e: any) => tryAutoplay(e))
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
