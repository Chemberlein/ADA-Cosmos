import { Asset, Block, Exchange, Pair } from "@/interfaces/integration";
import { IIntegrationApi } from "@/interfaces/integration/IIntegrationApi";
import { BaseApiService } from ".";

export class IntegrationApiService
	extends BaseApiService
	implements IIntegrationApi
{
	/**
	 *  Returns details of a given token by its address.
	 */
	async getAssetById(id: string): Promise<{ asset: Asset }> {
		return this.request<{ asset: Asset }>("/integration/asset", {
			queryParams: { id },
		});
	}

	/**
	 *  Returns a specific block using either the number of the block or its timestamp.
	 */
	async getBlock(params: {
		number?: number;
		timestamp?: number;
	}): Promise<{ block: Block }> {
		return this.request<{ block: Block }>("integration/block", {
			queryParams: params,
		});
	}

	/**
	 * Returns a list of events that occurred within a range of blocks.
	 */
	async getEvents(
		fromBlock: number,
		toBlock: number,
		limit?: number
	): Promise<{ events: any[] }> {
		return this.request<{ events: any[] }>("integration/events", {
			queryParams: { fromBlock, toBlock, limit },
		});
	}

	/**
	 * Returns details of a DEX by its factory address or alternative id.
	 */
	async getExchange(id: string): Promise<{ exchange: Exchange }> {
		return this.request<{ exchange: Exchange }>("integration/exchange", {
			queryParams: { id },
		});
	}

	/**
	 * Returns the latest block processed in the blockchain/DEX.
	 */
	async getLatestBlock(): Promise<{ block: Block }> {
		return this.request<{ block: Block }>("integration/latest-block");
	}

	/**
	 * Returns pair (pool) details by its address.
	 */
	async getPairById(id: string): Promise<{ pair: Pair }> {
		return this.request<{ pair: Pair }>("integration/pair", {
			queryParams: { id },
		});
	}
}
