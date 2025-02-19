import { Asset, Block, Exchange, Pair } from '@/interfaces/integration';
import { IIntegrationApi } from '@/interfaces/integration/IIntegrationApi';
import { BaseApiService } from '.';

export class IntegrationApiService
  extends BaseApiService
  implements IIntegrationApi
{
  /**
   * Returns details of a given token by its address.
   *
   * @param {string} id - The token ID (required). Example: "b46b12f0a61721a0358988f806a7c1562e1e622d5886a73194051f336d6131"
   * @returns {Promise<{ asset: Asset }>} A promise that resolves to the token details.
   */
  async getAssetById(id: string): Promise<{ asset: Asset }> {
    return this.request<{ asset: Asset }>('/integration/asset', {
      queryParams: { id },
    });
  }

  /**
   * Returns a specific block using either the block number or its timestamp.
   *
   * @param {object} params - The query parameters object.
   * @param {number} [params.number] - (Optional) The block number.
   * @param {number} [params.timestamp] - (Optional) The block timestamp.
   *                              Note: Provide either the block number or timestamp.
   * @returns {Promise<{ block: Block }>} A promise that resolves to the block details.
   */
  async getBlock(params: {
    number?: number;
    timestamp?: number;
  }): Promise<{ block: Block }> {
    return this.request<{ block: Block }>('integration/block', {
      queryParams: params,
    });
  }

  /**
   * Returns a list of events that occurred within a range of blocks.
   *
   * @param {number} fromBlock - The starting block number (inclusive, required).
   * @param {number} toBlock - The ending block number (inclusive, required).
   * @param {number} [limit] - (Optional) Maximum number of events to return. Defaults to 1000 with a maximum of 1000.
   * @returns {Promise<{ events: any[] }>} A promise that resolves to the list of events.
   */
  async getEvents(
    fromBlock: number,
    toBlock: number,
    limit?: number
  ): Promise<{ events: any[] }> {
    return this.request<{ events: any[] }>('integration/events', {
      queryParams: { fromBlock, toBlock, limit },
    });
  }

  /**
   * Returns details of a DEX by its factory address or alternative id.
   *
   * @param {string} id - The exchange ID (required). Example: "7"
   * @returns {Promise<{ exchange: Exchange }>} A promise that resolves to the DEX details.
   */
  async getExchange(id: string): Promise<{ exchange: Exchange }> {
    return this.request<{ exchange: Exchange }>('integration/exchange', {
      queryParams: { id },
    });
  }

  /**
   * Returns the latest block processed in the blockchain/DEX.
   *
   * @returns {Promise<{ block: Block }>} A promise that resolves to the latest block details.
   */
  async getLatestBlock(): Promise<{ block: Block }> {
    return this.request<{ block: Block }>('integration/latest-block');
  }

  /**
   * Returns pair (pool) details by its address.
   *
   * @param {string} id - The pair ID (required). Example: "nikeswaporderbook.44759dc63605dbf88700b241ee451aa5b0334cf2b34094d836fbdf8642757a7a696542656520.ada"
   * @returns {Promise<{ pair: Pair }>} A promise that resolves to the pair details.
   */
  async getPairById(id: string): Promise<{ pair: Pair }> {
    return this.request<{ pair: Pair }>('integration/pair', {
      queryParams: { id },
    });
  }
}
