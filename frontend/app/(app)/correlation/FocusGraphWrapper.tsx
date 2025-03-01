// app/(app)/correlation/FocusGraphWrapper.tsx
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import LoadingGraph from "../dashboard/components/LoadingGraph";

// Dynamically import the graph component to avoid SSR issues
const CorrelationGraph = dynamic(() => import("./graph"), {
	ssr: false,
	loading: () => <LoadingGraph stage="initial" />,
});

export default function FocusGraphWrapper() {
	const [isLoading, setIsLoading] = useState(true);
	const [loadingStage, setLoadingStage] = useState<
		"initial" | "loading" | "finalizing"
	>("initial");

	useEffect(() => {
		// Show different loading stages
		setLoadingStage("initial");

		const timer1 = setTimeout(() => {
			setLoadingStage("loading");
		}, 400);

		const timer2 = setTimeout(() => {
			setLoadingStage("finalizing");
		}, 800);

		const timer3 = setTimeout(() => {
			setIsLoading(false);
		}, 1200);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	}, []);

	return (
		<div className="h-[100vh] w-full relative">
			{isLoading && <LoadingGraph stage={loadingStage} />}
			<CorrelationGraph />
		</div>
	);
}
