import {
	PortfolioPositionsResponse,
	WalletTokenTrade,
	PortfolioTrendedValueResponse,
} from ".";

export interface IWalletApi {
	/**
	 * Get wallet's current portfolio positions including market data.
	 */
	getPortfolioPositions(address: string): Promise<PortfolioPositionsResponse>;

	/**
	 * Get the token trade history for a specific wallet.
	 * Optionally filter by token unit.
	 */
	getWalletTokenTrades(
		address: string,
		unit?: string,
		page?: number,
		perPage?: number
	): Promise<WalletTokenTrade[]>;

	/**
	 * Get historical trended value data for a wallet.
	 */
	getPortfolioTrendedValue(
		address: string,
		timeframe?: string,
		quote?: string
	): Promise<PortfolioTrendedValueResponse[]>;
}
