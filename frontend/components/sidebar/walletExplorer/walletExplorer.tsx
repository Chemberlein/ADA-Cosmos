"use client";
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TIMEFRAMES } from "../tokenInfo/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PortfolioPositionsResponse } from "@/interfaces/wallet";

const WalletHeader = ({
  address,
  data,
}: {
  address: string;
  data: PortfolioPositionsResponse | null;
}) => (
  <div className="flex flex-col gap-2 border-b border-zinc-800 p-3 pt-1">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-zinc-100">
        Wallet Explorer
      </h2>
    </div>
    {address && (
      <div className="bg-zinc-900 p-2 rounded-md">
        <p className="text-xs text-zinc-400 truncate">{address}</p>
      </div>
    )}
    {data && (
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="bg-zinc-800/50 p-2 rounded-lg">
          <p className="text-xs text-zinc-400">Portfolio Value</p>
          <p className="text-sm font-medium text-zinc-100">
            {data.liquidValue.toLocaleString()} ₳
          </p>
        </div>
        <div className="bg-zinc-800/50 p-2 rounded-lg">
          <p className="text-xs text-zinc-400">ADA Balance</p>
          <p className="text-sm font-medium text-zinc-100">
            {data.adaBalance.toLocaleString()} ₳
          </p>
        </div>
      </div>
    )}
  </div>
);

const AssetsTab = ({
  data,
}: {
  data: PortfolioPositionsResponse | null;
}) => {
  if (!data)
    return (
      <div className="p-4 text-zinc-400">No wallet data available.</div>
    );

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">
        Fungible Tokens ({data.numFTs})
      </h3>

      <div className="space-y-3">
        {data.positionsFt.map((token) => (
          <div key={token.unit} className="bg-zinc-800/50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-zinc-200">
                {token.ticker}
              </span>
              <span className="text-sm text-zinc-300">
                {token.balance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-zinc-400">Value</span>
              <span className="text-xs font-medium text-zinc-300">
                {token.adaValue.toLocaleString()} ₳
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {["24h", "7d", "30d"].map((period) => (
                <div
                  key={period}
                  className={`text-center p-1 rounded text-xs ${
                    Number(token[period as keyof typeof token]) >= 0
                      ? "bg-green-900/20 text-green-400"
                      : "bg-red-900/20 text-red-400"
                  }`}
                >
                  {period}:{" "}
                  {Number(token[period as keyof typeof token]).toFixed(2)}%
                </div>
              ))}
            </div>
          </div>
        ))}

        {data.positionsFt.length === 0 && (
          <div className="text-center py-4 text-zinc-500">
            No tokens in this wallet.
          </div>
        )}
      </div>
    </div>
  );
};

