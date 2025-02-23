"use client";

import { TokenWithSocials } from '@/app/dashboard/components/data/getTokensData';
import React, { createContext, useState, useContext } from 'react';

interface SelectedTokenContextType {
  selectedToken: TokenWithSocials | null;
  setSelectedToken: React.Dispatch<
    React.SetStateAction<TokenWithSocials | null>
  >;
}

const SelectedTokenContext = createContext<
  SelectedTokenContextType | undefined
>(undefined);

export const SelectedTokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedToken, setSelectedToken] = useState<TokenWithSocials | null>(
    null
  );
  return (
    <SelectedTokenContext.Provider value={{ selectedToken, setSelectedToken }}>
      {children}
    </SelectedTokenContext.Provider>
  );
};

export const useSelectedToken = () => {
  const context = useContext(SelectedTokenContext);
  if (!context) {
    throw new Error(
      'useSelectedToken must be used within a SelectedTokenProvider'
    );
  }
  return context;
};
