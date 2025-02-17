import { IWalletApi } from "@/interfaces/wallet/IWalletApi";
import { BaseApiService } from ".";
import {
	PortfolioPositionsResponse,
	WalletTokenTrade,
	PortfolioTrendedValueResponse,
} from "@/interfaces/wallet";

export class WalletApiService extends BaseApiService implements IWalletApi {
	constructor() {
		super(
			process.env.NEXT_PUBLIC_TAPTOOLS_PROXY_URL!,
			process.env.TAPTOOLS_API_KEY
		);
	}

	/**
	 * Get wallet portfolio positions.
	 * GET /wallet/portfolio/positions
	 */
	async getPortfolioPositions(
		address: string
	): Promise<PortfolioPositionsResponse> {
		return this.request<PortfolioPositionsResponse>(
			"/wallet/portfolio/positions",
			{
				queryParams: { address },
			}
		);
	}

	/**
	 * Get wallet token trade history.
	 * GET /wallet/trades/tokens
	 */
	async getWalletTokenTrades(
		address: string,
		unit?: string,
		page: number = 1,
		perPage: number = 100
	): Promise<WalletTokenTrade[]> {
		return this.request<WalletTokenTrade[]>("/wallet/trades/tokens", {
			queryParams: { address, unit, page, perPage },
		});
	}

	/**
	 * Get wallet portfolio trended value.
	 * GET /wallet/value/trended
	 */
	async getPortfolioTrendedValue(
		address: string,
		timeframe: string = "30d",
		quote: string = "ADA"
	): Promise<PortfolioTrendedValueResponse[]> {
		return this.request<PortfolioTrendedValueResponse[]>(
			"/wallet/value/trended",
			{
				queryParams: { address, timeframe, quote },
			}
		);
	}
}
