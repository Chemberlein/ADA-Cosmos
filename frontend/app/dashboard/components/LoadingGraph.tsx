import React from "react";

interface LoadingGraphProps {
	message?: string;
	stage?: "initial" | "loading" | "finalizing";
}

const LoadingGraph: React.FC<LoadingGraphProps> = ({
	message = "Loading Cardano Ecosystem",
	stage = "initial",
}) => {
	const stageText = {
		initial: "Initializing...",
		loading: "Building visualization...",
		finalizing: "Rendering final details...",
	};

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10">
			<div className="text-center text-white">
				<h3 className="text-xl font-bold mb-2">{message}</h3>
				<p className="text-sm opacity-80">{stageText[stage]}</p>
				<div className="mt-4 flex justify-center space-x-2">
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
							style={{
								animationDelay: `${i * 0.2}s`,
								opacity:
									stage === "finalizing" && i < 2
										? "1"
										: stage === "loading" && i < 1
										? "1"
										: "0.4",
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default LoadingGraph;
