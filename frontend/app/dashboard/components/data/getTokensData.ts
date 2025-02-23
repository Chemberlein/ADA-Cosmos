// app/dashboard/components/data/getTokensData.ts
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

// Extend your token interface to include socials data
export interface TokenWithSocials extends Token {
	socials: {
		description: string;
		discord: string;
		email: string;
		facebook: string;
		github: string;
		instagram: string;
		medium: string;
		reddit: string;
		telegram: string;
		twitter: string;
		website: string;
		youtube: string;
	};
}

export async function getTokensData(): Promise<{
	tokens: TokenWithSocials[];
	sunMarketData: SunMarketData;
}> {
	const marketTokensApi = new MarketTokensApiService();
	const metricsApi = new MetricsApiService();
	const nftApi = new NftApiService();

	// Fetch top market cap tokens (top 10)
	const tokens = await marketTokensApi.getTopMarketCapTokens("mcap", 1, 10);

	// For each token, fetch its socials data concurrently.
	const tokensWithSocials: TokenWithSocials[] = await Promise.all(
		tokens.map(async (token) => {
			const socials = await marketTokensApi.getTokenLinks(token.unit);
			return { ...token, socials };
		})
	);

	// Fetch market data for the central (sun) node.
	const quotePriceRes = await marketTokensApi.getQuotePrice("USD");
	const metricsRes = await metricsApi.getMarketStats("ADA");
	const nftStatsRes = await nftApi.getMarketStats("24h");

	const sunMarketData: SunMarketData = {
		adaPrice: quotePriceRes.price,
		dexVolume: metricsRes.dexVolume,
		activeAddresses: metricsRes.activeAddresses,
		nftVolume: nftStatsRes.volume,
	};

	return { tokens: tokensWithSocials, sunMarketData };
}
