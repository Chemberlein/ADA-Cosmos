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
} from ".";

export interface INftApi {
	/** NFT Asset endpoints **/
	getNftSaleHistory(
		policy: string,
		name?: string
	): Promise<NftSaleHistoryItem[]>;
	getNftAssetStats(policy: string, name: string): Promise<NftAssetStats>;
	getNftAssetTraits(
		policy: string,
		name: string,
		prices?: string
	): Promise<NftAssetTraits>;

	/** NFT Collection endpoints **/
	getCollectionAssets(
		policy: string,
		sortBy?: string,
		order?: string,
		search?: string,
		onSale?: string,
		page?: number,
		perPage?: number
	): Promise<CollectionAsset[]>;
	getHolderDistribution(policy: string): Promise<HolderDistribution>;
	getTopHolders(
		policy: string,
		page?: number,
		perPage?: number,
		excludeExchanges?: number
	): Promise<NftTopHolder[]>;
	getTrendedHolders(
		policy: string,
		timeframe?: string
	): Promise<TrendedHolder[]>;
	getCollectionInfo(policy: string): Promise<CollectionInfo>;
	getActiveListings(policy: string): Promise<ActiveListingsResponse>;
	getNftListingsDepth(
		policy: string,
		items?: number
	): Promise<NftListingsDepthItem[]>;
	getIndividualListings(
		policy: string,
		sortBy?: string,
		order?: string,
		page?: number,
		perPage?: number
	): Promise<NftIndividualListing[]>;
	getNftListingsTrended(
		policy: string,
		interval: string,
		numIntervals?: number
	): Promise<NftListingsTrendedItem[]>;
	getNftFloorPriceOHLCV(
		policy: string,
		interval: string,
		numIntervals: number
	): Promise<NftFloorPriceOHLCV[]>;

	/** NFT Collection stats & trades **/
	getCollectionStats(policy: string): Promise<CollectionStats>;
	getCollectionStatsExtended(
		policy: string,
		timeframe?: string
	): Promise<CollectionStatsExtended>;
	getNftTrades(
		policy?: string,
		timeframe?: string,
		sortBy?: string,
		order?: string,
		minAmount?: number,
		from?: number,
		page?: number,
		perPage?: number
	): Promise<NftTrade[]>;
	getNftTradingStats(
		policy: string,
		timeframe?: string
	): Promise<NftTradingStats>;
	getCollectionTraitPrices(
		policy: string,
		name: string
	): Promise<CollectionTraitPrices>;
	getCollectionMetadataRarity(
		policy: string
	): Promise<CollectionMetadataRarity>;
	getNftRarityRank(policy: string, name: string): Promise<NftRarityRank>;
	getNftVolumeTrended(
		policy: string,
		interval: string,
		numIntervals?: number
	): Promise<NftVolumeTrendedItem[]>;

	/** NFT Market & Marketplace endpoints **/
	getMarketStats(timeframe: string): Promise<NftMarketStats>;
	getMarketStatsExtended(timeframe: string): Promise<NftMarketStatsExtended>;
	getNftMarketVolume(timeframe?: string): Promise<NftMarketVolumeItem[]>;
	getNftMarketplaceStats(
		timeframe?: string,
		marketplace?: string,
		lastDay?: number
	): Promise<NftMarketplaceStats[]>;
	getNftTopRankings(
		ranking: string,
		items?: number
	): Promise<NftTopRanking[]>;

	/** NFT Top Volume endpoints **/
	getTopVolumeCollections(
		timeframe?: string,
		page?: number,
		perPage?: number
	): Promise<TopVolumeCollection[]>;
	getTopVolumeCollectionsExtended(
		timeframe?: string,
		page?: number,
		perPage?: number
	): Promise<TopVolumeCollectionExtended[]>;
}
