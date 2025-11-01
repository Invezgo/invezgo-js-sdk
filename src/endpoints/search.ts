import { HttpClient } from '../client';

export class SearchEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Search for stocks or users
   */
  async search(query: string): Promise<any> {
    return this.client.get<any>('/search', { query });
  }

  /**
   * Search for stocks
   */
  async searchStock(query: string, cursor: string): Promise<any> {
    return this.client.get<any>('/search/stock', { query, cursor });
  }

  /**
   * Search for users
   */
  async searchUser(query: string, cursor: string): Promise<any> {
    return this.client.get<any>('/search/user', { query, cursor });
  }
}

