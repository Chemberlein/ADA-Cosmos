'use client';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useSelectedToken } from '@/contexts/SelectedTokenContext';

// Mock data structure
const tokenData = {
  image: '/placeholder.svg?height=48&width=48',
  name: 'INDY',
  type: 'Token',
  description: 'Token description here...',
  attributes: {
    marketCap: '32208006.34793786',
    liquidity: '32208006.34793786',
    volume24h: '32208006.34793786',
    timeChanges: {
      '1h': -0.26,
      '4h': -0.81,
      '24h': -2.33,
      '7d': -11.81,
      '30d': -17.86,
    },
    trading: {
      buys: 16,
      sells: 10,
      buyVolume: '22,352 Ⓐ',
      sellVolume: '29,961 Ⓐ',
      buyers: 11,
      sellers: 9,
    },
  },
  resources: [],
};

export default function TokenStats() {

  const { selectedToken } = useSelectedToken();

  if (!selectedToken) {
    return (
      <div className="p-4 text-zinc-400">
        Click a token in the graph to see details.
      </div>
    );
  }

  console.log(selectedToken);

  const timeframes = ['1h', '4h', '24h', '7d', '30d'];

  return (
    <div className="flex flex-col w-full text-zinc-200">
      <div className="flex items-start gap-4 p-4 border-b border-zinc-800">
        <img
          src={tokenData.image || '/placeholder.svg'}
          alt={selectedToken.ticker}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">{selectedToken.ticker}</h2>
          <p className="text-zinc-400">{tokenData.type}</p>
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-zinc-800 bg-transparent h-auto p-0">
          {['Description', 'Attributes', 'Links'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-zinc-400 hover:text-zinc-100 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="description" className="p-4">
          <p className="text-zinc-300 leading-relaxed">
            {selectedToken.socials.description}
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
          >
            SWAP
          </Button>
        </TabsContent>

        <TabsContent value="attributes" className="p-4">
          <div className="grid gap-2">
            {/* Basic Stats */}
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Market Cap</span>
                <span className="text-zinc-100 font-medium">
                  {selectedToken.mcap}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Liquidity</span>
                <span className="text-zinc-100 font-medium">
                  {tokenData.attributes.liquidity}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">24H Volume</span>
                <span className="text-zinc-100 font-medium">
                  {tokenData.attributes.volume24h}
                </span>
              </div>
            </div>

            {/* Time-based Changes */}
            <div className="flex justify-between gap-2">
              {timeframes.map((timeframe) => (
                <div
                  key={timeframe}
                  className="flex-1 bg-zinc-900 rounded-lg p-2 text-center"
                >
                  <div className="text-sm text-zinc-400">{timeframe}</div>
                  <div
                    className={`text-sm font-medium ${
                      tokenData.attributes.timeChanges[timeframe] >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {tokenData.attributes.timeChanges[timeframe]}%
                  </div>
                </div>
              ))}
            </div>

            {/* Trading Activity */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Buys</span>
                  <span className="text-zinc-400">Sells</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-500">
                    {tokenData.attributes.trading.buys}
                  </span>
                  <span className="text-red-500">
                    {tokenData.attributes.trading.sells}
                  </span>
                </div>
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-green-500"
                    style={{
                      width: `${
                        (tokenData.attributes.trading.buys /
                          (tokenData.attributes.trading.buys +
                            tokenData.attributes.trading.sells)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Buy Volume</span>
                  <span className="text-zinc-400">Sell Volume</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-500">
                    {tokenData.attributes.trading.buyVolume}
                  </span>
                  <span className="text-red-500">
                    {tokenData.attributes.trading.sellVolume}
                  </span>
                </div>
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-green-500"
                    style={{
                      width: `${
                        (Number.parseInt(
                          tokenData.attributes.trading.buyVolume
                        ) /
                          (Number.parseInt(
                            tokenData.attributes.trading.buyVolume
                          ) +
                            Number.parseInt(
                              tokenData.attributes.trading.sellVolume
                            ))) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Buyers</span>
                  <span className="text-zinc-400">Sellers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-500">
                    {tokenData.attributes.trading.buyers}
                  </span>
                  <span className="text-red-500">
                    {tokenData.attributes.trading.sellers}
                  </span>
                </div>
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-green-500"
                    style={{
                      width: `${
                        (tokenData.attributes.trading.buyers /
                          (tokenData.attributes.trading.buyers +
                            tokenData.attributes.trading.sellers)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
            >
              SWAP
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="links" className="p-4">
          <div className="space-y-2">
            {tokenData.resources.map((resource: any) => (
              <div
                key={resource.name}
                className="flex items-center gap-3 p-2 bg-zinc-900 rounded-lg"
              >
                <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">🌍</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-100">{resource.name}</span>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-4 bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
          >
            SWAP
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
