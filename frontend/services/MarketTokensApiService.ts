import { ActiveLoan, LoanOffer } from '@/interfaces/tokens/tokenLoans';
import { IMarketTokensApi } from '../interfaces/tokens/IMarketTokensApi';
import {
  TokenHoldersResponse,
  TopTokenHolder,
} from '@/interfaces/tokens/tokenHolders';
import { TokenLinksResponse } from '@/interfaces/tokens/tokenLinks';
import { TokenLiquidityPool } from '@/interfaces/tokens/tokenLiquidityPools';
import { TokenMarketCapResponse } from '@/interfaces/tokens/tokenMarketCap';
import { TokenOHLCV } from '@/interfaces/tokens/tokenOHLCV';
import {
  TokenPriceIndicatorResponse,
  TokenPricesResponse,
  TokenPricePercentChangeResponse,
  QuotePriceResponse,
  AvailableQuoteCurrenciesResponse,
} from '@/interfaces/tokens/tokenPrices';
import {
  TopLiquidityToken,
  TopMarketCapToken,
  TopVolumeToken,
} from '@/interfaces/tokens/tokenTopTokens';
import { TokenTrade } from '@/interfaces/tokens/tokenTrades';
import { TradingStatsResponse } from '@/interfaces/tokens/tokenTradingStats';

export class MarketTokensApiService implements IMarketTokensApi {
  private baseUrl: string = process.env.NEXT_PUBLIC_TAPTOOLS_PROXY_URL!;
  private apiKey: string = process.env.TAPTOOLS_API_KEY!;

  /**
   * Constructs a URL for API requests using the proxy base.
   * @param endpoint - The TapTools API endpoint (leading slash removed if necessary).
   * @param queryParams - Optional query parameters.
   * @returns The full URL as a string.
   */
  private buildUrl(
    endpoint: string,
    queryParams?: Record<string, any>
  ): string {
    const url = new URL(this.baseUrl, window.location.origin);
    url.searchParams.append(
      'endpoint',
      endpoint.startsWith('/') ? endpoint.substring(1) : endpoint
    );

    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        const value = queryParams[key];
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  /**
   * Generic request method to handle API calls.
   */
  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      queryParams?: Record<string, any>;
      body?: any;
    } = {}
  ): Promise<T> {
    const { method = 'GET', queryParams, body } = options;
    const url = this.buildUrl(endpoint, queryParams);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  }

  // Each of the following methods wraps a specific API endpoint.

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

  async getTokenHolders(unit: string): Promise<TokenHoldersResponse> {
    return this.request<TokenHoldersResponse>('/token/holders', {
      queryParams: { unit },
    });
  }

  async getTopTokenHolders(
    unit: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<TopTokenHolder[]> {
    return this.request<TopTokenHolder[]>('/token/holders/top', {
      queryParams: { unit, page, perPage },
    });
  }

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
    return this.request<TokenPriceIndicatorResponse>(
      '/token/indicators',
      {
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
      }
    );
  }

  async getTokenLinks(unit: string): Promise<TokenLinksResponse> {
    return this.request<TokenLinksResponse>('/token/links', {
      queryParams: { unit },
    });
  }

  async getTokenMarketCap(unit: string): Promise<TokenMarketCapResponse> {
    return this.request<TokenMarketCapResponse>('/token/mcap', {
      queryParams: { unit },
    });
  }

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

  async getTokenLiquidityPools(
    unit: string,
    onchainID?: string,
    adaOnly?: number
  ): Promise<TokenLiquidityPool[]> {
    return this.request<TokenLiquidityPool[]>(
      '/token/pools',
      {
        queryParams: { unit, onchainID, adaOnly },
      }
    );
  }

  async postTokenPrices(tokenUnits: string[]): Promise<TokenPricesResponse> {
    return this.request<TokenPricesResponse>('/token/prices', {
      method: 'POST',
      body: tokenUnits,
    });
  }

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

  async getQuotePrice(quote: string): Promise<QuotePriceResponse> {
    return this.request<QuotePriceResponse>('/token/quote', {
      queryParams: { quote },
    });
  }

  async getAvailableQuoteCurrencies(): Promise<AvailableQuoteCurrenciesResponse> {
    return this.request<AvailableQuoteCurrenciesResponse>(
      '/token/quote/avaliable'
    );
  }

  async getTopLiquidityTokens(
    page: number = 1,
    perPage: number = 10
  ): Promise<TopLiquidityToken[]> {
    return this.request<TopLiquidityToken[]>(
      '/token/top/liquidity',
      { queryParams: { page, perPage } }
    );
  }

  async getTopMarketCapTokens(
    type: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<TopMarketCapToken[]> {
    return this.request<TopMarketCapToken[]>(
      '/token/top/mcap',
      { queryParams: { type, page, perPage } }
    );
  }

  async getTopVolumeTokens(
    timeframe: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<TopVolumeToken[]> {
    return this.request<TopVolumeToken[]>('/token/top/volume', {
      queryParams: { timeframe, page, perPage },
    });
  }

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

  async getTradingStats(
    unit: string,
    timeframe: string
  ): Promise<TradingStatsResponse> {
    return this.request<TradingStatsResponse>('/token/trading/stats', {
      queryParams: { unit, timeframe },
    });
  }
}
