import React from "react";
import ForceGraph3D from "react-force-graph-3d";
import { MarketTokensApiService } from "@/services/MarketTokensApiService";
import { useApi } from "@/hooks/useApi";

const MAX_NODE_SIZE = 50; // Maximum node size for scaling

const renderNodeLabel = (node: any) => {
	return `
    <table class="border-collapse text-center">
      <tr>
        <td colspan="2" class="p-2 font-bold border border-gray-300">
          ${node.name}
        </td>
      </tr>
      <tr>
        <td class="p-2 border border-gray-300">Mcap</td>
        <td class="p-2 border border-gray-300">${node.marketCap.toLocaleString()} ₳</td>
      </tr>
    </table>
  `;
};

const CardanoTokensGraph = () => {
	const marketTokensApi = new MarketTokensApiService();
	const {
		data: tokens,
		loading,
		error,
	} = useApi(() => marketTokensApi.getTopMarketCapTokens("mcap", 1, 10), []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!tokens) return <div>No data available</div>;

	// Calculate maximum market cap for scaling
	const maxMcap = Math.max(...tokens.map((token) => token.mcap));

	// Map tokens to nodes
	const nodes = tokens.map((token) => ({
		id: token.unit,
		name: token.ticker,
		val: (token.mcap / maxMcap) * MAX_NODE_SIZE,
		marketCap: token.mcap,
	}));

	// Example: Link each token to the next one
	const links = tokens.slice(1).map((token, i) => ({
		source: tokens[i].unit,
		target: token.unit,
	}));

	const graphData = { nodes, links };

	return (
		<div className="overflow-hidden">
			<ForceGraph3D
				width={1300}
				height={950}
				backgroundColor="#080808"
				graphData={graphData}
				nodeLabel={renderNodeLabel}
				nodeAutoColorBy="name"
				linkDirectionalParticles={8}
				linkWidth={8}
				linkDirectionalParticleSpeed={0.008}
			/>
		</div>
	);
};

export default CardanoTokensGraph;
