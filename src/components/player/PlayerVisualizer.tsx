/**
 * The Visualizer for the player. 
 * Must be instantiated inside a PlayerProvider.
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./PlayerContext"
import { useEffect, useRef } from "preact/hooks"

interface Props {
	width?: number;
	height?: number;
	lineColor?: string;
	backgroundColor?: string;
}

const PlayerVisualizer: FunctionalComponent<Props> = ({
	width = 230,
	height = 18,
	lineColor = 'rgba(255, 255, 255, 1)',
	backgroundColor = 'rgba(0, 0, 0, 0)'
}) => {
	const { wavesurfer } = usePlayer()

	const isInitialized = useRef(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		let animationFrameId: number;

		const initAudioAndDraw = () => {
			// If we already set this up, don't do it again
			if (isInitialized.current || !wavesurfer) return;
			isInitialized.current = true;

			const audioContext = new AudioContext();
			if (audioContext.state === 'suspended') {
				audioContext.resume();
			}

			const audio = wavesurfer.getMediaElement();
			const mediaElementSource = audioContext.createMediaElementSource(audio);
			const analyser = audioContext.createAnalyser();

			analyser.fftSize = 128;
			mediaElementSource.connect(analyser);
			analyser.connect(audioContext.destination);

			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);

			const draw = () => {
				animationFrameId = requestAnimationFrame(draw);

				const canvas = canvasRef.current;
				const canvasCtx = canvas?.getContext('2d');
				if (!canvas || !canvasCtx) return;

				analyser.getByteTimeDomainData(dataArray);

				canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
				canvasCtx.fillStyle = backgroundColor;
				canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

				let isSilent = true;
				for (let i = 0; i < bufferLength; i++) {
					if (dataArray[i] !== 128) {
						isSilent = false;
						break;
					}
				}

				if (isSilent) return;

				canvasCtx.lineWidth = 2;
				canvasCtx.strokeStyle = lineColor;
				canvasCtx.beginPath();

				const step = 3;
				const sliceWidth = canvas.width * 1.0 / bufferLength;
				let x = 0;

				for (let i = 0; i < bufferLength; i += step) {
					const v = dataArray[i] / 128.0;
					const y = v * (canvas.height / 2);

					if (i === 0) {
						canvasCtx.moveTo(x, y);
					} else {
						canvasCtx.lineTo(x, y);
					}

					// Multiply sliceWidth by step so the waveform still stretches across the whole canvas!
					x += sliceWidth * step;
				}

				canvasCtx.lineTo(canvas.width, canvas.height / 2);
				canvasCtx.stroke();
			};

			draw();
		};

		wavesurfer?.on('play', initAudioAndDraw);

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
			wavesurfer?.un('play', initAudioAndDraw);
		}
	}, [wavesurfer, backgroundColor, lineColor]);

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			style={{ display: 'block', maxWidth: '100%' }}
		/>
	)
}

export default PlayerVisualizer
