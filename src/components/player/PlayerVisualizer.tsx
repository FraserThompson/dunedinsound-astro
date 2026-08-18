/**
 * The Visualizer for the player.
 * 
 * Calculates width dynamically based on parent container size.
 * 
 * width: Fixed width, overrides dynamic calculation.
 * height: Fixed height.
 * lineColor: Color of the wiggly line.
 * backgroundColor: Color of the background.
 * 
 */

import type { FunctionalComponent } from "preact"
import { usePlayer } from "./usePlayer"
import { useEffect, useRef } from "preact/hooks"

// Clamp a number to the normalized audio range.
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

// Convert arbitrary peak JSON into a single 0..1 envelope array.
// Supports common [min, max, min, max, ...] data as well as simple arrays.
const buildEnvelope = (rawPeaks: number[]) => {
	if (!rawPeaks.length) return [] as number[];

	const isLikelyMinMaxInterleaved =
		rawPeaks.length % 2 === 0 &&
		rawPeaks.slice(0, Math.min(rawPeaks.length, 256)).every((value, i) =>
			i % 2 === 0 ? value <= 0 : value >= 0
		);

	if (isLikelyMinMaxInterleaved) {
		const envelope: number[] = [];
		for (let i = 0; i < rawPeaks.length; i += 2) {
			const min = rawPeaks[i] ?? 0;
			const max = rawPeaks[i + 1] ?? min;
			envelope.push(clamp01(Math.max(Math.abs(min), Math.abs(max))));
		}
		return envelope;
	}

	return rawPeaks.map((value) => clamp01(Math.abs(value)));
};

// Sample an array at fractional positions with linear interpolation.
const sampleLinear = (values: number[], pos: number) => {
	if (!values.length) return 0;
	const clampedPos = Math.max(0, Math.min(values.length - 1, pos));
	const i0 = Math.floor(clampedPos);
	const i1 = Math.min(values.length - 1, i0 + 1);
	const frac = clampedPos - i0;
	const a = values[i0] ?? 0;
	const b = values[i1] ?? a;
	return a * (1 - frac) + b * frac;
};

interface Props {
	width?: number;
	height?: number;
	lineColor?: string;
	backgroundColor?: string;
}

