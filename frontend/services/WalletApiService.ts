import { IWalletApi } from '@/interfaces/wallet/IWalletApi';
import { BaseApiService } from '.';
import {
  PortfolioPositionsResponse,
  WalletTokenTrade,
  PortfolioTrendedValueResponse,
} from '@/interfaces/wallet';

export class WalletApiService extends BaseApiService implements IWalletApi {
  /**
   * Get wallet portfolio positions with supporting market data.
   * This includes positions that are staked in a smart contract and LP farm positions (for supported protocols).
   * GET /wallet/portfolio/positions
   *
   * @param {string} address - Wallet address to query for (required).
   *   Example: "stake1u8rphunzxm9lr4m688peqmnthmap35yt38rgvaqgsk5jcrqdr2vuc"
   * @returns {Promise<PortfolioPositionsResponse>} A promise that resolves to the wallet's portfolio positions.
   */
  async getPortfolioPositions(
    address: string
  ): Promise<PortfolioPositionsResponse> {
    return this.request<PortfolioPositionsResponse>(
      '/wallet/portfolio/positions',
      {
        queryParams: { address },
      }
    );
  }

  /**
   * Get the token trade history for a particular wallet.
   * Optionally, pass a token unit to filter results for a specific token.
   * GET /wallet/trades/tokens
   *
   * @param {string} address - Wallet address to query for (required).
   *   Example: "stake1u8rphunzxm9lr4m688peqmnthmap35yt38rgvaqgsk5jcrqdr2vuc"
   * @param {string} [unit] - (Optional) Token unit (policy + hex name) to filter by.
   *   Example: "8fef2d34078659493ce161a6c7fba4b56afefa8535296a5743f6958741414441"
   * @param {number} [page=1] - (Optional) Page number for pagination; default is 1.
   * @param {number} [perPage=100] - (Optional) Number of items per page; default is 100 (maximum is 100).
   * @returns {Promise<WalletTokenTrade[]>} A promise that resolves to an array of token trade history records.
   */
  async getWalletTokenTrades(
    address: string,
    unit?: string,
    page: number = 1,
    perPage: number = 100
  ): Promise<WalletTokenTrade[]> {
    return this.request<WalletTokenTrade[]>('/wallet/trades/tokens', {
      queryParams: { address, unit, page, perPage },
    });
  }

  /**
   * Get the historical trended value of a wallet's portfolio in 4-hour intervals.
   * This includes the value of all tokens, NFTs, LP/farm positions, custodial staking,
   * and assets involved in active loans (excluding staking rewards unless withdrawn).
   * GET /wallet/value/trended
   *
   * @param {string} address - Wallet address to query for (required).
   *   Example: "stake1u8rphunzxm9lr4m688peqmnthmap35yt38rgvaqgsk5jcrqdr2vuc"
   * @param {string} [timeframe="30d"] - (Optional) Time interval for the historical data.
   *   Options: "24h", "7d", "30d", "90d", "180d", "1y", "all". Default is "30d".
   * @param {string} [quote="ADA"] - (Optional) Quote currency to use (e.g., ADA, USD, EUR, ETH, BTC).
   *   Default is "ADA".
   * @returns {Promise<PortfolioTrendedValueResponse[]>} A promise that resolves to an array of portfolio trended value data.
   */
  async getPortfolioTrendedValue(
    address: string,
    timeframe: string = '30d',
    quote: string = 'ADA'
  ): Promise<PortfolioTrendedValueResponse[]> {
    return this.request<PortfolioTrendedValueResponse[]>(
      '/wallet/value/trended',
      {
        queryParams: { address, timeframe, quote },
      }
    );
  }
}
