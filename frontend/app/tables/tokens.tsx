"use client";

import React from "react";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";
import { useApi } from "@/hooks/useApi";
import { TokenOHLCV, TopTokenHolder } from "@/interfaces/tokens";

const TopTokenHolders = () => {
	const apiService = new MarketTokensApiService();
	const { data, loading, error } = useApi<TokenOHLCV[]>(() =>
		apiService.getTokenPriceOHLCV(
			"5d16cc1a177b5d9ba9cfa9793b07e60f1fb70fea1f8aef064415d114494147",
			"0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.39b9b709ac8605fc82116a2efc308181ba297c11950f0f350001e28f0e50868b",
			"1d",
			365
		)
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!data) return <div>No data available</div>;

	return (
		<div>
			<h1>Top Token Holders</h1>
			<ul>
						<li>Time, Open, High, Low, Close</li>
				{data.map((instance) => (
						<li>{instance.time}, {instance.open}, {instance.high}, {instance.low}, {instance.close}</li>
				))}
			</ul>
		</div>
	);
};

export default TopTokenHolders;
