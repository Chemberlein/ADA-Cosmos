'use client';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useSelectedToken } from '@/contexts/SelectedTokenContext';
import { SocialIcon } from 'react-social-icons';

export default function TokenStats() {
  const { selectedToken } = useSelectedToken();
  // Trading stats for the selected timeframe
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    '1h' | '4h' | '24h' | '7d' | '30d'
  >('24h');

  if (!selectedToken) {
    return (
      <div className="p-4 text-zinc-400">
        Click a token in the graph to see details.
      </div>
    );
  }

  // Define the timeframes for display and mapping (for OHLCV lookup)
  const timeframes: Array<'1h' | '4h' | '24h' | '7d' | '30d'> = [
    '1h',
    '4h',
    '24h',
    '7d',
    '30d',
  ];
  const timeframeMapping: Record<
    '1h' | '4h' | '24h' | '7d' | '30d',
    '1h' | '4h' | '1d' | '1w' | '1M'
  > = {
    '1h': '1h',
    '4h': '4h',
    '24h': '1d',
    '7d': '1w',
    '30d': '1M',
  };

  // Compute the OHLCV percentage change for each timeframe
  const timeframeDiffs = timeframes.reduce((acc, tf) => {
    const mapKey = timeframeMapping[tf];
    const data = selectedToken.ohlcv.find((item) => item.timeframe === mapKey);
    acc[tf] =
      data && data.stats.open !== 0
        ? ((data.stats.close - data.stats.open) / data.stats.open) * 100
        : 0;
    return acc;
  }, {} as Record<string, number>);

  const tradingStatsData = selectedToken.tradingStats.find(
    (stat) => stat.timeframe === selectedTimeframe
  );

  return (
    <div className="flex flex-col w-full text-zinc-200">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-zinc-800 p-3 pt-1">
        <img
          src={'/placeholder.svg'}
          alt={selectedToken.ticker}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">{selectedToken.ticker}</h2>
          <p className="text-zinc-400">{'Token'}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-around rounded-none border-b border-zinc-800 bg-transparent h-auto p-0">
          {['Description', 'Market', 'Swap'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-zinc-400 hover:text-zinc-100 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="p-2">
          <p className="text-zinc-300 leading-relaxed mt-4">
            {selectedToken.socials.description || 'No description available.'}
          </p>
          <div className="space-y-2">
            {Object.entries(selectedToken.socials)
              .filter(([key, value]) => key !== 'description' && value)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-2 bg-zinc-900 rounded-lg"
                >
                  {/* Replace the custom icon with SocialIcon */}
                  <SocialIcon
                    url={value || undefined}
                    style={{ height: '48px', width: '48px' }}
                    bgColor="#18181b" // you can customize colors as needed
                  />
                  <div className="flex flex-col">
                    <a
                      href={value ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:underline"
                    >
                      <span className="text-zinc-100 capitalize">{key}</span>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market" className="p-4 pt-0">
          {/* Basic Stats */}
          <div className="space-y-2 pb-2">
            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Market Cap</span>
              <span className="text-zinc-100 font-medium">
                {selectedToken.mcap
                  ? selectedToken.mcap.toLocaleString()
                  : 'N/A'}{' '}
                ₳
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-800">
              <span className="text-zinc-400">Holders</span>
              <span className="text-zinc-100 font-medium">
                {selectedToken.holders
                  ? selectedToken.holders.toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            {/* Timeframe Buttons (styled like old component) */}
            <div className="flex justify-between">
              {timeframes.map((tf) => (
                <div
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`flex-1 bg-zinc-900 rounded-lg p-2 text-center cursor-pointer ${
                    tf === selectedTimeframe ? 'border-2 border-amber-500' : ''
                  }`}
                >
                  <div className="text-sm text-zinc-400">{tf}</div>
                  <div
                    className={`text-sm font-medium ${
                      timeframeDiffs[tf] >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {timeframeDiffs[tf].toFixed(2)} %
                  </div>
                </div>
              ))}
            </div>

            {tradingStatsData ? (
              <div className="space-y-4">
                {/* Buys vs Sells */}
                <div className="space-y-2 border-y border-zinc-800 py-4">
                  {/* Single row for labels & values */}
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex flex-col items-start">
                      <span className="text-zinc-400">Buys</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-zinc-400">Sells</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${
                          (tradingStatsData.stats.buys /
                            (tradingStatsData.stats.buys +
                              tradingStatsData.stats.sells)) *
                          100
                        }%`,
                      }}
                    />
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${
                          (tradingStatsData.stats.sells /
                            (tradingStatsData.stats.buys +
                              tradingStatsData.stats.sells)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex flex-col items-start">
                      <span className="text-green-500">
                        {tradingStatsData.stats.buys.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-red-500">
                        {tradingStatsData.stats.sells.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buy Volume vs Sell Volume */}
                <div className="space-y-2 border-b border-zinc-800 pb-4">
                  {/* Single row for labels & values */}
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex flex-col items-start">
                      <span className="text-zinc-400">Buy Volume</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-zinc-400">Sell Volume</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${
                          (tradingStatsData.stats.buyVolume /
                            (tradingStatsData.stats.buyVolume +
                              tradingStatsData.stats.sellVolume)) *
                          100
                        }%`,
                      }}
                    />
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${
                          (tradingStatsData.stats.sellVolume /
                            (tradingStatsData.stats.buyVolume +
                              tradingStatsData.stats.sellVolume)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex flex-col items-start">
                      <span className="text-green-500">
                        {tradingStatsData.stats.buyVolume.toLocaleString()} ₳
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-red-500">
                        {tradingStatsData.stats.sellVolume.toLocaleString()} ₳
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buyers vs Sellers */}
                <div className="space-y-2 border-b border-zinc-800 pb-4">
                  {/* Single row for labels & values */}
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex flex-col items-start">
                      <span className="text-zinc-400">Buyers</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-zinc-400">Sellers</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${
                          (tradingStatsData.stats.buyers /
                            (tradingStatsData.stats.buyers +
                              tradingStatsData.stats.sellers)) *
                          100
                        }%`,
                      }}
                    />
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${
                          (tradingStatsData.stats.sellers /
                            (tradingStatsData.stats.buyers +
                              tradingStatsData.stats.sellers)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex flex-col items-start">
                      <span className="text-green-500">
                        {tradingStatsData.stats.buyers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-red-500">
                        {tradingStatsData.stats.sellers.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-zinc-400">
                No trading stats available for this timeframe.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="swap" className="p-4"></TabsContent>
      </Tabs>
    </div>
  );
}
