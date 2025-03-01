"use client";

import React from "react";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";
import { useApi } from "@/hooks/useApi";
import { TokenOHLCV, TopLiquidityToken, TopTokenHolder } from "@/interfaces/tokens";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TopLiquidityTokens = () => {
	const apiService = new MarketTokensApiService();
	const { data, loading, error } = useApi<TopLiquidityToken[]>(() =>
		apiService.getTopLiquidityTokens(
			1,
			200
		)
	);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!data) return <div>No data available</div>;

	return (
		<div className="flex w-screen">
			<div className="rounded-md border m-auto" >
				<Table>
					<TableHeader>
						<TableRow>	
							<TableHead> 
							Liquidity
							</TableHead>
							<TableHead> 
							Price
							</TableHead>
							<TableHead> 
							Ticker 
							</TableHead>
							<TableHead> 
							Unit
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
					{
						data.map((instance) => (
						<TableRow>
							<TableCell>	
								{instance.liquidity}
							</TableCell>
							<TableCell>	
								{instance.price}
							</TableCell>
							<TableCell>	
								{instance.ticker}
							</TableCell>
							<TableCell>	
								{instance.unit}
							</TableCell>
						</TableRow>
						))
					}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default TopLiquidityTokens;
