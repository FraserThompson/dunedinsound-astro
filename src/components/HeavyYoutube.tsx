/**
 * This is a regular YouTube embed that autoplays (muted) on load using the IFrame API.
 */

import type { FunctionalComponent } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"

interface Props {
	videoid: string
	autoplay?: boolean
	onEnded?: () => void
}

const HeavyYoutube: FunctionalComponent<Props> = ({ videoid, onEnded = null, autoplay = false }) => {
	const idRef = useRef(`player-${Math.random().toString(36).slice(2, 9)}`)
	const playerRef = useRef<any | null>(null)
	const iframeRef = useRef<HTMLIFrameElement | null>(null)
	const [started, setStarted] = useState(false)
	const [loading, setLoading] = useState(false)
	const shouldAutoplayRef = useRef(false)
	const previousStateRef = useRef<number | null>(null)

	useEffect(() => {
		let cancelled = false
		const id = idRef.current
		let player: any = null
		let stateCheckInterval: any = null
		
		const onAPIReady = () => {
			if (cancelled) return
			const YT = (window as any).YT
			player = new YT.Player(id, {
				videoId: videoid,
				playerVars: { rel: 0, modestbranding: 1 },
				events: {
					onReady: (event: any) => {
						playerRef.current = event.target

						// Start polling for state changes since event handlers don't persist
						stateCheckInterval = setInterval(() => {
							const currentState = playerRef.current?.getPlayerState()
							if (currentState !== previousStateRef.current) {
								previousStateRef.current = currentState
								console.log('State change (polled):', currentState, 'ENDED:', YT.PlayerState.ENDED, 'CUED:', YT.PlayerState.CUED)
								
								if (shouldAutoplayRef.current && currentState === YT.PlayerState.CUED) {
									shouldAutoplayRef.current = false
									setLoading(true);
									setTimeout(() => {
										playerRef.current?.unMute?.()
										playerRef.current?.playVideo?.()
										setLoading(false);
									}, 2000)
								}
								if (currentState === YT.PlayerState.ENDED) {
									console.log('Video ended, calling callback')
									onEnded?.()
								}
							}
						}, 100)
					}
				}
			})
		}

		if ((window as any).YT && (window as any).YT.Player) {
			onAPIReady()
		} else {
			; (window as any).onYouTubeIframeAPIReady = onAPIReady
			if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
				const s = document.createElement("script")
				s.src = "https://www.youtube.com/iframe_api"
				document.body.appendChild(s)
			}
		}

		return () => {
			cancelled = true
			if (stateCheckInterval) {
				clearInterval(stateCheckInterval)
			}
			try {
				if (playerRef.current) {
					playerRef.current.destroy()
				}
			} catch (e) { }
			if ((window as any).onYouTubeIframeAPIReady === onAPIReady) {
				; (window as any).onYouTubeIframeAPIReady = undefined
			}
		}
	}, [])

	useEffect(() => {
		const player = playerRef.current
		if (!player) return
		try {
			if (autoplay && started) {
				shouldAutoplayRef.current = true
			}
			player.cueVideoById(videoid)
		} catch (e) { /* ignore */ }
	}, [videoid, autoplay, started])

	const onStartClick = () => {
		setStarted(true)
		const p = playerRef.current
		try { p?.unMute?.(); p?.playVideo?.() } catch (e) { }
	}

	return (
		<div style={{ position: "relative" }}>
			<iframe
				id={idRef.current}
				ref={iframeRef}
				src={`https://www.youtube-nocookie.com/embed/${videoid}?enablejsapi=1`}
				style={{
					width: "100%",
					aspectRatio: "16/9",
					border: 0
				}}
				allow="autoplay; encrypted-media; picture-in-picture"
				allowFullScreen
				title="YouTube video player"
			/>

			{autoplay && (!started || loading) && (
				<div style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35))",
					zIndex: 10
				}}>
					{!started && <button
						onClick={onStartClick}
						style={{
							height: "50px",
							fontSize: "1rem",
							fontFamily: "monospace",
							borderRadius: "20px",
							border: "none",
							background: "#e53e3e",
							color: "white",
							cursor: "pointer"
						}}
					>
						Start playing
					</button>}
					{loading && (
						<div style={{
							backgroundColor: "black"
						}}><p className={"trippy"} style={{
							fontSize: "1rem",
							fontFamily: "monospace"
						}}>Get ready...</p></div>
					)}
				</div>
			)}
		</div>
	)
}

export default HeavyYoutube
