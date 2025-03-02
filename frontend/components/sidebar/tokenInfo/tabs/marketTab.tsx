"use client";
import React from "react";
import { MarketTabProps, TIMEFRAMES, TimeframeSelectorProps, Token, TradingMetricBarProps, TradingStatsProps } from "../types";

const TimeframeSelector = ({
	timeframes,
	selectedTimeframe,
	timeframeDiffs,
	onSelect,
}: TimeframeSelectorProps) => (
	<div className="flex justify-between">
		{timeframes.map((tf) => (
			<div
				key={tf}
				onClick={() => onSelect(tf)}
				className={`flex-1 bg-zinc-900 rounded-lg p-2 text-center cursor-pointer ${
					tf === selectedTimeframe ? "border-2 border-amber-500" : ""
				}`}
			>
				<div className="text-sm text-zinc-400">{tf}</div>
				<div
					className={`text-sm font-medium ${
						timeframeDiffs[tf] >= 0
							? "text-green-500"
							: "text-red-500"
					}`}
				>
					{timeframeDiffs[tf].toFixed(2)} %
				</div>
			</div>
		))}
	</div>
);

const TradingMetricBar = ({
	label1,
	value1,
	label2,
	value2,
	ratio1,
	ratio2,
	color1,
	color2,
}: TradingMetricBarProps) => (
	<div className="space-y-2 border-b border-zinc-800 pb-4">
		<div className="flex items-center justify-between text-sm font-medium">
			<div className="flex flex-col items-start">
				<span className="text-zinc-400">{label1}</span>
			</div>
			<div className="flex flex-col items-end">
				<span className="text-zinc-400">{label2}</span>
			</div>
		</div>

		<div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden flex">
			<div
				className={`h-full ${color1}`}
				style={{
					width: `${ratio1 * 100}%`,
				}}
			/>
			<div
				className={`h-full ${color2}`}
				style={{
					width: `${ratio2 * 100}%`,
				}}
			/>
		</div>

		<div className="flex items-center justify-between text-sm font-medium">
			<div className="flex flex-col items-start">
				<span className={color1.replace("bg-", "text-")}>{value1}</span>
			</div>
			<div className="flex flex-col items-end">
				<span className={color2.replace("bg-", "text-")}>{value2}</span>
			</div>
		</div>
	</div>
);

const BasicStats = ({ token }: { token: Token }) => (
	<div className="space-y-2 pb-2">
		<div className="flex justify-between py-2 border-b border-zinc-800">
			<span className="text-zinc-400">Market Cap</span>
			<span className="text-zinc-100 font-medium">
				{token.mcap ? token.mcap.toLocaleString() : "N/A"} ₳
			</span>
		</div>
		<div className="flex justify-between py-2 border-b border-zinc-800">
			<span className="text-zinc-400">Holders</span>
			<span className="text-zinc-100 font-medium">
				{token.holders ? token.holders.toLocaleString() : "N/A"}
			</span>
		</div>
	</div>
);

const TradingStats = ({ stats }: TradingStatsProps) => {
	const buyRatio = stats.buys / (stats.buys + stats.sells);
	const sellRatio = stats.sells / (stats.buys + stats.sells);

	const buyVolumeRatio =
		stats.buyVolume / (stats.buyVolume + stats.sellVolume);
	const sellVolumeRatio =
		stats.sellVolume / (stats.buyVolume + stats.sellVolume);

	const buyersRatio = stats.buyers / (stats.buyers + stats.sellers);
	const sellersRatio = stats.sellers / (stats.buyers + stats.sellers);

	return (
		<div className="space-y-4">
			<TradingMetricBar
				label1="Buys"
				value1={stats.buys.toLocaleString()}
				label2="Sells"
				value2={stats.sells.toLocaleString()}
				ratio1={buyRatio}
				ratio2={sellRatio}
				color1="bg-green-500"
				color2="bg-red-500"
			/>

			<TradingMetricBar
				label1="Buy Volume"
				value1={`${stats.buyVolume.toLocaleString()} ₳`}
				label2="Sell Volume"
				value2={`${stats.sellVolume.toLocaleString()} ₳`}
				ratio1={buyVolumeRatio}
				ratio2={sellVolumeRatio}
				color1="bg-green-500"
				color2="bg-red-500"
			/>

			<TradingMetricBar
				label1="Buyers"
				value1={stats.buyers.toLocaleString()}
				label2="Sellers"
				value2={stats.sellers.toLocaleString()}
				ratio1={buyersRatio}
				ratio2={sellersRatio}
				color1="bg-green-500"
				color2="bg-red-500"
			/>
		</div>
	);
};

const MarketTab = ({
	token,
	selectedTimeframe,
	timeframeDiffs,
	onTimeframeChange,
}: MarketTabProps) => {
	const tradingStatsData = token.tradingStats.find(
		(stat) => stat.timeframe === selectedTimeframe
	);

	return (
		<div className="p-4 pt-0">
			<BasicStats token={token} />
			<div className="grid gap-2">
				<TimeframeSelector
					timeframes={TIMEFRAMES}
					selectedTimeframe={selectedTimeframe}
					timeframeDiffs={timeframeDiffs}
					onSelect={onTimeframeChange}
				/>

				{tradingStatsData ? (
					<TradingStats stats={tradingStatsData.stats} />
				) : (
					<div className="text-sm text-zinc-400">
						No trading stats available for this timeframe.
					</div>
				)}
			</div>
		</div>
	);
};

export default MarketTab;
