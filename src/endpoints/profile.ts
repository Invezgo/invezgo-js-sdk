import { HttpClient } from '../client';

export class ProfileEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get user profile details
   */
  async getUserDetails(username: string): Promise<any> {
    return this.client.get<any>(`/profile/detail/${username}`);
  }

  /**
   * Get user posts
   */
  async getUserPosts(username: string, page: string, limit: string): Promise<any> {
    return this.client.get<any>(`/profile/posts/${username}`, { page, limit });
  }

  /**
   * Get user posts by category
   */
  async getCategoryPosts(
    username: string,
    category: string,
    page: string,
    limit: string
  ): Promise<any> {
    return this.client.get<any>(`/profile/posts/${username}/${category}`, { page, limit });
  }

  /**
   * Get user watchlist
   */
  async getUserWatchlist(username: string): Promise<any> {
    return this.client.get<any>(`/profile/watchlist/${username}`);
  }

  /**
   * Get user followers
   */
  async getFollowers(username: string): Promise<any> {
    return this.client.get<any>(`/profile/follow/${username}`);
  }

  /**
   * Get users being followed
   */
  async getFollowing(username: string): Promise<any> {
    return this.client.get<any>(`/profile/following/${username}`);
  }

  /**
   * Get user memberships
   */
  async getMemberships(username: string): Promise<any> {
    return this.client.get<any>(`/profile/membership/${username}`);
  }
}

