"use client";

import React from "react";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";
import { useApi } from "@/hooks/useApi";
import { TokenOHLCV, TopTokenHolder } from "@/interfaces/tokens";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OHLCTable = () => {
	const apiService = new MarketTokensApiService();
	const { data, loading, error } = useApi<TokenOHLCV[]>(() =>
		apiService.getTokenPriceOHLCV(
			"5d16cc1a177b5d9ba9cfa9793b07e60f1fb70fea1f8aef064415d114494147",
			"",
			"1d",
			365
		)
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!data) return <div>No data available</div>;

	return (
		<div className="flex w-screen">
			<div className="rounded-md border m-auto" >
			
			</div>
		</div>
	);
};

export default OHLCTable;
