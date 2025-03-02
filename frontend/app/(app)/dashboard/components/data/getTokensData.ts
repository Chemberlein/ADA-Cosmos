// app/dashboard/components/data/getTokensData.ts
import {
	TokenOHLCV,
	TopMarketCapToken,
	TradingStatsResponse,
} from "@/interfaces/tokens";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";
import { MetricsApiService } from "@/services/MetricsApiService";
import { NftApiService } from "@/services/NftApiService";

export interface SunMarketData {
	adaPrice: number;
	dexVolume: number;
	activeAddresses: number;
	nftVolume: number;
}

type OHLCVTimeframe = "1h" | "4h" | "1d" | "1w" | "1M";

type TradingStatsTimeframe = "1h" | "4h" | "24h" | "7d" | "30d";

export interface TokenData {
	unit: string;
	ticker: string;
	mcap: number;
	holders: number;
	ohlcv: {
		timeframe: OHLCVTimeframe;
		stats: TokenOHLCV;
	}[];
	tradingStats: {
		timeframe: TradingStatsTimeframe;
		stats: TradingStatsResponse;
	}[];
	socials: {
		description: string | null;
		discord: string | null;
		email: string | null;
		facebook: string | null;
		github: string | null;
		instagram: string | null;
		medium: string | null;
		reddit: string | null;
		telegram: string | null;
		twitter: string | null;
		website: string | null;
		youtube: string | null;
	};
}

export async function getTokensData(): Promise<{
	tokens: TokenData[];
	sunMarketData: SunMarketData;
}> {
	const marketTokensApi = new MarketTokensApiService();
	const metricsApi = new MetricsApiService();
	const nftApi = new NftApiService();

	// Fetch top market cap tokens (top 10)
	const tokens: TopMarketCapToken[] =
		await marketTokensApi.getTopMarketCapTokens("mcap", 1, 10);

	const tokensData: TokenData[] = await Promise.all(
		tokens.map(async (token) => {
			// Fetch socials and holders data
			const socials = await marketTokensApi.getTokenLinks(token.unit);
			const holdersRes = await marketTokensApi.getTokenHolders(
				token.unit
			);

			// Prepare OHLCV data for several timeframes.
			const ohlcvTimeframes: ("1h" | "4h" | "1d" | "1w" | "1M")[] = [
				"1h",
				"4h",
				"1d",
				"1w",
				"1M",
			];
			const ohlcv = await Promise.all(
				ohlcvTimeframes.map(async (timeframe) => {
					// Fetch OHLCV data
					const stats = await marketTokensApi.getTokenPriceOHLCV(
						token.unit,
						"",
						timeframe,
						1
					);
					return {
						timeframe,
						stats: stats[0],
					};
				})
			);

			// Prepare trading stats for several timeframes.
			const tradingStatsTimeframes: (
				| "1h"
				| "4h"
				| "24h"
				| "7d"
				| "30d"
			)[] = ["1h", "4h", "24h", "7d", "30d"];
			const tradingStats = await Promise.all(
				tradingStatsTimeframes.map(async (timeframe) => {
					const stats = await marketTokensApi.getTradingStats(
						token.unit,
						timeframe
					);
					return {
						timeframe,
						stats,
					};
				})
			);

			return {
				unit: token.unit,
				ticker: token.ticker,
				mcap: token.mcap,
				holders: holdersRes.holders,
				socials,
				ohlcv,
				tradingStats,
			};
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

	return { tokens: tokensData, sunMarketData };
}
