"use client";
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TIMEFRAMES } from "../tokenInfo/types";
import { Search, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PortfolioPositionsResponse } from "@/interfaces/wallet";
import { useApi } from "@/hooks/useApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WalletApiService } from "@/services/WalletApiService";

const walletApiService = new WalletApiService();

const WalletHeader = ({
  address,
  data,
}: {
  address: string;
  data: PortfolioPositionsResponse | null;
}) => {
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    if (addr.length <= 15) return addr;

    const start = addr.substring(0, 25);
    const end = addr.substring(addr.length - 10);
    return `${start}.......${end}`;
  };

  return (
    <div className="flex flex-col gap-2 border-b border-zinc-800 p-3 pt-1">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">
          Wallet Explorer
        </h2>
      </div>
      {address && (
        <div className="bg-zinc-900 p-2 rounded-md">
          <p className="text-md text-zinc-400 text-center">
            {formatAddress(address)}
          </p>
        </div>
      )}
      {data && (
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-zinc-800/50 p-2 rounded-lg">
            <p className="text-xs text-zinc-400">Portfolio Value</p>
            <p className="text-sm font-medium text-zinc-100">
              {data?.liquidValue?.toLocaleString()} ₳
            </p>
          </div>
          <div className="bg-zinc-800/50 p-2 rounded-lg">
            <p className="text-xs text-zinc-400">ADA Balance</p>
            <p className="text-sm font-medium text-zinc-100">
              {data?.adaBalance?.toLocaleString()} ₳
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

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

      <div className="grid grid-cols-2 gap-3">
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
                  className={`text-center p-1 rounded text-[0.6rem] ${
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
          <div className="text-center py-4 text-zinc-500 col-span-2">
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
  isLoading,
}: {
  onSearch: (address: string) => void;
  isLoading: boolean;
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
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="sm"
          variant="outline"
          className="bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default function WalletExplorer() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [searchTrigger, setSearchTrigger] = useState<number>(0);

  // Using the useApi hook to fetch data when the address changes or search is triggered
  const {
    data: walletData,
    loading,
    error,
  } = useApi<PortfolioPositionsResponse>(
    () => walletApiService.getPortfolioPositions(walletAddress),
    [walletAddress, searchTrigger]
  );

  const handleSearch = (address: string) => {
    setWalletAddress(address);
    // Increment the search trigger to force a refetch
    setSearchTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col w-full text-zinc-200">
      <SearchBar onSearch={handleSearch} isLoading={loading} />
      <WalletHeader address={walletAddress} data={walletData} />

      {!walletData && !walletAddress && !loading && !error && (
        <div className="p-4 text-zinc-400 text-center">
          Enter a wallet address to view details.
        </div>
      )}

      {loading && (
        <div className="p-4 flex justify-center items-center">
          <Loader className="h-6 w-6 text-amber-500 animate-spin" />
        </div>
      )}

      {error && walletAddress && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {walletAddress && !loading && !error && (
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
