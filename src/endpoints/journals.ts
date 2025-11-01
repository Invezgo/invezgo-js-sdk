import { HttpClient } from '../client';

export interface AddJournalTransactionDto {
  code: string;
  date: string;
  type: 'buy' | 'sell';
  price: number;
  volume: number;
  fee?: number;
  note?: string;
}

export interface NoteJournalTransactionDto {
  note?: string;
}

export class JournalsEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Extract journal from file
   * Note: This method may need special handling depending on your environment
   */
  async extractFromFile(file: File | Blob): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    // Note: When using FormData, don't set Content-Type header
    // Browser/Node will set it automatically with boundary
    const controller = new AbortController();
    const url = `${this.client.baseURL}/journals/file`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.client.apiKey}`,
      },
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to extract journal from file');
    }

    return response.json().catch(() => ({}));
  }

  /**
   * Add new journal transaction
   */
  async add(dto: AddJournalTransactionDto): Promise<any> {
    return this.client.post<any>('/journals', dto);
  }

  /**
   * List journal transactions
   */
  async list(): Promise<any[]> {
    return this.client.get<any[]>('/journals');
  }

  /**
   * Delete journal
   */
  async delete(params: { ids?: string[] }): Promise<any> {
    return this.client.delete<any>('/journals', params);
  }

  /**
   * Get journal transactions summary
   */
  async getSummary(): Promise<any> {
    return this.client.get<any>('/journals/summary');
  }

  /**
   * Update journal transaction note
   */
  async updateNote(id: string, dto: NoteJournalTransactionDto): Promise<any> {
    return this.client.patch<any>(`/journals/${id}`, dto);
  }
}

