"use client";
import React from "react";
import dynamic from "next/dynamic";
import "@dexhunterio/swaps/lib/assets/style.css";

const Swap = dynamic(() => import("@dexhunterio/swaps"), {
	ssr: false,
});

const SwapComponent: React.FC = () => {

	return (
		<Swap
			partnerName="ADAK"
			partnerCode={process.env.DEXHUNTER_API_KEY!}
		/>
	);
};

export default SwapComponent;