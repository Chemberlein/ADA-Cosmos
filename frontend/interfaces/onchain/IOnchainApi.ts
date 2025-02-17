import {
	AssetSupplyResponse,
	AddressInfoResponse,
	AddressUtxo,
	TransactionUtxo,
} from ".";

export interface IOnchainApi {
	/**
	 * Get onchain supply for a token.
	 * GET /asset/supply
	 */
	getAssetSupply(unit: string): Promise<AssetSupplyResponse>;

	/**
	 * Get address info (payment credential, stake address, lovelace, assets).
	 * GET /address/info
	 */
	getAddressInfo(params: {
		address?: string;
		paymentCred?: string;
	}): Promise<AddressInfoResponse>;

	/**
	 * Get current UTxOs at an address/payment credential.
	 * GET /address/utxos
	 */
	getAddressUtxos(params: {
		address?: string;
		paymentCred?: string;
		page?: number;
		perPage?: number;
	}): Promise<AddressUtxo[]>;

	/**
	 * Get UTxOs from a specific transaction.
	 * GET /transaction/utxos
	 */
	getTransactionUtxos(hash: string): Promise<TransactionUtxo>;
}
