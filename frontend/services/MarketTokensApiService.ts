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
} from '@/interfaces/tokens';
import { IMarketTokensApi } from '@/interfaces/tokens/IMarketTokensApi';
import { BaseApiService } from '.';

export class MarketTokensApiService
  extends BaseApiService
  implements IMarketTokensApi
{
  /**
   * Get active P2P loans of a certain token (currently supports protocols like Lenfi and Levvy).
   *
   * @param {string} unit - Token unit (policy + hex name) to filter by (required).
   * @param {string} [include="collateral,debt"] - Comma-separated values to filter by loan role (default is "collateral,debt").
   * @param {string} [sortBy="time"] - Field to sort results by; options: "time", "expiration" (default is "time").
   * @param {string} [order="desc"] - Sort order; options: "asc", "desc" (default is "desc").
   * @param {number} [page=1] - Page number for pagination (default is 1).
   * @param {number} [perPage=100] - Number of items per page (default is 100).
   * @returns {Promise<ActiveLoan[]>} A promise that resolves to an array of active loans.
   */
  async getActiveLoans(
    unit: string,
    include: string = 'collateral,debt',
    sortBy: string = 'time',
    order: string = 'desc',
    page: number = 1,
    perPage: number = 100
  ): Promise<ActiveLoan[]> {
    return this.request<ActiveLoan[]>('/token/debt/loans', {
      queryParams: { unit, include, sortBy, order, page, perPage },
    });
  }

  /**
   * Get active P2P loan offers that are not yet associated with any loans.
   *
   * @param {string} unit - Token unit (policy + hex name) to filter by (required).
   * @param {string} [include="collateral,debt"] - Comma-separated values to filter by offer role (default is "collateral,debt").
   * @param {string} [sortBy="time"] - Field to sort results by; options: "time", "duration" (default is "time").
   * @param {string} [order="desc"] - Sort order; options: "asc", "desc" (default is "desc").
   * @param {number} [page=1] - Page number for pagination (default is 1).
   * @param {number} [perPage=100] - Number of items per page (default is 100).
   * @returns {Promise<LoanOffer[]>} A promise that resolves to an array of loan offers.
   */
  async getLoanOffers(
    unit: string,
    include: string = 'collateral,debt',
    sortBy: string = 'time',
    order: string = 'desc',
    page: number = 1,
    perPage: number = 100
  ): Promise<LoanOffer[]> {
    return this.request<LoanOffer[]>('/token/debt/offers', {
      queryParams: { unit, include, sortBy, order, page, perPage },
    });
  }

  /**
   * Get the total number of holders for a specific token.
   * Aggregates addresses under one stake key as a single holder.
   *
   * @param {string} unit - Token unit (policy + hex name) (required).
   * @returns {Promise<TokenHoldersResponse>} A promise that resolves to the holder count.
   */
  async getTokenHolders(unit: string): Promise<TokenHoldersResponse> {
    return this.request<TokenHoldersResponse>('/token/holders', {
      queryParams: { unit },
    });
  }

  /**
   * Get the top token holders.
   *
   * @param {string} unit - Token unit (policy + hex name) (required).
   * @param {number} [page=1] - Page number for pagination (default is 1).
   * @param {number} [perPage=20] - Number of items per page (default is 20, maximum is 100).
   * @returns {Promise<TopTokenHolder[]>} A promise that resolves to an array of top token holders.
   */
  async getTopTokenHolders(
    unit: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<TopTokenHolder[]> {
    return this.request<TopTokenHolder[]>('/token/holders/top', {
      queryParams: { unit, page, perPage },
    });
  }

  /**
   * Get indicator values (e.g., EMA, RSI) based on price data for a specific token.
   * Returns the most recent indicator values.
   *
   * @param {string} unit - Token unit (policy + hex name) (required).
   * @param {string} interval - Time interval for the data (e.g., "1d", "1h") (required).
   * @param {number} items - Number of data points to return (required).
   * @param {string} indicator - Indicator type; options: "ma", "ema", "rsi", "macd", "bb", "bbw" (required).
   * @param {number} length - Data length to include (required).
   * @param {number} smoothingFactor - Smoothing factor for the indicator (required).
   * @param {number} [fastLength] - Fast length for MACD (optional).
   * @param {number} [slowLength] - Slow length for MACD (optional).
   * @param {number} [signalLength] - Signal length for MACD (optional).
   * @param {number} [stdMult] - Standard deviation multiplier for Bollinger Bands (optional).
   * @param {string} [quote="ADA"] - Quote currency (default is "ADA").
   * @returns {Promise<TokenPriceIndicatorResponse>} A promise that resolves to the token price indicator data.
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
    quote: string = 'ADA'
  ): Promise<TokenPriceIndicatorResponse> {
    return this.request<TokenPriceIndicatorResponse>('/token/indicators', {
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
   * Get a specific token's social links, if provided.
   *
   * @param {string} unit - Token unit (policy + hex name) (required).
   * @returns {Promise<TokenLinksResponse>} A promise that resolves to the token's social links.
   */
  async getTokenLinks(unit: string): Promise<TokenLinksResponse> {
    return this.request<TokenLinksResponse>('/token/links', {
      queryParams: { unit },
    });
  }

  /**
   * Get a specific token's supply and market cap information.
   *
   * @param {string} unit - Token unit (policy + hex name) (required).
   * @returns {Promise<TokenMarketCapResponse>} A promise that resolves to the token's market cap data.
   */
  async getTokenMarketCap(unit: string): Promise<TokenMarketCapResponse> {
    return this.request<TokenMarketCapResponse>('/token/mcap', {
      queryParams: { unit },
    });
  }

  /**
   * Get a specific token's trended price data (OHLCV).
   * You can provide a token unit for aggregated data or an onchainID for a specific pair.
   *
   * @param {string} unit - Token unit (policy + hex name) (required this one or onchainID).
   * @param {string} onchainID - Pair onchain ID for detailed data (required this one or unit).
   * @param {string} interval - Time interval for the OHLCV data (e.g., "1d", "1h") (required).
   * @param {number} numIntervals - Number of intervals to return (required).
   * @returns {Promise<TokenOHLCV[]>} A promise that resolves to an array of OHLCV data points.
   */
  async getTokenPriceOHLCV(
    unit: string,
    onchainID: string,
    interval: string,
    numIntervals: number
  ): Promise<TokenOHLCV[]> {
    return this.request<TokenOHLCV[]>('/token/ohlcv', {
      queryParams: { unit, onchainID, interval, numIntervals },
    });
  }

  /**
   * Get a specific token's active liquidity pools.
   * Can search for all pools using the token unit or for a specific pool using onchainID.
   *
   * @param {string} unit - Token unit (policy + hex name) (required).
   * @param {string} [onchainID] - Liquidity pool onchain ID (optional).
   * @param {number} [adaOnly] - Flag to return only ADA pools (0 or 1, optional).
   * @returns {Promise<TokenLiquidityPool[]>} A promise that resolves to an array of liquidity pools.
   */
  async getTokenLiquidityPools(
    unit: string,
    onchainID?: string,
    adaOnly?: number
  ): Promise<TokenLiquidityPool[]> {
    return this.request<TokenLiquidityPool[]>('/token/pools', {
      queryParams: { unit, onchainID, adaOnly },
    });
  }

  /**
   * Get token prices for a list of tokens.
   * Returns an object with token units as keys and their prices as values.
   *
   * @param {string[]} tokenUnits - Array of token units (policy + hex name) (required, max batch size is 100).
   * @returns {Promise<TokenPricesResponse>} A promise that resolves to an object mapping token units to prices.
   */
  async postTokenPrices(tokenUnits: string[]): Promise<TokenPricesResponse> {
    return this.request<TokenPricesResponse>('/token/prices', {
      method: 'POST',
      body: tokenUnits,
    });
  }

  /**
   * Get a specific token's price percent change over various timeframes.
   *
   * @param {string} unit - Token unit (policy + hex name) (required).
   * @param {string} timeframes - Comma-separated list of timeframes (e.g., "1h,4h,24h,7d,30d") (required).
   * @returns {Promise<TokenPricePercentChangeResponse>} A promise that resolves to the token's price percent change data.
   */
  async getTokenPricePercentChange(
    unit: string,
    timeframes: string
  ): Promise<TokenPricePercentChangeResponse> {
    return this.request<TokenPricePercentChangeResponse>(
      '/market/tokens/price-percent-change',
      {
        queryParams: { unit, timeframes },
      }
    );
  }

  /**
   * Get the current quote price (e.g., current ADA/USD price).
   *
   * @param {string} quote - Quote currency to use (e.g., USD, EUR, ETH, BTC) (required).
   * @returns {Promise<QuotePriceResponse>} A promise that resolves to the current quote price.
   */
  async getQuotePrice(quote: string): Promise<QuotePriceResponse> {
    return this.request<QuotePriceResponse>('/token/quote', {
      queryParams: { quote },
    });
  }

  /**
   * Get all currently available quote currencies.
   *
   * @returns {Promise<AvailableQuoteCurrenciesResponse>} A promise that resolves to an array of available quote currencies.
   */
  async getAvailableQuoteCurrencies(): Promise<AvailableQuoteCurrenciesResponse> {
    return this.request<AvailableQuoteCurrenciesResponse>(
      '/token/quote/avaliable'
    );
  }

  /**
   * Get tokens ranked by their DEX liquidity.
   *
   * @param {number} [page=1] - Page number for pagination (default is 1).
   * @param {number} [perPage=10] - Number of items per page (default is 10, maximum is 100).
   * @returns {Promise<TopLiquidityToken[]>} A promise that resolves to an array of tokens ranked by liquidity.
   */
  async getTopLiquidityTokens(
    page: number = 1,
    perPage: number = 10
  ): Promise<TopLiquidityToken[]> {
    return this.request<TopLiquidityToken[]>('/token/top/liquidity', {
      queryParams: { page, perPage },
    });
  }

  /**
   * Get tokens with the top market cap in descending order.
   * Deprecated tokens are excluded.
   *
   * @param {string} type - Sorting type; options: "mcap" (circulating market cap) or "fdv" (fully diluted value) (required).
   * @param {number} [page=1] - Page number for pagination (default is 1).
   * @param {number} [perPage=20] - Number of items per page (default is 20, maximum is 100).
   * @returns {Promise<TopMarketCapToken[]>} A promise that resolves to an array of tokens sorted by market cap.
   */
  async getTopMarketCapTokens(
    type: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<TopMarketCapToken[]> {
    return this.request<TopMarketCapToken[]>('/token/top/mcap', {
      queryParams: { type, page, perPage },
    });
  }

  /**
   * Get tokens with the top volume for a given timeframe.
   *
   * @param {string} timeframe - Timeframe for aggregating volume (e.g., "24h", "7d") (required).
   * @param {number} [page=1] - Page number for pagination (default is 1).
   * @param {number} [perPage=20] - Number of items per page (default is 20, maximum is 100).
   * @returns {Promise<TopVolumeToken[]>} A promise that resolves to an array of tokens sorted by volume.
   */
  async getTopVolumeTokens(
    timeframe: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<TopVolumeToken[]> {
    return this.request<TopVolumeToken[]>('/token/top/volume', {
      queryParams: { timeframe, page, perPage },
    });
  }

  /**
   * Get token trades across the entire DEX market.
   *
   * @param {string} timeframe - Timeframe to filter trades (e.g., "30d", "7d") (required).
   * @param {string} sortBy - Field to sort trades by; options: "amount", "time" (required).
   * @param {string} order - Sort order; options: "asc", "desc" (required).
   * @param {string} [unit] - Token unit (policy + hex name) to filter trades (optional).
   * @param {number} [minAmount] - Minimum ADA amount for trades (optional).
   * @param {number} [from] - UNIX timestamp to filter trades after (optional).
   * @param {number} [page=1] - Page number for pagination (default is 1).
   * @param {number} [perPage=10] - Number of items per page (default is 10, maximum is 10).
   * @returns {Promise<TokenTrade[]>} A promise that resolves to an array of token trades.
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
    return this.request<TokenTrade[]>('/token/trades', {
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
   *
   * @param {string} unit - Token unit (policy + hex name) (required).
   * @param {string} timeframe - Timeframe to aggregate stats (e.g., "24h", "7d") (required).
   * @returns {Promise<TradingStatsResponse>} A promise that resolves to the token's trading stats.
   */
  async getTradingStats(
    unit: string,
    timeframe: string
  ): Promise<TradingStatsResponse> {
    return this.request<TradingStatsResponse>('/token/trading/stats', {
      queryParams: { unit, timeframe },
    });
  }
}
