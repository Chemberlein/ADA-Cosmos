import { MarketTokensApiService } from "@/services/MarketTokensApiService";
import { MetricsApiService } from "@/services/MetricsApiService";
import { NftApiService } from "@/services/NftApiService";

export interface SunMarketData {
	adaPrice: number;
	dexVolume: number;
	activeAddresses: number;
	nftVolume: number;
}

export interface Token {
	unit: string;
	ticker: string;
	mcap: number;
}

export async function getTokensData(): Promise<{
	tokens: Token[];
	sunMarketData: SunMarketData;
}> {
	const marketTokensApi = new MarketTokensApiService();
	const metricsApi = new MetricsApiService();
	const nftApi = new NftApiService();

	// Fetch top market cap tokens
	const tokens = await marketTokensApi.getTopMarketCapTokens("mcap", 1, 10);

	// Fetch market data for the central (sun) node
	const quotePriceRes = await marketTokensApi.getQuotePrice("USD");
	const metricsRes = await metricsApi.getMarketStats("ADA");
	const nftStatsRes = await nftApi.getMarketStats("24h");

	const sunMarketData: SunMarketData = {
		adaPrice: quotePriceRes.price,
		dexVolume: metricsRes.dexVolume,
		activeAddresses: metricsRes.activeAddresses,
		nftVolume: nftStatsRes.volume,
	};

	return { tokens, sunMarketData };
}