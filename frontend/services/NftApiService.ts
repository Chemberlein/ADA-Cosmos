import { BaseApiService } from '.';
import { INftApi } from '@/interfaces/nft/INftApi';
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
} from '@/interfaces/nft';

export class NftApiService extends BaseApiService implements INftApi {
  /**
   * Get a specific NFT asset's sale history.
   * GET /nft/asset/sales
   *
   * @param {string} policy - The policy ID for the collection (required).
   *   Example: "40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728"
   * @param {string} [name] - (Optional) The name of the NFT to get stats for.
   *   Example: "ClayNation3725"
   * @returns {Promise<NftSaleHistoryItem[]>} An array of sale history records.
   */
  async getNftSaleHistory(
    policy: string,
    name?: string
  ): Promise<NftSaleHistoryItem[]> {
    return this.request<NftSaleHistoryItem[]>('/nft/asset/sales', {
      queryParams: { policy, name },
    });
  }

  /**
   * Get high-level stats for a specific NFT asset.
   * GET /nft/asset/stats
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} name - The name of the NFT (required).
   * @returns {Promise<NftAssetStats>} An object containing the NFT's stats.
   */
  async getNftAssetStats(policy: string, name: string): Promise<NftAssetStats> {
    return this.request<NftAssetStats>('/nft/asset/stats', {
      queryParams: { policy, name },
    });
  }

  /**
   * Get an NFT asset's traits and their prices.
   * GET /nft/asset/traits
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} name - The name of the NFT (required).
   * @param {string} [prices="1"] - Option to include trait prices (1 to include, 0 to exclude). Default is "1".
   * @returns {Promise<NftAssetTraits>} An object containing traits and their prices.
   */
  async getNftAssetTraits(
    policy: string,
    name: string,
    prices: string = '1'
  ): Promise<NftAssetTraits> {
    return this.request<NftAssetTraits>('/nft/asset/traits', {
      queryParams: { policy, name, prices },
    });
  }

  /**
   * Get all NFTs from a collection with sorting and filtering options.
   * GET /nft/collection/assets
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} [sortBy="price"] - Field to sort by; options: "price", "rank". Default is "price".
   * @param {string} [order="asc"] - Sort order; options: "asc", "desc". Default is "asc".
   * @param {string} [search] - (Optional) Search term to filter NFT names.
   * @param {string} [onSale="0"] - (Optional) Filter for NFTs on sale; "1" returns only on-sale NFTs. Default is "0".
   * @param {number} [page=1] - (Optional) Page number for pagination. Default is 1.
   * @param {number} [perPage=100] - (Optional) Number of items per page. Default is 100.
   * @returns {Promise<CollectionAsset[]>} An array of NFT collection assets.
   */
  async getCollectionAssets(
    policy: string,
    sortBy: string = 'price',
    order: string = 'asc',
    search?: string,
    onSale: string = '0',
    page: number = 1,
    perPage: number = 100
  ): Promise<CollectionAsset[]> {
    return this.request<CollectionAsset[]>('/nft/collection/assets', {
      queryParams: { policy, sortBy, order, search, onSale, page, perPage },
    });
  }

  /**
   * Get the distribution of NFT holdings within a collection.
   * GET /nft/collection/holders/distribution
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @returns {Promise<HolderDistribution>} An object mapping holding groups to counts.
   */
  async getHolderDistribution(policy: string): Promise<HolderDistribution> {
    return this.request<HolderDistribution>(
      '/nft/collection/holders/distribution',
      {
        queryParams: { policy },
      }
    );
  }

  /**
   * Get the top NFT holders for a collection.
   * GET /nft/collection/holders/top
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {number} [page=1] - (Optional) Page number for pagination. Default is 1.
   * @param {number} [perPage=10] - (Optional) Number of items per page. Default is 10.
   * @param {number} [excludeExchanges=0] - (Optional) Exclude marketplace addresses if set to 1. Default is 0.
   * @returns {Promise<NftTopHolder[]>} An array of top holder records.
   */
  async getTopHolders(
    policy: string,
    page: number = 1,
    perPage: number = 10,
    excludeExchanges: number = 0
  ): Promise<NftTopHolder[]> {
    return this.request<NftTopHolder[]>('/nft/collection/holders/top', {
      queryParams: { policy, page, perPage, excludeExchanges },
    });
  }

