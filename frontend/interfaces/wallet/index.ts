export interface FtPosition {
	"24h": number;
	"30d": number;
	"7d": number;
	adaValue: number;
	balance: number;
	fingerprint: string;
	liquidBalance: number;
	liquidValue: number;
	price: number;
	ticker: string;
	unit: string;
}

export interface LpPosition {
	adaValue: number;
	amountLP: number;
	exchange: string;
	ticker: string;
	tokenA: string;
	tokenAAmount: number;
	tokenAName: string;
	tokenB: string;
	tokenBAmount: number;
	tokenBName: string;
	unit: string;
}

export interface NftPosition {
	"24h": number;
	"30d": number;
	"7d": number;
	adaValue: number;
	balance: number;
	floorPrice: number;
	liquidValue: number;
	listings: number;
	name: string;
	policy: string;
}

export interface PortfolioPositionsResponse {
	adaBalance: number;
	adaValue: number;
	liquidValue: number;
	numFTs: number;
	numNFTs: number;
	positionsFt: FtPosition[];
	positionsLp: LpPosition[];
	positionsNft: NftPosition[];
}

export interface WalletTokenTrade {
	action: string;
	hash: string;
	time: number;
	tokenA: string;
	tokenAAmount: number;
	tokenAName: string;
	tokenB: string;
	tokenBAmount: number;
	tokenBName: string;
}

export interface PortfolioTrendedValueResponse {
	time: number;
	value: number;
}
