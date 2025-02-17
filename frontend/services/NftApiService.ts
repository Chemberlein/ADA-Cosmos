import { BaseApiService } from ".";
import { INftApi } from "@/interfaces/nft/INftApi";
import {
	NftSaleHistoryItem,
	NftAssetStats,
	NftAssetTraits,
	CollectionAsset,
	HolderDistribution,
	NftTopHolder,
	TrendedHolder,
	CollectionInfo,
	ActiveListingsResponse,
	NftListingsDepthItem,
	NftIndividualListing,
	NftListingsTrendedItem,
	NftFloorPriceOHLCV,
	CollectionStats,
	CollectionStatsExtended,
	NftTrade,
	NftTradingStats,
	CollectionTraitPrices,
	CollectionMetadataRarity,
	NftRarityRank,
	NftVolumeTrendedItem,
	NftMarketStats,
	NftMarketStatsExtended,
	NftMarketVolumeItem,
	NftMarketplaceStats,
	NftTopRanking,
	TopVolumeCollection,
	TopVolumeCollectionExtended,
} from "@/interfaces/nft";

export class NftApiService extends BaseApiService implements INftApi {
	/** NFT Asset endpoints **/
	async getNftSaleHistory(
		policy: string,
		name?: string
	): Promise<NftSaleHistoryItem[]> {
		return this.request<NftSaleHistoryItem[]>("/nft/asset/sales", {
			queryParams: { policy, name },
		});
	}

	async getNftAssetStats(
		policy: string,
		name: string
	): Promise<NftAssetStats> {
		return this.request<NftAssetStats>("/nft/asset/stats", {
			queryParams: { policy, name },
		});
	}

	async getNftAssetTraits(
		policy: string,
		name: string,
		prices: string = "1"
	): Promise<NftAssetTraits> {
		return this.request<NftAssetTraits>("/nft/asset/traits", {
			queryParams: { policy, name, prices },
		});
	}

	/** NFT Collection endpoints **/
	async getCollectionAssets(
		policy: string,
		sortBy: string = "price",
		order: string = "asc",
		search?: string,
		onSale: string = "0",
		page: number = 1,
		perPage: number = 100
	): Promise<CollectionAsset[]> {
		return this.request<CollectionAsset[]>("/nft/collection/assets", {
			queryParams: {
				policy,
				sortBy,
				order,
				search,
				onSale,
				page,
				perPage,
			},
		});
	}

	async getHolderDistribution(policy: string): Promise<HolderDistribution> {
		return this.request<HolderDistribution>(
			"/nft/collection/holders/distribution",
			{
				queryParams: { policy },
			}
		);
	}

	async getTopHolders(
		policy: string,
		page: number = 1,
		perPage: number = 10,
		excludeExchanges: number = 0
	): Promise<NftTopHolder[]> {
		return this.request<NftTopHolder[]>("/nft/collection/holders/top", {
			queryParams: { policy, page, perPage, excludeExchanges },
		});
	}

	async getTrendedHolders(
		policy: string,
		timeframe: string = "30d"
	): Promise<TrendedHolder[]> {
		return this.request<TrendedHolder[]>(
			"/nft/collection/holders/trended",
			{
				queryParams: { policy, timeframe },
			}
		);
	}

	async getCollectionInfo(policy: string): Promise<CollectionInfo> {
		return this.request<CollectionInfo>("/nft/collection/info", {
			queryParams: { policy },
		});
	}

	async getActiveListings(policy: string): Promise<ActiveListingsResponse> {
		return this.request<ActiveListingsResponse>(
			"/nft/collection/listings",
			{
				queryParams: { policy },
			}
		);
	}

	async getNftListingsDepth(
		policy: string,
		items: number = 500
	): Promise<NftListingsDepthItem[]> {
		return this.request<NftListingsDepthItem[]>(
			"/nft/collection/listings/depth",
			{
				queryParams: { policy, items },
			}
		);
	}

	async getIndividualListings(
		policy: string,
		sortBy: string = "price",
		order: string = "asc",
		page: number = 1,
		perPage: number = 100
	): Promise<NftIndividualListing[]> {
		return this.request<NftIndividualListing[]>(
			"/nft/collection/listings/individual",
			{
				queryParams: { policy, sortBy, order, page, perPage },
			}
		);
	}

	async getNftListingsTrended(
		policy: string,
		interval: string,
		numIntervals?: number
	): Promise<NftListingsTrendedItem[]> {
		return this.request<NftListingsTrendedItem[]>(
			"/nft/collection/listings/trended",
			{
				queryParams: { policy, interval, numIntervals },
			}
		);
	}

