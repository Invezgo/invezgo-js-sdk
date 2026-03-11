import { HttpClient } from '../client';

export interface CreateWatchlistDto {
  group: string;
  code: string;
  price: number;
  note?: string;
  scope: string[];
}

export interface UpdateWatchlistDto {
  group: string;
  price: number;
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
   * Get list of watchlists.
   */
  async list(group = 'null'): Promise<unknown[]> {
    return this.client.get<unknown[]>('/watchlists', { group });
  }

  /**
   * Add stock to watchlist.
   */
  async add(dto: CreateWatchlistDto): Promise<unknown> {
    return this.client.post<unknown>('/watchlists', dto);
  }

  /**
   * Delete watchlist entries.
   *
   * The current OpenAPI spec does not describe delete filters,
   * but the SDK keeps optional query params for batch deletion support.
   */
  async delete(params?: { ids?: string[] }): Promise<unknown> {
    return this.client.delete<unknown>('/watchlists', params);
  }

  /**
   * Get list of watchlist groups.
   */
  async listGroups(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/watchlists/group');
  }

  /**
   * Add new watchlist group.
   */
  async addGroup(dto: CreateGroupDto): Promise<unknown> {
    return this.client.post<unknown>('/watchlists/group', dto);
  }

  /**
   * Update watchlist group.
   */
  async updateGroup(id: string, dto: CreateGroupDto): Promise<unknown> {
    return this.client.put<unknown>(`/watchlists/group/${id}`, dto);
  }

  /**
   * Delete watchlist group.
   */
  async deleteGroup(id: string): Promise<unknown> {
    return this.client.delete<unknown>(`/watchlists/group/${id}`);
  }

  /**
   * Update watchlist.
   */
  async update(id: string, dto: UpdateWatchlistDto): Promise<unknown> {
    return this.client.put<unknown>(`/watchlists/${id}`, dto);
  }

  /**
   * Update watchlist note.
   */
  async updateNote(id: string, dto: UpdateNoteWatchlistDto): Promise<unknown> {
    return this.client.patch<unknown>(`/watchlists/${id}`, dto);
  }
}