const PlayerVisualizer: FunctionalComponent<Props> = ({
	width = 230,
	height = 18,
	lineColor = 'rgba(231, 209, 171, 0.4)',
	backgroundColor = 'rgba(0, 0, 0, 0)'
}) => {
	// Read playback state and peak data from the player context.
	const { wavesurfer, currentPeaks } = usePlayer();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>();
	const pointLevelsRef = useRef<number[]>([]);
	const prevPeakRef = useRef(0);
	const energyRef = useRef(0);
	const phaseRef = useRef(0);
	const sizeRef = useRef({ width, height });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const syncSize = () => {
			const parentWidth = canvas.parentElement?.clientWidth;
			const nextWidth = Math.max(1, Math.floor(parentWidth ?? width));
			const nextHeight = Math.max(1, Math.floor(height));
			const dpr = window.devicePixelRatio || 1;

			sizeRef.current = { width: nextWidth, height: nextHeight };

			canvas.style.width = `${nextWidth}px`;
			canvas.style.height = `${nextHeight}px`;

			const pixelWidth = Math.max(1, Math.floor(nextWidth * dpr));
			const pixelHeight = Math.max(1, Math.floor(nextHeight * dpr));

			if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
				canvas.width = pixelWidth;
				canvas.height = pixelHeight;
			}

			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};

		syncSize();

		const observed = canvas.parentElement ?? canvas;
		const resizeObserver = new ResizeObserver(syncSize);
		resizeObserver.observe(observed);

		window.addEventListener('resize', syncSize);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener('resize', syncSize);
		};
	}, [height, width]);

	useEffect(() => {
		if (!wavesurfer) return;
		const envelope = buildEnvelope(currentPeaks);
		if (!envelope.length) return;

		// Draw one animation frame using only the current playback position.
		const draw = () => {
			animationRef.current = requestAnimationFrame(draw);

			const canvas = canvasRef.current;
			const ctx = canvas?.getContext('2d');

			if (!canvas || !ctx) return;
			const dpr = window.devicePixelRatio || 1;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const duration = wavesurfer.getDuration();
			if (!duration) return;

			const currentTime = wavesurfer.getCurrentTime();
			const exactIndex = (currentTime / duration) * (envelope.length - 1);
			const peakNow = sampleLinear(envelope, exactIndex);

			// React to immediate changes in amplitude to emphasize transients.
			const transient = clamp01(Math.abs(peakNow - prevPeakRef.current) * 10);
			prevPeakRef.current = peakNow;

			const drive = clamp01(peakNow * 0.72 + transient * 1.35);
			const prevEnergy = energyRef.current;
			energyRef.current = drive > prevEnergy
				? prevEnergy + (drive - prevEnergy) * 0.9
				: prevEnergy * 0.78 + drive * 0.22;

			phaseRef.current += 0.28 + energyRef.current * 0.82 + transient * 0.65;

			const canvasWidth = sizeRef.current.width;
			const canvasHeight = sizeRef.current.height;

			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);

			const pointCount = 110;
			const pointWidth = canvasWidth / (pointCount - 1);
			const centerY = canvasHeight / 2;
			const amplitude = centerY * 1.9;
			const harmonicA = 0.62;
			const harmonicB = 0.38;

			if (pointLevelsRef.current.length !== pointCount) {
				pointLevelsRef.current = Array.from({ length: pointCount }, () => 0);
			}

			ctx.beginPath();
			ctx.lineWidth = 1.4;
			ctx.strokeStyle = lineColor;
			ctx.globalAlpha = 0.96;

			let x = 0;
			for (let i = 0; i < pointCount; i++) {
				const u = pointCount <= 1 ? 0 : i / (pointCount - 1);
				const edge = Math.pow(Math.sin(u * Math.PI), 0.85);
				const p = phaseRef.current + i * 0.26;
				const wave = Math.sin(p) * harmonicA + Math.sin(p * 1.9) * harmonicB;
				const target = wave * energyRef.current * edge;

				const previous = pointLevelsRef.current[i] ?? 0;
				const smoothed = previous + (target - previous) * 0.64;

				pointLevelsRef.current[i] = smoothed;

				const y = centerY - smoothed * amplitude;
				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}

				x += pointWidth;
			}

			ctx.stroke();

			// Subtle glow pass so transients read at a glance.
			ctx.lineWidth = 3;
			ctx.globalAlpha = 0.22;
			ctx.stroke();

			ctx.globalAlpha = 1;
		};

		// Clear the visualizer area when playback is stopped.
		const drawIdle = () => {
			const canvas = canvasRef.current;
			const ctx = canvas?.getContext('2d');
			if (!canvas || !ctx) return;
			const dpr = window.devicePixelRatio || 1;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, sizeRef.current.width, sizeRef.current.height);
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, sizeRef.current.width, sizeRef.current.height);
		};

		// Start the animation loop when audio starts playing.
		const start = () => {
			if (!animationRef.current) {
				draw();
			}
		};

		// Stop animation and reset state when playback pauses/finishes.
		const stop = () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = undefined;
			}
			pointLevelsRef.current = [];
			energyRef.current = 0;
			prevPeakRef.current = 0;
			drawIdle();
		};

		wavesurfer.on('play', start);
		wavesurfer.on('pause', stop);
		wavesurfer.on('finish', stop);

		if (wavesurfer.isPlaying()) {
			start();
		} else {
			drawIdle();
		}

		return () => {
			stop();
			wavesurfer.un('play', start);
			wavesurfer.un('pause', stop);
			wavesurfer.un('finish', stop);
		};
	}, [wavesurfer, currentPeaks, backgroundColor, lineColor]);

	return (
		<div style={{ position: 'absolute', width: '100%', top: '0px', overflow: 'hidden' }}>
			<canvas
				ref={canvasRef}
				style={{ display: 'block', width: '100%', maxWidth: '100%' }}
			/>
		</div>
	);
};

export default PlayerVisualizer;
