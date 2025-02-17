import { IOnchainApi } from "@/interfaces/onchain/IOnchainApi";
import { BaseApiService } from ".";
import {
	AssetSupplyResponse,
	AddressInfoResponse,
	AddressUtxo,
	TransactionUtxo,
} from "@/interfaces/onchain";

export class OnchainApiService extends BaseApiService implements IOnchainApi {
	/**
	 * Get onchain supply for a token.
	 * GET /asset/supply
	 */
	async getAssetSupply(unit: string): Promise<AssetSupplyResponse> {
		return this.request<AssetSupplyResponse>("/asset/supply", {
			queryParams: { unit },
		});
	}

	/**
	 * Get address info (payment credential, stake address, lovelace, assets).
	 * GET /address/info
	 */
	async getAddressInfo(params: {
		address?: string;
		paymentCred?: string;
	}): Promise<AddressInfoResponse> {
		return this.request<AddressInfoResponse>("/address/info", {
			queryParams: params,
		});
	}

	/**
	 * Get current UTxOs at an address/payment credential.
	 * GET /address/utxos
	 */
	async getAddressUtxos(params: {
		address?: string;
		paymentCred?: string;
		page?: number;
		perPage?: number;
	}): Promise<AddressUtxo[]> {
		return this.request<AddressUtxo[]>("/address/utxos", {
			queryParams: params,
		});
	}

	/**
	 * Get UTxOs from a specific transaction.
	 * GET /transaction/utxos
	 */
	async getTransactionUtxos(hash: string): Promise<TransactionUtxo> {
		return this.request<TransactionUtxo>("/transaction/utxos", {
			queryParams: { hash },
		});
	}
}
