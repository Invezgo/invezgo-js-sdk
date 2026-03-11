import { HttpClient } from '../client';
import type { ScreenerCategory } from '../types';

export interface ScreenDto {
  formula: string;
  category: ScreenerCategory[];
}

export interface ScreenSaveDto {
  name: string;
  description?: string;
  scope?: string[];
  formula: string;
  category: ScreenerCategory[];
}

export interface ScreenUpdateDto {
  name: string;
  description?: string;
  scope?: string[];
  formula: string;
  category: ScreenerCategory[];
}

export class ScreenerEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of preset screeners.
   */
  async list(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/screener');
  }

  /**
   * Save preset screener.
   */
  async save(dto: ScreenSaveDto): Promise<unknown> {
    return this.client.post<unknown>('/screener', dto);
  }

  /**
   * Update preset screener.
   */
  async update(id: string, dto: ScreenUpdateDto): Promise<unknown> {
    return this.client.put<unknown>(`/screener/${id}`, dto);
  }

  /**
   * Delete preset screener.
   */
  async delete(id: string): Promise<unknown> {
    return this.client.delete<unknown>(`/screener/${id}`);
  }

  /**
   * Run screener.
   */
  async screen(dto: ScreenDto): Promise<unknown[]> {
    return this.client.post<unknown[]>('/screener/screen', dto);
  }
}
