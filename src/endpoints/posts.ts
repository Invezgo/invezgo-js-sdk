import { HttpClient } from '../client';

export class PostsEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get all posts
   */
  async getAll(): Promise<any[]> {
    return this.client.get<any[]>('/posts');
  }

  /**
   * Get posts by category
   */
  async getByCategory(category: string): Promise<any[]> {
    return this.client.get<any[]>(`/posts/category/${category}`);
  }

  /**
   * Get posts for a stock
   */
  async getStockPosts(code: string): Promise<any[]> {
    return this.client.get<any[]>(`/posts/space/${code}`);
  }

  /**
   * Get stock posts by category
   */
  async getStockCategoryPosts(code: string, category: string): Promise<any[]> {
    return this.client.get<any[]>(`/posts/space/category/${code}/${category}`);
  }

  /**
   * Get post details
   */
  async getPostById(id: string): Promise<any> {
    return this.client.get<any>(`/posts/detail/${id}`);
  }

  /**
   * Get post comments
   */
  async getComments(id: string): Promise<any[]> {
    return this.client.get<any[]>(`/posts/comment/${id}`);
  }

  /**
   * Get liked posts
   */
  async getLiked(): Promise<any[]> {
    return this.client.get<any[]>('/posts/like');
  }

  /**
   * Get favorite posts
   */
  async getFavorites(): Promise<any[]> {
    return this.client.get<any[]>('/posts/favorite');
  }

  /**
   * Get post voters
   */
  async getVoters(id: string): Promise<any[]> {
    return this.client.get<any[]>(`/posts/vote/${id}`);
  }
}

