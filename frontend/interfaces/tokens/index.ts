export interface TokenHoldersResponse {
	holders: number;
}

export interface TopTokenHolder {
	address: string;
	amount: number;
}

export interface TokenLinksResponse {
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
}

export interface TokenLiquidityPool {
	exchange: string;
	lpTokenUnit: string;
	onchainID: string;
	tokenA: string;
	tokenALocked: number;
	tokenATicker: string;
	tokenB: string;
	tokenBLocked: number;
	tokenBTicker: string;
}

export interface ActiveLoan {
	collateralAmount: number;
	collateralToken: string;
	collateralValue: number;
	debtAmount: number;
	debtToken: string;
	debtValue: number;
	expiration: number;
	hash: string;
	health: number;
	interestAmount: number;
	interestToken: string;
	interestValue: number;
	protocol: string;
	time: number;
}

export interface LoanOffer {
	collateralAmount: number;
	collateralToken: string;
	collateralValue: number;
	debtAmount: number;
	debtToken: string;
	debtValue: number;
	duration: number;
	hash: string;
	health: number;
	interestAmount: number;
	interestToken: string;
	interestValue: number;
	protocol: string;
	time: number;
}

export interface TokenMarketCapResponse {
	circSupply: number;
	fdv: number;
	mcap: number;
	price: number;
	ticker: string;
	totalSupply: number;
}

export interface TokenOHLCV {
	open: number;
	high: number;
	low: number;
	close: number;
	time: number;
	volume: number;
}

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

export interface TokenTrade {
	action: string;
	address: string;
	exchange: string;
	hash: string;
	lpTokenUnit: string;
	price: number;
	time: number;
	tokenA: string;
	tokenAAmount: number;
	tokenAName: string;
	tokenB: string;
	tokenBAmount: number;
	tokenBName: string;
}

export interface TradingStatsResponse {
	buyVolume: number;
	buyers: number;
	buys: number;
	sellVolume: number;
	sellers: number;
	sells: number;
}