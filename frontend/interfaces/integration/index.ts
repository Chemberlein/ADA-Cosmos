export interface Asset {
	circulatingSupply: number;
	id: string;
	name: string;
	symbol: string;
	totalSupply: number;
}

export interface Block {
	blockNumber: number;
	blockTimestamp: number;
}

export interface Exchange {
	factoryAddress: string;
	logoURL: string;
	name: string;
}

export interface Pair {
	asset0Id: string;
	asset1Id: string;
	createdAtBlockNumber: number;
	createdAtBlockTimestamp: number;
	createdAtTxnId: number;
	factoryAddress: string;
	id: string;
}
