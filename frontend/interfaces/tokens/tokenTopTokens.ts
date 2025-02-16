export interface TopLiquidityToken {
  liquidity: number;
  price: number;
  ticker: string;
  unit: string;
}

export interface TopMarketCapToken {
  circSupply: number;
  fdv: number;
  mcap: number;
  price: number;
  ticker: string;
  totalSupply: number;
  unit: string;
}

export interface TopVolumeToken {
  price: number;
  ticker: string;
  unit: string;
  volume: number;
}
