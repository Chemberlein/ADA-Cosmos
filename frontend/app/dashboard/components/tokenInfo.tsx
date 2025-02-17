"use client";

import React from "react";
import { IntegrationApiService } from "@/services/IntegrationApiService";
import { useApi } from "@/hooks/useApi";
import { Asset } from "@/interfaces/integration";

const TokenById = () => {
	const apiService = new IntegrationApiService();
	const { data, loading, error } = useApi<{ asset: Asset }>(
		() =>
			apiService.getAssetById(
				"279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f534e454b"
			),
		[] // run on mount
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	const token = data?.asset;

	return (
		<div>
			<h1>Token By Id</h1>
			<p>Name: {token?.name}</p>
			<p>Symbol: {token?.symbol}</p>
			<p>Total Supply: {token?.totalSupply}</p>
			<p>Circulating Supply: {token?.circulatingSupply}</p>
		</div>
	);
};

export default TokenById;
