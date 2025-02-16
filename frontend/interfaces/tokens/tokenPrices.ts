export type TokenPriceIndicatorResponse = number[];

export interface TokenPricesResponse {
  [tokenUnit: string]: number;
}

export interface TokenPricePercentChangeResponse {
  [timeframe: string]: number;
}

export interface QuotePriceResponse {
  price: number;
}

export type AvailableQuoteCurrenciesResponse = string[];
