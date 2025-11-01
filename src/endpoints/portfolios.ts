import { HttpClient } from '../client';

export class PortfoliosEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of portfolios
   */
  async list(): Promise<any[]> {
    return this.client.get<any[]>('/portfolios');
  }

  /**
   * Get portfolio summary
   */
  async getSummary(): Promise<any> {
    return this.client.get<any>('/portfolios/summary');
  }
}

