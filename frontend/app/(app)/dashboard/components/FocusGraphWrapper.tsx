"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingGraph from "./LoadingGraph";

// Dynamically import with code splitting
const FocusGraph = dynamic(() => import("./FocusGraph"), {
	ssr: false,
	loading: () => <LoadingGraph stage="initial" />,
});

export default function FocusGraphWrapper(props: { data: any }) {
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
			<FocusGraph {...props} />
		</div>
	);
}
