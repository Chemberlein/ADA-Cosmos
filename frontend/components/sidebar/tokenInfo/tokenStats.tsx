"use client";
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSelectedToken } from "@/contexts/SelectedTokenContext";
import { TIMEFRAME_MAPPING } from "./types";
import TokenHeader from "./tabs/tokenHeader";
import DescriptionTab from "./tabs/descriptionTab";
import MarketTab from "./tabs/marketTab";
import SwapComponent from "./tabs/swapTab";
import WalletExplorer from "../walletExplorer/walletExplorer";
import { usePathname } from "next/navigation";

export default function TokenStats() {
  const { selectedToken } = useSelectedToken();
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const pathname = usePathname();

  // Check if wallet explorer is active (selectedToken is null and we're on dashboard)
  const isWalletExplorerActive =
    !selectedToken && pathname === "/dashboard";

  if (isWalletExplorerActive) {
    return <WalletExplorer />;
  }

  if (!selectedToken) {
    return (
      <div className="p-4 text-zinc-400">
        Click a token in the graph to see details.
      </div>
    );
  }

  // Calculate timeframe differences for display
  const timeframeDiffs = Object.keys(TIMEFRAME_MAPPING).reduce(
    (acc: { [key: string]: number }, tf: string) => {
      const mapKey =
        TIMEFRAME_MAPPING[tf as keyof typeof TIMEFRAME_MAPPING];
      const data = selectedToken.ohlcv.find(
        (item) => item.timeframe === mapKey
      );
      acc[tf] =
        data && data.stats.open !== 0
          ? ((data.stats.close - data.stats.open) / data.stats.open) * 100
          : 0;
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col w-full text-zinc-200">
      <TokenHeader token={selectedToken} />

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-around rounded-none border-b border-zinc-800 bg-transparent h-auto p-0">
          {["Description", "Market Stats", "Swap"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-zinc-400 hover:text-zinc-100 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="description">
          <DescriptionTab token={selectedToken} />
        </TabsContent>

        <TabsContent value="market stats">
          <MarketTab
            token={selectedToken}
            selectedTimeframe={selectedTimeframe}
            timeframeDiffs={timeframeDiffs}
            onTimeframeChange={setSelectedTimeframe}
          />
        </TabsContent>

        <TabsContent value="swap" className="p-4">
          <SwapComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
