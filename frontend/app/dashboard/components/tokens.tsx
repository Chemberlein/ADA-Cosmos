'use client';

import React, { useEffect, useState } from 'react';
import { TopTokenHolder } from '@/interfaces/tokens/tokenHolders';
import { MarketTokensApiService } from '@/services/MarketTokensApiService';

const TokensPage = () => {
  const [topHolders, setTopHolders] = useState<TopTokenHolder[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTopTokenHolders = async () => {
      const apiService = new MarketTokensApiService();
      try {
        const data = await apiService.getTopTokenHolders(
          '5d16cc1a177b5d9ba9cfa9793b07e60f1fb70fea1f8aef064415d114494147'
        );
        setTopHolders(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTopTokenHolders();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (topHolders.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h1>Top Token Holders</h1>
      <ul>
        {topHolders.map((holder) => (
          <li key={holder.address}>
            {holder.address}: {holder.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokensPage;
