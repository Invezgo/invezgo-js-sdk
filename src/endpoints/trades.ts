import { HttpClient } from '../client';

export interface NoteTradeDto {
  note?: string;
}

export class TradesEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of realized trades
   */
  async list(): Promise<any[]> {
    return this.client.get<any[]>('/trades');
  }

  /**
   * Delete trades
   */
  async delete(params: { ids?: string[] }): Promise<any> {
    return this.client.delete<any>('/trades', params);
  }

  /**
   * Get trades summary
   */
  async getSummary(): Promise<any> {
    return this.client.get<any>('/trades/summary');
  }

  /**
   * Get trades summary chart
   */
  async getSummaryChart(): Promise<any> {
    return this.client.get<any>('/trades/summary-chart');
  }

  /**
   * Update trade note
   */
  async updateNote(id: string, dto: NoteTradeDto): Promise<any> {
    return this.client.patch<any>(`/trades/${id}`, dto);
  }
}