	async getNftFloorPriceOHLCV(
		policy: string,
		interval: string,
		numIntervals: number
	): Promise<NftFloorPriceOHLCV[]> {
		return this.request<NftFloorPriceOHLCV[]>("/nft/collection/ohlcv", {
			queryParams: { policy, interval, numIntervals },
		});
	}

	/** NFT Collection stats & trades **/
	async getCollectionStats(policy: string): Promise<CollectionStats> {
		return this.request<CollectionStats>("/nft/collection/stats", {
			queryParams: { policy },
		});
	}

	async getCollectionStatsExtended(
		policy: string,
		timeframe: string = "24h"
	): Promise<CollectionStatsExtended> {
		return this.request<CollectionStatsExtended>(
			"/nft/collection/stats/extended",
			{
				queryParams: { policy, timeframe },
			}
		);
	}

	async getNftTrades(
		policy?: string,
		timeframe: string = "30d",
		sortBy: string = "time",
		order: string = "desc",
		minAmount?: number,
		from?: number,
		page: number = 1,
		perPage: number = 100
	): Promise<NftTrade[]> {
		return this.request<NftTrade[]>("/nft/collection/trades", {
			queryParams: {
				policy,
				timeframe,
				sortBy,
				order,
				minAmount,
				from,
				page,
				perPage,
			},
		});
	}

	async getNftTradingStats(
		policy: string,
		timeframe: string = "24h"
	): Promise<NftTradingStats> {
		return this.request<NftTradingStats>("/nft/collection/trades/stats", {
			queryParams: { policy, timeframe },
		});
	}

	async getCollectionTraitPrices(
		policy: string,
		name: string
	): Promise<CollectionTraitPrices> {
		return this.request<CollectionTraitPrices>(
			"/nft/collection/traits/price",
			{
				queryParams: { policy, name },
			}
		);
	}

	async getCollectionMetadataRarity(
		policy: string
	): Promise<CollectionMetadataRarity> {
		return this.request<CollectionMetadataRarity>(
			"/nft/collection/traits/rarity",
			{
				queryParams: { policy },
			}
		);
	}

	async getNftRarityRank(
		policy: string,
		name: string
	): Promise<NftRarityRank> {
		return this.request<NftRarityRank>(
			"/nft/collection/traits/rarity/rank",
			{
				queryParams: { policy, name },
			}
		);
	}

	async getNftVolumeTrended(
		policy: string,
		interval: string,
		numIntervals?: number
	): Promise<NftVolumeTrendedItem[]> {
		return this.request<NftVolumeTrendedItem[]>(
			"/nft/collection/volume/trended",
			{
				queryParams: { policy, interval, numIntervals },
			}
		);
	}

	/** NFT Market & Marketplace endpoints **/
	async getMarketStats(timeframe: string = "24h"): Promise<NftMarketStats> {
		return this.request<NftMarketStats>("/nft/market/stats", {
			queryParams: { timeframe },
		});
	}

	async getMarketStatsExtended(
		timeframe: string = "24h"
	): Promise<NftMarketStatsExtended> {
		return this.request<NftMarketStatsExtended>(
			"/nft/market/stats/extended",
			{
				queryParams: { timeframe },
			}
		);
	}

	async getNftMarketVolume(
		timeframe: string = "30d"
	): Promise<NftMarketVolumeItem[]> {
		return this.request<NftMarketVolumeItem[]>(
			"/nft/market/volume/trended",
			{
				queryParams: { timeframe },
			}
		);
	}

	async getNftMarketplaceStats(
		timeframe: string = "30d",
		marketplace?: string,
		lastDay: number = 0
	): Promise<NftMarketplaceStats[]> {
		return this.request<NftMarketplaceStats[]>("/nft/marketplace/stats", {
			queryParams: { timeframe, marketplace, lastDay },
		});
	}

	async getNftTopRankings(
		ranking: string,
		items: number = 25
	): Promise<NftTopRanking[]> {
		return this.request<NftTopRanking[]>("/nft/top/timeframe", {
			queryParams: { ranking, items },
		});
	}

	/** NFT Top Volume endpoints **/
	async getTopVolumeCollections(
		timeframe: string = "24h",
		page: number = 1,
		perPage: number = 10
	): Promise<TopVolumeCollection[]> {
		return this.request<TopVolumeCollection[]>("/nft/top/volume", {
			queryParams: { timeframe, page, perPage },
		});
	}

	async getTopVolumeCollectionsExtended(
		timeframe: string = "24h",
		page: number = 1,
		perPage: number = 10
	): Promise<TopVolumeCollectionExtended[]> {
		return this.request<TopVolumeCollectionExtended[]>(
			"/nft/top/volume/extended",
			{
				queryParams: { timeframe, page, perPage },
			}
		);
	}
}
