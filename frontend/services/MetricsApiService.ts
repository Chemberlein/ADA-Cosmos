// services/MetricsApiService.ts

import { IMetricsApi } from "@/interfaces/metrics/IMetricsApi";
import { BaseApiService } from ".";
import { RequestMetric, MarketStatsResponse } from "@/interfaces/metrics";

export class MetricsApiService extends BaseApiService implements IMetricsApi {
	/**
	 * Get the number of requests made by day over the last 30d.
	 * GET /metrics
	 */
	async getRequestMetrics(): Promise<RequestMetric[]> {
		return this.request<RequestMetric[]>("/metrics");
	}

	/**
	 * Get aggregated market stats, including 24h DEX volume and total active addresses.
	 * GET /market/stats
	 */
	async getMarketStats(quote: string = "ADA"): Promise<MarketStatsResponse> {
		return this.request<MarketStatsResponse>("/market/stats", {
			queryParams: { quote },
		});
	}
}
