"use client";

import FocusGraph from "./components/FocusGraphWrapper";
import TokenById from "./components/tokenInfo";
import TopTokenHolders from "./components/tokens";

export default function Dashboard() {
	return (
		<main className="overflow-hidden">
			<FocusGraph />
		</main>
	);
}
