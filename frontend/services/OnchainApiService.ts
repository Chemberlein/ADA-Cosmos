import { IOnchainApi } from '@/interfaces/onchain/IOnchainApi';
import { BaseApiService } from '.';
import {
  AssetSupplyResponse,
  AddressInfoResponse,
  AddressUtxo,
  TransactionUtxo,
} from '@/interfaces/onchain';

export class OnchainApiService extends BaseApiService implements IOnchainApi {
  /**
   * Get onchain supply for a token.
   *
   * @param {string} unit - Token unit (policy + hex name) (required).
   *   Example: "8fef2d34078659493ce161a6c7fba4b56afefa8535296a5743f6958741414441"
   * @returns {Promise<AssetSupplyResponse>} A promise that resolves to an object containing the token's supply.
   */
  async getAssetSupply(unit: string): Promise<AssetSupplyResponse> {
    return this.request<AssetSupplyResponse>('/asset/supply', {
      queryParams: { unit },
    });
  }

  /**
   * Get address information including payment credential, stake address, lovelace balance, and assets.
   *
   * Either an address or a payment credential must be provided.
   *
   * @param {object} params - Query parameters.
   * @param {string} [params.address] - Address to query for (optional if paymentCred is provided).
   * @param {string} [params.paymentCred] - Payment credential to query for (optional if address is provided).
   * @returns {Promise<AddressInfoResponse>} A promise that resolves to the address information.
   */
  async getAddressInfo(params: {
    address?: string;
    paymentCred?: string;
  }): Promise<AddressInfoResponse> {
    return this.request<AddressInfoResponse>('/address/info', {
      queryParams: params,
    });
  }

  /**
   * Get current UTxOs at an address or associated with a payment credential.
   *
   * Either an address or a payment credential must be provided.
   *
   * @param {object} params - Query parameters.
   * @param {string} [params.address] - Address to query for (optional if paymentCred is provided).
   * @param {string} [params.paymentCred] - Payment credential to query for (optional if address is provided).
   * @param {number} [params.page] - Page number for pagination (optional, default is 1).
   * @param {number} [params.perPage] - Number of items per page (optional, default is 100, maximum is 100).
   * @returns {Promise<AddressUtxo[]>} A promise that resolves to an array of UTxOs.
   */
  async getAddressUtxos(params: {
    address?: string;
    paymentCred?: string;
    page?: number;
    perPage?: number;
  }): Promise<AddressUtxo[]> {
    return this.request<AddressUtxo[]>('/address/utxos', {
      queryParams: params,
    });
  }

  /**
   * Get UTxOs from a specific transaction.
   *
   * @param {string} hash - Transaction hash (required).
   *   Example: "8be33680ec04da1cc98868699c5462fbbf6975529fb6371669fa735d2972d69b"
   * @returns {Promise<TransactionUtxo>} A promise that resolves to the UTxO details of the transaction.
   */
  async getTransactionUtxos(hash: string): Promise<TransactionUtxo> {
    return this.request<TransactionUtxo>('/transaction/utxos', {
      queryParams: { hash },
    });
  }
}
