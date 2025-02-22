// app/integration/page.tsx (a server component)
import { IntegrationApiService } from "@/services/IntegrationApiService";
import { cacheCall } from "@/services/serverCache";

export default async function IntegrationPage() {
	// Wrap the API call in the cacheCall function.
	const { block } = await cacheCall(
		"integration:getLatestBlock", // Unique cache key for this API call
		async () => {
			const integrationApi = new IntegrationApiService();
			return integrationApi.getLatestBlock();
		},
		3600 * 1000 // Cache TTL of 1 hour
	);

	return (
		<div>
			<h1>Latest Block</h1>
			<p>Block Number: {block.blockNumber}</p>
			<p>Timestamp: {block.blockTimestamp}</p>
		</div>
	);
}
