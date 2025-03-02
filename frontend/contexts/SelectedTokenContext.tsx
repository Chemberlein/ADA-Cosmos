// contexts/SelectedTokenContext.tsx - Updated version
"use client";

import { TokenDataNode } from "@/app/(app)/dashboard/components/TokensGraphClient";
import React, { createContext, useState, useContext } from "react";

interface SelectedTokenContextType {
  selectedToken: TokenDataNode | null;
  setSelectedToken: React.Dispatch<
    React.SetStateAction<TokenDataNode | null>
  >;
  walletAddress: string | null;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>;
  walletData: any | null; // We'll keep this as any for simplicity
  setWalletData: React.Dispatch<React.SetStateAction<any | null>>;
}

const SelectedTokenContext = createContext<
  SelectedTokenContextType | undefined
>(undefined);

export const SelectedTokenProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedToken, setSelectedToken] = useState<TokenDataNode | null>(
    null
  );
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<any | null>(null);

  const value = React.useMemo(
    () => ({
      selectedToken,
      setSelectedToken,
      walletAddress,
      setWalletAddress,
      walletData,
      setWalletData,
    }),
    [selectedToken, walletAddress, walletData]
  );

  return (
    <SelectedTokenContext.Provider value={value}>
      {children}
    </SelectedTokenContext.Provider>
  );
};

export const useSelectedToken = () => {
  const context = useContext(SelectedTokenContext);
  if (!context) {
    throw new Error(
      "useSelectedToken must be used within a SelectedTokenProvider"
    );
  }
  return context;
};
