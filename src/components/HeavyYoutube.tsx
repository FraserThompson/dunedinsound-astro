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
			type="text/html"
			src={`https://www.youtube-nocookie.com/embed/${videoid}?enablejsapi=1`}
			frameborder="0"
			style={{
				width: '100%',
				aspectRatio: '16/9'
			}}
		>
		</iframe>
	</>

export default HeavyYoutube
