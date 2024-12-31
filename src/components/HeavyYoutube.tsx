/**
 * This is a regular YouTube embed without any lazy loading stuff.
 */

import type { FunctionalComponent } from "preact"

interface Props {
	videoid: string
}

const HeavyYoutube: FunctionalComponent<Props> = ({ videoid }) =>
	<>
		<script src="https://www.youtube.com/iframe_api" />
		<iframe
			id="player"
			src={`https://www.youtube-nocookie.com/embed/${videoid}?enablejsapi=1`}
			style={{
				width: '100%',
				aspectRatio: '16/9',
				border: '0'
			}}
		>
		</iframe>
	</>

export default HeavyYoutube
