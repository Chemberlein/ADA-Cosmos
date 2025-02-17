'use client';

import React, { useEffect, useState } from 'react';
import { IntegrationApiService } from '@/services/IntegrationApiService';
import { Asset } from '@/interfaces/integration';

const TokenById = () => {
	const [tokenById, setTokenById] = useState<Asset>();
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const fetchTokenById = async () => {
			const apiService = new IntegrationApiService();
			try {
        const data = await apiService.getAssetById(
			"279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f534e454b"
		);
				setTokenById(data.asset);
			} catch (err: any) {
				setError(err.message);
			}
		};

		fetchTokenById();
	}, []);

	if (error) return <div>Error: {error}</div>;
	if (tokenById === null) return <div>Loading...</div>;

	return (
		<div>
      <h1>Token By Id</h1>
      <p>Name: {tokenById?.name}</p>
      <p>Symbol: {tokenById?.symbol}</p>
      <p>Total Supply: {tokenById?.totalSupply}</p>
      <p>Circulating Supply: {tokenById?.circulatingSupply}</p>
		</div>
	);
};

export default TokenById;
