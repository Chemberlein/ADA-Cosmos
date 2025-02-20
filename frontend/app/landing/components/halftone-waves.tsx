"use client";

import { useEffect, useRef } from "react";

export default function Component() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;
		let time = 0;
		const gridSize = 8;
		const twoPi = Math.PI * 2;

		// Resize canvas to fit window dimensions.
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		// Debounce the resize events to avoid excessive recalculations.
		let resizeTimeout: number | null = null;
		const handleResize = () => {
			if (resizeTimeout) clearTimeout(resizeTimeout);
			resizeTimeout = window.setTimeout(resizeCanvas, 100);
		};

		const drawHalftoneWave = () => {
			const { width, height } = canvas;
			const rows = Math.ceil(height / gridSize);
			const cols = Math.ceil(width / gridSize);
			const centerX = width / 2;
			const centerY = height / 2;
			const maxDistance = Math.sqrt(
				centerX * centerX + centerY * centerY
			);

			for (let y = 0; y < rows; y++) {
				const posY = y * gridSize;
				for (let x = 0; x < cols; x++) {
					const posX = x * gridSize;
					const dx = posX - centerX;
					const dy = posY - centerY;
					const distance = Math.sqrt(dx * dx + dy * dy);
					const normalizedDistance = distance / maxDistance;
					const waveOffset =
						Math.sin(normalizedDistance * 5 - time) * 0.5 + 0.5;
					const size = gridSize * waveOffset * 0.75;

					ctx.beginPath();
					ctx.arc(posX, posY, size / 2, 0, twoPi);
					ctx.fillStyle = `rgba(255, 255, 255, ${waveOffset * 0.5})`;
					ctx.fill();
				}
			}
		};

		const animate = () => {
			ctx.fillStyle = "rgba(1, 51, 174, 0.8)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			drawHalftoneWave();
			time += 0.03;
			animationFrameId = requestAnimationFrame(animate);
		};

		resizeCanvas();
		window.addEventListener("resize", handleResize);
		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
			if (resizeTimeout) clearTimeout(resizeTimeout);
		};
	}, []);

	return <canvas ref={canvasRef} className="w-full h-screen bg-black" />;
}