  /**
   * Get trended NFT holder counts over a specified timeframe.
   * GET /nft/collection/holders/trended
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} [timeframe="30d"] - (Optional) Timeframe for trending data. Default is "30d".
   * @returns {Promise<TrendedHolder[]>} An array of trended holder data points.
   */
  async getTrendedHolders(
    policy: string,
    timeframe: string = '30d'
  ): Promise<TrendedHolder[]> {
    return this.request<TrendedHolder[]>('/nft/collection/holders/trended', {
      queryParams: { policy, timeframe },
    });
  }

  /**
   * Get basic information about an NFT collection.
   * GET /nft/collection/info
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @returns {Promise<CollectionInfo>} An object containing collection information.
   */
  async getCollectionInfo(policy: string): Promise<CollectionInfo> {
    return this.request<CollectionInfo>('/nft/collection/info', {
      queryParams: { policy },
    });
  }

  /**
   * Get a list of active NFT listings in a collection.
   * GET /nft/collection/listings
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @returns {Promise<ActiveListingsResponse>} An object containing active listings data.
   */
  async getActiveListings(policy: string): Promise<ActiveListingsResponse> {
    return this.request<ActiveListingsResponse>('/nft/collection/listings', {
      queryParams: { policy },
    });
  }

  /**
   * Get cumulative NFT listings depth starting at the floor.
   * GET /nft/collection/listings/depth
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {number} [items=500] - (Optional) Number of items to return. Default is 500.
   * @returns {Promise<NftListingsDepthItem[]>} An array of listing depth items.
   */
  async getNftListingsDepth(
    policy: string,
    items: number = 500
  ): Promise<NftListingsDepthItem[]> {
    return this.request<NftListingsDepthItem[]>(
      '/nft/collection/listings/depth',
      {
        queryParams: { policy, items },
      }
    );
  }

  /**
   * Get a list of individual active NFT listings with pagination.
   * GET /nft/collection/listings/individual
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} [sortBy="price"] - (Optional) Field to sort by; options: "price" or "time". Default is "price".
   * @param {string} [order="asc"] - (Optional) Sort order; options: "asc" or "desc". Default is "asc".
   * @param {number} [page=1] - (Optional) Page number for pagination. Default is 1.
   * @param {number} [perPage=100] - (Optional) Number of items per page. Default is 100.
   * @returns {Promise<NftIndividualListing[]>} An array of individual listing records.
   */
  async getIndividualListings(
    policy: string,
    sortBy: string = 'price',
    order: string = 'asc',
    page: number = 1,
    perPage: number = 100
  ): Promise<NftIndividualListing[]> {
    return this.request<NftIndividualListing[]>(
      '/nft/collection/listings/individual',
      {
        queryParams: { policy, sortBy, order, page, perPage },
      }
    );
  }

  /**
   * Get trended NFT listings data over time.
   * GET /nft/collection/listings/trended
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} interval - Time interval for each data point (required). Options: "3m", "5m", "15m", "30m", "1h", etc.
   * @param {number} [numIntervals] - (Optional) Number of intervals to return.
   * @returns {Promise<NftListingsTrendedItem[]>} An array of trended listing data.
   */
  async getNftListingsTrended(
    policy: string,
    interval: string,
    numIntervals?: number
  ): Promise<NftListingsTrendedItem[]> {
    return this.request<NftListingsTrendedItem[]>(
      '/nft/collection/listings/trended',
      {
        queryParams: { policy, interval, numIntervals },
      }
    );
  }

  /**
   * Get OHLCV data for the floor price of an NFT collection.
   * GET /nft/collection/ohlcv
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} interval - Time interval for each OHLCV data point (required).
   * @param {number} numIntervals - Number of intervals to return (required).
   * @returns {Promise<NftFloorPriceOHLCV[]>} An array of OHLCV data points.
   */
  async getNftFloorPriceOHLCV(
    policy: string,
    interval: string,
    numIntervals: number
  ): Promise<NftFloorPriceOHLCV[]> {
    return this.request<NftFloorPriceOHLCV[]>('/nft/collection/ohlcv', {
      queryParams: { policy, interval, numIntervals },
    });
  }

  /**
   * Get basic statistics for a collection.
   * GET /nft/collection/stats
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @returns {Promise<CollectionStats>} An object with collection stats like listings, owners, price, etc.
   */
  async getCollectionStats(policy: string): Promise<CollectionStats> {
    return this.request<CollectionStats>('/nft/collection/stats', {
      queryParams: { policy },
    });
  }

