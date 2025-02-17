// interfaces/nft/index.ts

/**
 * NFT Asset Endpoints
 */
export interface NftSaleHistoryItem {
	buyerStakeAddress: string;
	price: number;
	sellerStakeAddress: string;
	time: number;
}

export interface NftAssetStats {
	isListed: boolean;
	lastListedPrice: number;
	lastListedTime: number;
	lastSoldPrice: number;
	lastSoldTime: number;
	owners: number;
	sales: number;
	timesListed: number;
	volume: number;
}

export interface NftTrait {
	category: string;
	name: string;
	price: number;
	rarity: number;
}

export interface NftAssetTraits {
	rank: number;
	traits: NftTrait[];
}

/**
 * NFT Collection Endpoints
 */
export interface CollectionAsset {
	image: string;
	name: string;
	price: number;
	rank: number;
}

export interface HolderDistribution {
	[bucket: string]: number;
}

export interface NftTopHolder {
	address: string;
	amount: number;
}

export interface TrendedHolder {
	holders: number;
	time: number;
}

export interface CollectionInfo {
	description: string;
	discord: string;
	logo: string;
	name: string;
	supply: number;
	twitter: string;
	website: string;
}

export interface ActiveListingsResponse {
	listings: number;
	supply: number;
}

export interface NftListingsDepthItem {
	avg: number;
	count: number;
	price: number;
	total: number;
}

export interface NftIndividualListing {
	image: string;
	market: string;
	name: string;
	price: number;
	time: number;
}

export interface NftListingsTrendedItem {
	listings: number;
	price: number;
	time: number;
}

export interface NftFloorPriceOHLCV {
	open: number;
	high: number;
	low: number;
	close: number;
	time: number;
	volume: number;
}

export interface CollectionStats {
	listings: number;
	owners: number;
	price: number;
	sales: number;
	supply: number;
	topOffer: number;
	volume: number;
}

export interface CollectionStatsExtended {
	listings: number;
	listingsPctChg: number;
	owners: number;
	ownersPctChg: number;
	price: number;
	pricePctChg: number;
	sales: number;
	salesPctChg: number;
	supply: number;
	topOffer: number;
	volume: number;
	volumePctChg: number;
}

/**
 * NFT Trades & Stats
 */
export interface NftTrade {
	buyerAddress: string;
	collectionName: string;
	hash: string;
	image: string;
	market: string;
	name: string;
	policy: string;
	price: number;
	sellerAddress: string;
	time: number;
}

export interface NftTradingStats {
	buyers: number;
	sales: number;
	sellers: number;
	volume: number;
}

export interface CollectionTraitPrices {
	[traitCategory: string]: {
		[traitName: string]: number;
	};
}

export interface CollectionMetadataRarity {
	[attribute: string]: {
		[value: string]: number;
	};
}

export interface NftRarityRank {
	rank: number;
}

export interface NftVolumeTrendedItem {
	price: number;
	sales: number;
	time: number;
	volume: number;
}

/**
 * NFT Market & Marketplace
 */
export interface NftMarketStats {
	addresses: number;
	buyers: number;
	sales: number;
	sellers: number;
	volume: number;
}

export interface NftMarketStatsExtended {
	addresses: number;
	addressesPctChg: number;
	buyers: number;
	buyersPctChg: number;
	sales: number;
	salesPctChg: number;
	sellers: number;
	sellersPctChg: number;
	volume: number;
	volumePctChg: number;
}

export interface NftMarketVolumeItem {
	time: number;
	value: number;
}

export interface NftMarketplaceStats {
	avgSale: number;
	fees: number;
	liquidity: number;
	listings: number;
	name: string;
	royalties: number;
	sales: number;
	users: number;
	volume: number;
}

/**
 * NFT Rankings & Top Volume
 */
export interface NftTopRanking {
	listings: number;
	logo: string;
	marketCap: number;
	name: string;
	policy: string;
	price: number;
	price24hChg: number;
	price30dChg: number;
	price7dChg: number;
	rank: number;
	supply: number;
	volume24h: number;
	volume24hChg: number;
	volume30d: number;
	volume30dChg: number;
	volume7d: number;
	volume7dChg: number;
}

export interface TopVolumeCollection {
	listings: number;
	logo: string;
	name: string;
	policy: string;
	price: number;
	sales: number;
	supply: number;
	volume: number;
}

export interface TopVolumeCollectionExtended {
	listings: number;
	listingsPctChg: number;
	logo: string;
	name: string;
	owners: number;
	ownersPctChg: number;
	policy: string;
	price: number;
	pricePctChg: number;
	sales: number;
	salesPctChg: number;
	supply: number;
	volume: number;
	volumePctChg: number;
}
