import { RequestMetric, MarketStatsResponse } from ".";

export interface IMetricsApi {
	/**
	 * Get the number of requests made by day over the last 30d.
	 * GET /metrics
	 */
	getRequestMetrics(): Promise<RequestMetric[]>;

	/**
	 * Get aggregated market stats, including 24h DEX volume and total active addresses.
	 * GET /market/stats
	 */
	getMarketStats(quote?: string): Promise<MarketStatsResponse>;
}
