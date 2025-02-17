export interface AssetSupplyResponse {
	supply: number;
}

export interface OnchainAsset {
	unit: string;
	value: string;
}

export interface AddressInfoResponse {
	address: string;
	assets: OnchainAsset[];
	lovelace: string;
	paymentCred: string;
	stakeAddress: string;
}

export interface UtxoAsset {
	quantity: string;
	unit: string;
}

export interface AddressUtxo {
	assets: UtxoAsset[];
	hash: string;
	index: number;
	lovelace: string;
}

export interface TransactionUtxo {
	hash: string;
	inputs: AddressUtxo[];
	outputs: AddressUtxo[];
}
