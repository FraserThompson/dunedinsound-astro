import { useEffect, useRef } from "preact/hooks"
import type { FunctionalComponent } from "preact"
import { CurrentTrackStatusText } from "./player/PlayerCurrentTrack.css"
import { CurrentTrackMarquee, CurrentTrackText } from "./MarqueeText.css"

interface Props {
	text?: string
	placeholder?: string
	isPlaying: boolean
	speedPxPerSec?: number
	spacer?: string
}

export const MarqueeText: FunctionalComponent<Props> = ({
	text,
	placeholder,
	isPlaying,
	spacer = " ** ",
	speedPxPerSec = 40,
}) => {
	const textRef = useRef<HTMLDivElement>(null)
	const itemRef = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const textEl = textRef.current
		const itemEl = itemRef.current

		if (!textEl || !itemEl) return

		if (!isPlaying) {
			textEl.style.transform = "translateX(0px)"
			return
		}

		let animId: number

		const update = () => {
			const itemWidth = itemEl.offsetWidth
			if (itemWidth === 0) return

			// Duration to scroll exactly ONE text item's width
			const durationMs = (itemWidth / speedPxPerSec) * 1000

			// Offset calculated strictly from browser global time
			const elapsedMs = performance.now() % durationMs
			const currentX = (elapsedMs / durationMs) * itemWidth

			textEl.style.transform = `translateX(-${currentX}px)`
			animId = requestAnimationFrame(update)
		}

		animId = requestAnimationFrame(update)
		return () => cancelAnimationFrame(animId)
	}, [isPlaying, text, speedPxPerSec])


	const displayText = text + spacer

	return (
		<div className={CurrentTrackMarquee}>
			<div
				ref={textRef}
				className={CurrentTrackText}
			>
				{text && Array.from({ length: 10 }).map((_, i) => (
					<span key={i} className={CurrentTrackStatusText} ref={i === 0 ? itemRef : undefined}>
						{displayText}
					</span>
				))}
				{!text && placeholder && <span className={CurrentTrackStatusText} style={{ paddingLeft: "5px" }}>{placeholder}</span>}
			</div>
		</div>
	)
}
