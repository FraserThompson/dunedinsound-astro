/**
 * The Visualizer for the player. 
 * 
 * Must be instantiated inside a PlayerProvider.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./PlayerContext"

interface Props {
}

const PlayerVisualizer: FunctionalComponent<Props> = () => {
	const { wavesurfer } = usePlayer()

	wavesurfer?.once('play', () => {
		const audioContext = new AudioContext()
		const audio = wavesurfer.getMediaElement()
		const mediaNode = audioContext.createMediaElementSource(audio)
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 2048;
		mediaNode.connect(analyser);
		analyser.connect(audioContext.destination);

		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		analyser.getByteTimeDomainData(dataArray);

		console.log(dataArray)
	})

	return (
		<div></div>
	)
}

export default PlayerVisualizer
