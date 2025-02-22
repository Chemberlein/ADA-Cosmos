'use client';

import React from 'react';
import { SunMarketData, Token } from './data/getTokensData';
import TokensGraphClient from './TokensGraphClient';

interface FocusGraphProps {
  data: {
    tokens: Token[];
    sunMarketData: SunMarketData;
  };
}

const FocusGraph: React.FC<FocusGraphProps> = ({ data }) => {
  if (!data) return <div>Error: No data available</div>;

  return (
    <TokensGraphClient
      tokens={data.tokens}
      sunMarketData={data.sunMarketData}
    />
  );
};

export default FocusGraph;
