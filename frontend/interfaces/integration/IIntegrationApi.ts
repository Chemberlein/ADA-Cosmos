import { Asset, Block, Exchange, Pair } from ".";

export interface IIntegrationApi {
	getAssetById(id: string): Promise<{ asset: Asset }>;
	getBlock(params: {
		number?: number;
		timestamp?: number;
	}): Promise<{ block: Block }>;
	getEvents(
		fromBlock: number,
		toBlock: number,
		limit?: number
	): Promise<{ events: any[] }>;
	getExchange(id: string): Promise<{ exchange: Exchange }>;
	getLatestBlock(): Promise<{ block: Block }>;
	getPairById(id: string): Promise<{ pair: Pair }>;
}
