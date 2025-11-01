import { HttpClient } from '../client';

export interface CreateWatchlistDto {
  code: string;
  group?: string;
}

export interface UpdateWatchlistDto {
  id: string;
  code?: string;
  group?: string;
}

export interface CreateGroupDto {
  name: string;
}

export interface UpdateNoteWatchlistDto {
  note?: string;
}

export class WatchlistsEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of watchlists
   */
  async list(group?: string): Promise<any[]> {
    return this.client.get<any[]>('/watchlists', { group: group || 'null' });
  }

  /**
   * Add stock to watchlist
   */
  async add(dto: CreateWatchlistDto): Promise<any> {
    return this.client.post<any>('/watchlists', dto);
  }

  /**
   * Delete watchlist
   */
  async delete(params: { ids?: string[] }): Promise<any> {
    return this.client.delete<any>('/watchlists', params);
  }

  /**
   * Get list of watchlist groups
   */
  async listGroups(): Promise<any[]> {
    return this.client.get<any[]>('/watchlists/group');
  }

  /**
   * Add new watchlist group
   */
  async addGroup(dto: CreateGroupDto): Promise<any> {
    return this.client.post<any>('/watchlists/group', dto);
  }

  /**
   * Update watchlist
   */
  async update(id: string, dto: UpdateWatchlistDto): Promise<any> {
    return this.client.put<any>(`/watchlists/${id}`, dto);
  }

  /**
   * Update watchlist note
   */
  async updateNote(id: string, dto: UpdateNoteWatchlistDto): Promise<any> {
    return this.client.patch<any>(`/watchlists/${id}`, dto);
  }
}

