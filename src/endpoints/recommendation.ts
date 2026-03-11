import { HttpClient } from '../client';

export class RecommendationEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get user recommendations.
   */
  async getUserRecommendations(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/recommendation/user');
  }
}
