'use client';

import React from 'react';
import { SunMarketData, TokenData } from './data/getTokensData';
import TokensGraphClient from './TokensGraphClient';

interface FocusGraphProps {
	data: {
		tokens: TokenData[];
		sunMarketData: SunMarketData;
	};
}

const FocusGraph: React.FC<FocusGraphProps> = ({ data }) => {
  if (!data) return <div>Error: No data available</div>;

  return (
    <div className="h-[100vh] w-full">
      <TokensGraphClient
        tokens={data.tokens}
        sunMarketData={data.sunMarketData}
      />
    </div>
  );
};

export default FocusGraph;
