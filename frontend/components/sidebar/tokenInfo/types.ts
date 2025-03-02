// constants.ts
export const TIMEFRAMES = ["1h", "4h", "24h", "7d", "30d"];

export const TIMEFRAME_MAPPING = {
	"1h": "1h",
	"4h": "4h",
	"24h": "1d",
	"7d": "1w",
	"30d": "1M",
};

export interface Token {
	ticker: string;
	socials: {
		description: string | undefined | null;
		[key: string]: string | undefined | null;
	};
	mcap?: number;
	holders?: number;
	tradingStats: Array<{
		timeframe: string;
		stats: {
			buys: number;
			sells: number;
			buyVolume: number;
			sellVolume: number;
			buyers: number;
			sellers: number;
		};
	}>;
	ohlcv: Array<{
		timeframe: string;
		stats: {
			open: number;
			close: number;
		};
	}>;
}

export interface TradingStatsProps {
	stats: {
		buys: number;
		sells: number;
		buyVolume: number;
		sellVolume: number;
		buyers: number;
		sellers: number;
	};
}

export interface TradingMetricBarProps {
	label1: string;
	value1: string;
	label2: string;
	value2: string;
	ratio1: number;
	ratio2: number;
	color1: string;
	color2: string;
}

export interface TimeframeSelectorProps {
	timeframes: string[];
	selectedTimeframe: string;
	timeframeDiffs: { [key: string]: number };
	onSelect: (timeframe: string) => void;
}

export interface MarketTabProps {
	token: Token;
	timeframeDiffs: { [key: string]: number };
	selectedTimeframe: string;
	onTimeframeChange: (timeframe: string) => void;
}
