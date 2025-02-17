import {
	ActiveLoan,
	LoanOffer,
	TokenHoldersResponse,
	TopTokenHolder,
	TokenPriceIndicatorResponse,
	TokenLinksResponse,
	TokenMarketCapResponse,
	TokenOHLCV,
	TokenLiquidityPool,
	TokenPricesResponse,
	TokenPricePercentChangeResponse,
	QuotePriceResponse,
	AvailableQuoteCurrenciesResponse,
	TopLiquidityToken,
	TopMarketCapToken,
	TopVolumeToken,
	TokenTrade,
	TradingStatsResponse,
} from "@/interfaces/tokens";
import { IMarketTokensApi } from "@/interfaces/tokens/IMarketTokensApi";
import { BaseApiService } from ".";

export class MarketTokensApiService
	extends BaseApiService
	implements IMarketTokensApi
{
	/**
	 *  Get active P2P loans of a certain token (Currently only supports P2P protocols like Lenfi and Levvy).
	 */
	async getActiveLoans(
		unit: string,
		include: string = "collateral,debt",
		sortBy: string = "time",
		order: string = "desc",
		page: number = 1,
		perPage: number = 100
	): Promise<ActiveLoan[]> {
		return this.request<ActiveLoan[]>("/token/debt/loans", {
			queryParams: { unit, include, sortBy, order, page, perPage },
		});
	}

	/**
	 * Get active P2P loan offers that are not associated with any loans yet (Currently only supports P2P protocols like Lenfi and Levvy).
	 */
	async getLoanOffers(
		unit: string,
		include: string = "collateral,debt",
		sortBy: string = "time",
		order: string = "desc",
		page: number = 1,
		perPage: number = 100
	): Promise<LoanOffer[]> {
		return this.request<LoanOffer[]>("/token/debt/offers", {
			queryParams: { unit, include, sortBy, order, page, perPage },
		});
	}

	/**
	 * Get total number of holders for a specific token.
	 * This uses coalesce(stake_address, address), so all addresses under one stake key will be aggregated into 1 holder.
	 */
	async getTokenHolders(unit: string): Promise<TokenHoldersResponse> {
		return this.request<TokenHoldersResponse>("/token/holders", {
			queryParams: { unit },
		});
	}

	/**
	 * Get top token holders.
	 */
	async getTopTokenHolders(
		unit: string,
		page: number = 1,
		perPage: number = 20
	): Promise<TopTokenHolder[]> {
		return this.request<TopTokenHolder[]>("/token/holders/top", {
			queryParams: { unit, page, perPage },
		});
	}

	/**
	 * Get indicator values (e.g. EMA, RSI) based on price data for a specific token.
	 * There are multiple parameters that can be passed, but some only apply to certain indicators.
	 * This will return the most recent values.
	 */
	async getTokenPriceIndicators(
		unit: string,
		interval: string,
		items: number,
		indicator: string,
		length: number,
		smoothingFactor: number,
		fastLength?: number,
		slowLength?: number,
		signalLength?: number,
		stdMult?: number,
		quote: string = "ADA"
	): Promise<TokenPriceIndicatorResponse> {
		return this.request<TokenPriceIndicatorResponse>("/token/indicators", {
			queryParams: {
				unit,
				interval,
				items,
				indicator,
				length,
				smoothingFactor,
				fastLength,
				slowLength,
				signalLength,
				stdMult,
				quote,
			},
		});
	}

	/**
	 * Get a specific token's social links, if they have been provided to TapTools.
	 */
	async getTokenLinks(unit: string): Promise<TokenLinksResponse> {
		return this.request<TokenLinksResponse>("/token/links", {
			queryParams: { unit },
		});
	}

	/**
	 * Get a specific token's supply and market cap information. We pull circulating supply information from this repo.
	 */
	async getTokenMarketCap(unit: string): Promise<TokenMarketCapResponse> {
		return this.request<TokenMarketCapResponse>("/token/mcap", {
			queryParams: { unit },
		});
	}

	/**
	 * Get a specific token's trended (open, high, low, close, volume) price data.
	 * You can either pass a token unit to get aggregated data across all liquidity pools, or an onchainID for a specific pair (see /token/pools).
	 */
	async getTokenPriceOHLCV(
		unit: string,
		onchainID: string,
		interval: string,
		numIntervals: number
	): Promise<TokenOHLCV[]> {
		return this.request<TokenOHLCV[]>("/token/ohlcv", {
			queryParams: { unit, onchainID, interval, numIntervals },
		});
	}

	/**
	 * Get a specific token's active liquidity pools. Can search for all token pools using unit or can search for specific pool with onchainID.
	 */
	async getTokenLiquidityPools(
		unit: string,
		onchainID?: string,
		adaOnly?: number
	): Promise<TokenLiquidityPool[]> {
		return this.request<TokenLiquidityPool[]>("/token/pools", {
			queryParams: { unit, onchainID, adaOnly },
		});
	}

	/**
	 * Get an object with token units (policy + hex name) as keys and price as values for a list of policies and hex names.
	 * These prices are aggregated across all supported DEXs. Max batch size is 100 tokens.
	 */
	async postTokenPrices(tokenUnits: string[]): Promise<TokenPricesResponse> {
		return this.request<TokenPricesResponse>("/token/prices", {
			method: "POST",
			body: tokenUnits,
		});
	}

	/**
	 * Get a specific token's price percent change over various timeframes.
	 * Timeframe options include [5m, 1h, 4h, 6h, 24h, 7d, 30d, 60d, 90d]. All timeframes are returned by default.
	 */
	async getTokenPricePercentChange(
		unit: string,
		timeframes: string
	): Promise<TokenPricePercentChangeResponse> {
		return this.request<TokenPricePercentChangeResponse>(
			"/market/tokens/price-percent-change",
			{
				queryParams: { unit, timeframes },
			}
		);
	}

	/**
	 * Get current quote price (e.g, current ADA/USD price).
	 */
	async getQuotePrice(quote: string): Promise<QuotePriceResponse> {
		return this.request<QuotePriceResponse>("/token/quote", {
			queryParams: { quote },
		});
	}

	/**
	 * Get all currently available quote currencies.
	 */
	async getAvailableQuoteCurrencies(): Promise<AvailableQuoteCurrenciesResponse> {
		return this.request<AvailableQuoteCurrenciesResponse>(
			"/token/quote/avaliable"
		);
	}

	/**
	 * Get tokens ranked by their DEX liquidity. This includes both AMM and order book liquidity.
	 */
	async getTopLiquidityTokens(
		page: number = 1,
		perPage: number = 10
	): Promise<TopLiquidityToken[]> {
		return this.request<TopLiquidityToken[]>("/token/top/liquidity", {
			queryParams: { page, perPage },
		});
	}

	/**
	 * Get tokens with top market cap in a descending order.
	 * This endpoint does exclude deprecated tokens (e.g. MELD V1 since there was a token migration to MELD V2).
	 */
	async getTopMarketCapTokens(
		type: string,
		page: number = 1,
		perPage: number = 20
	): Promise<TopMarketCapToken[]> {
		return this.request<TopMarketCapToken[]>("/token/top/mcap", {
			queryParams: { type, page, perPage },
		});
	}

	/**
	 * Get tokens with top volume for a given timeframe.
	 */
	async getTopVolumeTokens(
		timeframe: string,
		page: number = 1,
		perPage: number = 20
	): Promise<TopVolumeToken[]> {
		return this.request<TopVolumeToken[]>("/token/top/volume", {
			queryParams: { timeframe, page, perPage },
		});
	}

	/**
	 * Get token trades across the entire DEX market.
	 */
	async getTokenTrades(
		timeframe: string,
		sortBy: string,
		order: string,
		unit?: string,
		minAmount?: number,
		from?: number,
		page: number = 1,
		perPage: number = 10
	): Promise<TokenTrade[]> {
		return this.request<TokenTrade[]>("/token/trades", {
			queryParams: {
				timeframe,
				sortBy,
				order,
				unit,
				minAmount,
				from,
				page,
				perPage,
			},
		});
	}

	/**
	 * Get aggregated trading stats for a particular token.
	 */
	async getTradingStats(
		unit: string,
		timeframe: string
	): Promise<TradingStatsResponse> {
		return this.request<TradingStatsResponse>("/token/trading/stats", {
			queryParams: { unit, timeframe },
		});
	}
}