const LiquidityTab = ({
  data,
}: {
  data: PortfolioPositionsResponse | null;
}) => {
  if (!data)
    return (
      <div className="p-4 text-zinc-400">No wallet data available.</div>
    );

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">
        Liquidity Positions
      </h3>

      <div className="space-y-3">
        {data.positionsLp.map((lp) => (
          <div key={lp.unit} className="bg-zinc-800/50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-zinc-200">
                {lp.ticker}
              </span>
              <span className="text-xs px-2 py-1 bg-zinc-700 rounded-full text-zinc-300">
                {lp.exchange}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-zinc-400">Amount</span>
              <span className="text-xs font-medium text-zinc-300">
                {lp.amountLP.toLocaleString()} LP
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-zinc-400">Value</span>
              <span className="text-xs font-medium text-zinc-300">
                {lp.adaValue.toLocaleString()} ₳
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              <div className="bg-zinc-700/50 p-2 rounded text-xs">
                <div className="text-zinc-400">{lp.tokenAName}</div>
                <div className="font-medium text-zinc-300">
                  {lp.tokenAAmount.toLocaleString()}
                </div>
              </div>
              <div className="bg-zinc-700/50 p-2 rounded text-xs">
                <div className="text-zinc-400">{lp.tokenBName}</div>
                <div className="font-medium text-zinc-300">
                  {lp.tokenBAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.positionsLp.length === 0 && (
          <div className="text-center py-4 text-zinc-500">
            No liquidity positions in this wallet.
          </div>
        )}
      </div>
    </div>
  );
};

const NFTsTab = ({
  data,
}: {
  data: PortfolioPositionsResponse | null;
}) => {
  if (!data)
    return (
      <div className="p-4 text-zinc-400">No wallet data available.</div>
    );

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">
        NFT Collections ({data.numNFTs})
      </h3>

      <div className="space-y-3">
        {data.positionsNft.map((nft) => (
          <div key={nft.policy} className="bg-zinc-800/50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-zinc-200">{nft.name}</span>
              <span className="text-sm text-zinc-300">
                {nft.balance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-zinc-400">Floor Price</span>
              <span className="text-xs font-medium text-zinc-300">
                {nft.floorPrice.toLocaleString()} ₳
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-zinc-400">Value</span>
              <span className="text-xs font-medium text-zinc-300">
                {nft.adaValue.toLocaleString()} ₳
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {["24h", "7d", "30d"].map((period) => (
                <div
                  key={period}
                  className={`text-center p-1 rounded text-xs ${
                    Number(nft[period as keyof typeof nft]) >= 0
                      ? "bg-green-900/20 text-green-400"
                      : "bg-red-900/20 text-red-400"
                  }`}
                >
                  {period}:{" "}
                  {Number(nft[period as keyof typeof nft]).toFixed(2)}%
                </div>
              ))}
            </div>
          </div>
        ))}

        {data.positionsNft.length === 0 && (
          <div className="text-center py-4 text-zinc-500">
            No NFTs in this wallet.
          </div>
        )}
      </div>
    </div>
  );
};

const SearchBar = ({
  onSearch,
}: {
  onSearch: (address: string) => void;
}) => {
  const [address, setAddress] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="p-4 pb-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-zinc-200"
        />
        <Button
          type="submit"
          size="sm"
          variant="outline"
          className="bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default function WalletExplorer() {
  const [walletData, setWalletData] =
    useState<PortfolioPositionsResponse | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");

  // In real implementation, this would fetch data from your API
  const handleSearch = (address: string) => {
    setWalletAddress(address);

    // Mock data for demonstration
    const mockData: PortfolioPositionsResponse = {
      adaBalance: 10,
      adaValue: 10010,
      liquidValue: 10010,
      numFTs: 2,
      numNFTs: 1,
      positionsFt: [
        {
          "24h": 0.11,
          "30d": -0.32,
          "7d": 0.03,
          adaValue: 10000,
          balance: 200,
          fingerprint: "fingerprint1",
          liquidBalance: 200,
          liquidValue: 10000,
          price: 100,
          ticker: "TEST1",
          unit: "b46b12f0a61721a0358988f806a7c1562e1e622d5886a73194051f336d6131",
        },
      ],
      positionsLp: [
        {
          adaValue: 400,
          amountLP: 100,
          exchange: "Minswap",
          ticker: "TEST2 / ADA LP",
          tokenA:
            "63bb8054f9142b46582198e280f489b3c928dfecb390b0cb39a5cbfe74657374746f6b656e32",
          tokenAAmount: 100,
          tokenAName: "TEST2",
          tokenB: "string",
          tokenBAmount: 200,
          tokenBName: "ADA",
          unit: "f22d56bc0daec9ff1e2d4d90061563517d279d3c998747d55234822874657374746f6b656e",
        },
      ],
      positionsNft: [
        {
          "24h": 0.11,
          "30d": -0.32,
          "7d": 0.03,
          adaValue: 10000,
          balance: 2,
          floorPrice: 1,
          liquidValue: 10,
          listings: 3,
          name: "testCollection",
          policy:
            "4048d53202b57aec6eb8edd8e9e4196d8eeb9a5fe1dd50d6dfc67be3",
        },
      ],
    };

    setWalletData(mockData);
  };

  return (
    <div className="flex flex-col w-full text-zinc-200">
      <SearchBar onSearch={handleSearch} />
      <WalletHeader address={walletAddress} data={walletData} />

      {!walletData && !walletAddress && (
        <div className="p-4 text-zinc-400 text-center">
          Enter a wallet address to view details.
        </div>
      )}

      {walletAddress && (
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="w-full justify-around rounded-none border-b border-zinc-800 bg-transparent h-auto p-0">
            {["Assets", "Liquidity", "NFTs"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-zinc-400 hover:text-zinc-100 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-zinc-100"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="assets">
            <AssetsTab data={walletData} />
          </TabsContent>

          <TabsContent value="liquidity">
            <LiquidityTab data={walletData} />
          </TabsContent>

          <TabsContent value="nfts">
            <NFTsTab data={walletData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
