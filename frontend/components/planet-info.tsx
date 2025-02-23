// components/planet-info.tsx
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

export function PlanetInfo() {
  const { selectedToken } = useSelectedToken();

  if (!selectedToken) {
    return (
      <div className="p-4 text-zinc-400">
        Click a token in the graph to see details.
      </div>
    );
  }

  console.log(selectedToken);

  // Build token-specific info. You can customize these fields as needed.
  const tokenData = {
    name: selectedToken.ticker,
    type: 'Token',
    image: '/snek.png',
    description: selectedToken.socials.description,
    attributes: {
      'Market Cap': selectedToken.mcap,
      // You can add more attributes if available
    },
    resources: Object.entries(selectedToken.socials)
      .filter(([key, value]) => key !== 'description' && !!value)
      .map(([key, value]) => ({ name: key, url: value })),
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col w-full text-zinc-200">
        <div className="flex items-start gap-4 p-4 border-b border-zinc-800">
          <img
            src={tokenData.image}
            alt={tokenData.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{tokenData.name}</h2>
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
              {tokenData.description}
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
              {Object.entries(tokenData.attributes).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-zinc-800"
                >
                  <span className="text-zinc-400 capitalize">{key}</span>
                  <span className="text-zinc-100 font-medium">{value}</span>
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

          <TabsContent value="links" className="p-4">
            <div className="space-y-2">
              {tokenData.resources.map((resource) => (
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
    </TooltipProvider>
  );
}

export default PlanetInfo;
