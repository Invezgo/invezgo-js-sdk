import { HttpClient } from '../client';

export class HealthEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Check API status
   */
  async check(): Promise<{ status: string }> {
    return this.client.get<{ status: string }>('/health');
  }

  /**
   * Check database status
   */
  async checkDatabase(): Promise<{ status: string }> {
    return this.client.get<{ status: string }>('/health/database');
  }

  /**
   * Full health check (API and database)
   */
  async fullCheck(): Promise<{ status: string }> {
    return this.client.get<{ status: string }>('/health/full');
  }
}

