import { HttpClient } from '../client';
import type { ApiUsageResponse } from '../types';

export class UsageEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get API usage statistics for the configured API key.
   */
  async getApiUsage(): Promise<ApiUsageResponse> {
    return this.client.get<ApiUsageResponse>('/usage/api');
  }
}