  /**
   * Get extended statistics for a collection including percentage changes.
   * GET /nft/collection/stats/extended
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} [timeframe="24h"] - (Optional) Timeframe for percentage change calculations. Default is "24h".
   * @returns {Promise<CollectionStatsExtended>} An object with extended collection stats.
   */
  async getCollectionStatsExtended(
    policy: string,
    timeframe: string = '24h'
  ): Promise<CollectionStatsExtended> {
    return this.request<CollectionStatsExtended>(
      '/nft/collection/stats/extended',
      {
        queryParams: { policy, timeframe },
      }
    );
  }

  /**
   * Get individual NFT trades for a collection or the overall NFT market.
   * GET /nft/collection/trades
   *
   * @param {string} [policy] - (Optional) The policy ID for the collection. If omitted, returns market-wide trades.
   * @param {string} [timeframe="30d"] - (Optional) Timeframe for trade data. Default is "30d".
   * @param {string} [sortBy="time"] - (Optional) Field to sort by; options: "time" or "amount". Default is "time".
   * @param {string} [order="desc"] - (Optional) Sort order; options: "asc" or "desc". Default is "desc".
   * @param {number} [minAmount] - (Optional) Minimum ADA amount filter.
   * @param {number} [from] - (Optional) UNIX timestamp; returns trades after this time.
   * @param {number} [page=1] - (Optional) Page number for pagination. Default is 1.
   * @param {number} [perPage=100] - (Optional) Number of items per page. Default is 100.
   * @returns {Promise<NftTrade[]>} An array of NFT trade records.
   */
  async getNftTrades(
    policy?: string,
    timeframe: string = '30d',
    sortBy: string = 'time',
    order: string = 'desc',
    minAmount?: number,
    from?: number,
    page: number = 1,
    perPage: number = 100
  ): Promise<NftTrade[]> {
    return this.request<NftTrade[]>('/nft/collection/trades', {
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

  /**
   * Get trading statistics (volume, sales, etc.) for a collection.
   * GET /nft/collection/trades/stats
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} [timeframe="24h"] - (Optional) Timeframe for volume aggregation. Default is "24h".
   * @returns {Promise<NftTradingStats>} An object with trading stats.
   */
  async getNftTradingStats(
    policy: string,
    timeframe: string = '24h'
  ): Promise<NftTradingStats> {
    return this.request<NftTradingStats>('/nft/collection/trades/stats', {
      queryParams: { policy, timeframe },
    });
  }

  /**
   * Get trait floor prices for a specific NFT in a collection.
   * GET /nft/collection/traits/price
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} name - The name of the NFT (required).
   * @returns {Promise<CollectionTraitPrices>} An object mapping traits to their floor prices.
   */
  async getCollectionTraitPrices(
    policy: string,
    name: string
  ): Promise<CollectionTraitPrices> {
    return this.request<CollectionTraitPrices>('/nft/collection/traits/price', {
      queryParams: { policy, name },
    });
  }

  /**
   * Get metadata rarity information for every attribute in a collection.
   * GET /nft/collection/traits/rarity
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @returns {Promise<CollectionMetadataRarity>} An object with rarity probabilities for each attribute.
   */
  async getCollectionMetadataRarity(
    policy: string
  ): Promise<CollectionMetadataRarity> {
    return this.request<CollectionMetadataRarity>(
      '/nft/collection/traits/rarity',
      {
        queryParams: { policy },
      }
    );
  }

  /**
   * Get the rarity rank for a specific NFT within a collection.
   * GET /nft/collection/traits/rarity/rank
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} name - The name of the NFT (required).
   * @returns {Promise<NftRarityRank>} An object containing the NFT's rarity rank.
   */
  async getNftRarityRank(policy: string, name: string): Promise<NftRarityRank> {
    return this.request<NftRarityRank>('/nft/collection/traits/rarity/rank', {
      queryParams: { policy, name },
    });
  }

  /**
   * Get trended volume and number of sales for a collection.
   * GET /nft/collection/volume/trended
   *
   * @param {string} policy - The policy ID for the collection (required).
   * @param {string} interval - Time interval for each data point (required).
   * @param {number} [numIntervals] - (Optional) Number of intervals to return.
   * @returns {Promise<NftVolumeTrendedItem[]>} An array of volume trended data points.
   */
  async getNftVolumeTrended(
    policy: string,
    interval: string,
    numIntervals?: number
  ): Promise<NftVolumeTrendedItem[]> {
    return this.request<NftVolumeTrendedItem[]>(
      '/nft/collection/volume/trended',
      {
        queryParams: { policy, interval, numIntervals },
      }
    );
  }

  /**
   * Get high-level market stats across the entire NFT market.
   * GET /nft/market/stats
   *
   * @param {string} [timeframe="24h"] - (Optional) Timeframe for market stats. Default is "24h".
   * @returns {Promise<NftMarketStats>} An object with market stats.
   */
  async getMarketStats(timeframe: string = '24h'): Promise<NftMarketStats> {
    return this.request<NftMarketStats>('/nft/market/stats', {
      queryParams: { timeframe },
    });
  }

  /**
   * Get extended market stats across the NFT market including percent changes.
   * GET /nft/market/stats/extended
   *
   * @param {string} [timeframe="24h"] - (Optional) Timeframe for extended stats. Default is "24h".
   * @returns {Promise<NftMarketStatsExtended>} An object with extended market stats.
   */
  async getMarketStatsExtended(
    timeframe: string = '24h'
  ): Promise<NftMarketStatsExtended> {
    return this.request<NftMarketStatsExtended>('/nft/market/stats/extended', {
      queryParams: { timeframe },
    });
  }

  /**
   * Get trended market volume for the NFT market.
   * GET /nft/market/volume/trended
   *
   * @param {string} [timeframe="30d"] - (Optional) Timeframe for volume trending. Default is "30d".
   * @returns {Promise<NftMarketVolumeItem[]>} An array of market volume data points.
   */
  async getNftMarketVolume(
    timeframe: string = '30d'
  ): Promise<NftMarketVolumeItem[]> {
    return this.request<NftMarketVolumeItem[]>('/nft/market/volume/trended', {
      queryParams: { timeframe },
    });
  }

  /**
   * Get high-level NFT marketplace stats.
   * GET /nft/marketplace/stats
   *
   * @param {string} [timeframe="30d"] - (Optional) Timeframe for marketplace stats. Default is "30d".
   * @param {string} [marketplace] - (Optional) Filter data by marketplace name.
   * @param {number} [lastDay=0] - (Optional) If set to 1, only counts data from yesterday. Default is 0.
   * @returns {Promise<NftMarketplaceStats[]>} An array of marketplace stats records.
   */
  async getNftMarketplaceStats(
    timeframe: string = '30d',
    marketplace?: string,
    lastDay: number = 0
  ): Promise<NftMarketplaceStats[]> {
    return this.request<NftMarketplaceStats[]>('/nft/marketplace/stats', {
      queryParams: { timeframe, marketplace, lastDay },
    });
  }

  /**
   * Get top NFT rankings based on a specified criterion.
   * GET /nft/top/timeframe
   *
   * @param {string} ranking - Ranking criteria; options: "marketCap", "volume", "gainers", "losers" (required).
   * @param {number} [items=25] - (Optional) Number of items to return. Maximum is 100, default is 25.
   * @returns {Promise<NftTopRanking[]>} An array of top ranking NFT collections.
   */
  async getNftTopRankings(
    ranking: string,
    items: number = 25
  ): Promise<NftTopRanking[]> {
    return this.request<NftTopRanking[]>('/nft/top/timeframe', {
      queryParams: { ranking, items },
    });
  }

  /**
   * Get top NFT collections by trading volume.
   * GET /nft/top/volume
   *
   * @param {string} [timeframe="24h"] - (Optional) Timeframe for volume aggregation. Default is "24h".
   * @param {number} [page=1] - (Optional) Page number for pagination. Default is 1.
   * @param {number} [perPage=10] - (Optional) Number of items per page. Default is 10.
   * @returns {Promise<TopVolumeCollection[]>} An array of top volume collection records.
   */
  async getTopVolumeCollections(
    timeframe: string = '24h',
    page: number = 1,
    perPage: number = 10
  ): Promise<TopVolumeCollection[]> {
    return this.request<TopVolumeCollection[]>('/nft/top/volume', {
      queryParams: { timeframe, page, perPage },
    });
  }

  /**
   * Get top NFT collections by trading volume with extended percent change data.
   * GET /nft/top/volume/extended
   *
   * @param {string} [timeframe="24h"] - (Optional) Timeframe for volume aggregation. Default is "24h".
   * @param {number} [page=1] - (Optional) Page number for pagination. Default is 1.
   * @param {number} [perPage=10] - (Optional) Number of items per page. Default is 10.
   * @returns {Promise<TopVolumeCollectionExtended[]>} An array of extended top volume collection records.
   */
  async getTopVolumeCollectionsExtended(
    timeframe: string = '24h',
    page: number = 1,
    perPage: number = 10
  ): Promise<TopVolumeCollectionExtended[]> {
    return this.request<TopVolumeCollectionExtended[]>(
      '/nft/top/volume/extended',
      {
        queryParams: { timeframe, page, perPage },
      }
    );
  }
}
