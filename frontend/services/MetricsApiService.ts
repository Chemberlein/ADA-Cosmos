// services/MetricsApiService.ts

import { IMetricsApi } from '@/interfaces/metrics/IMetricsApi';
import { BaseApiService } from '.';
import { RequestMetric, MarketStatsResponse } from '@/interfaces/metrics';

export class MetricsApiService extends BaseApiService implements IMetricsApi {
  /**
   * Get the number of requests made by day over the last 30d.
   * 
   * @returns {Promise<RequestMetric[]>} A promise that resolves to the request metrics.
   */
  async getRequestMetrics(): Promise<RequestMetric[]> {
    return this.request<RequestMetric[]>('/metrics');
  }

  /**
   * Get aggregated market stats, including 24h DEX volume and total active addresses.
   * 
   * @param quote {string} - Quote currency to use (e.g., ADA, USD, EUR, ETH, BTC). Optional; defaults to "ADA".
   * @returns {Promise<MarketStatsResponse>} A promise that resolves to the market stats response.
   */
  async getMarketStats(quote: string = 'ADA'): Promise<MarketStatsResponse> {
    return this.request<MarketStatsResponse>('/market/stats', {
      queryParams: { quote },
    });
  }
}
