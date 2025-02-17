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
} from ".";

export interface IMarketTokensApi {
	getActiveLoans(
		unit: string,
		include?: string,
		sortBy?: string,
		order?: string,
		page?: number,
		perPage?: number
	): Promise<ActiveLoan[]>;
	getLoanOffers(
		unit: string,
		include?: string,
		sortBy?: string,
		order?: string,
		page?: number,
		perPage?: number
	): Promise<LoanOffer[]>;
	getTokenHolders(unit: string): Promise<TokenHoldersResponse>;
	getTopTokenHolders(
		unit: string,
		page?: number,
		perPage?: number
	): Promise<TopTokenHolder[]>;
	getTokenPriceIndicators(
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
		quote?: string
	): Promise<TokenPriceIndicatorResponse>;
	getTokenLinks(unit: string): Promise<TokenLinksResponse>;
	getTokenMarketCap(unit: string): Promise<TokenMarketCapResponse>;
	getTokenPriceOHLCV(
		unit: string,
		onchainID: string,
		interval: string,
		numIntervals: number
	): Promise<TokenOHLCV[]>;
	getTokenLiquidityPools(
		unit: string,
		onchainID?: string,
		adaOnly?: number
	): Promise<TokenLiquidityPool[]>;
	postTokenPrices(tokenUnits: string[]): Promise<TokenPricesResponse>;
	getTokenPricePercentChange(
		unit: string,
		timeframes: string
	): Promise<TokenPricePercentChangeResponse>;
	getQuotePrice(quote: string): Promise<QuotePriceResponse>;
	getAvailableQuoteCurrencies(): Promise<AvailableQuoteCurrenciesResponse>;
	getTopLiquidityTokens(
		page?: number,
		perPage?: number
	): Promise<TopLiquidityToken[]>;
	getTopMarketCapTokens(
		type: string,
		page?: number,
		perPage?: number
	): Promise<TopMarketCapToken[]>;
	getTopVolumeTokens(
		timeframe: string,
		page?: number,
		perPage?: number
	): Promise<TopVolumeToken[]>;
	getTokenTrades(
		timeframe: string,
		sortBy: string,
		order: string,
		unit?: string,
		minAmount?: number,
		from?: number,
		page?: number,
		perPage?: number
	): Promise<TokenTrade[]>;
	getTradingStats(
		unit: string,
		timeframe: string
	): Promise<TradingStatsResponse>;
}
