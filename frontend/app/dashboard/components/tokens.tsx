"use client";

import React from "react";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";
import { useApi } from "@/hooks/useApi";
import { TopTokenHolder } from "@/interfaces/tokens";

const TopTokenHolders = () => {
	const apiService = new MarketTokensApiService();
	const { data, loading, error } = useApi<TopTokenHolder[]>(() =>
		apiService.getTopTokenHolders(
			"5d16cc1a177b5d9ba9cfa9793b07e60f1fb70fea1f8aef064415d114494147"
		)
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!data) return <div>No data available</div>;

	return (
		<div>
			<h1>Top Token Holders</h1>
			<ul>
				{data.map((holder) => (
					<li key={holder.address}>
						{holder.address}: {holder.amount}
					</li>
				))}
			</ul>
		</div>
	);
};

export default TopTokenHolders;
