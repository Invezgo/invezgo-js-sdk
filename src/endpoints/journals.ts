import { HttpClient, InvezgoError } from '../client';

export interface AddJournalTransactionDto {
  code: string;
  broker: string;
  date: string;
  lot: number;
  fee: number;
  price: number;
  status?: 'BUY' | 'SELL';
  scope: string[];
  note: string | null;
}

export interface NoteJournalTransactionDto {
  note?: string;
}

export class JournalsEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Extract journal transactions from uploaded file.
   */
  async extractFromFile(file: File | Blob): Promise<unknown> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.client.baseURL}/journals/file`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.client.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      throw new InvezgoError(
        response.status,
        data.message || 'Failed to extract journal from file',
        data.error,
        data
      );
    }

    return response.json().catch(() => ({}));
  }

  /**
   * Add new journal transaction.
   */
  async add(dto: AddJournalTransactionDto): Promise<unknown> {
    return this.client.post<unknown>('/journals', dto);
  }

  /**
   * List journal transactions.
   */
  async list(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/journals');
  }

  /**
   * Delete journal entries.
   *
   * The current OpenAPI spec does not describe delete filters,
   * but the SDK keeps optional query params for batch deletion support.
   */
  async delete(params?: { ids?: string[] }): Promise<unknown> {
    return this.client.delete<unknown>('/journals', params);
  }

  /**
   * Get journal transactions summary.
   */
  async getSummary(): Promise<unknown> {
    return this.client.get<unknown>('/journals/summary');
  }

  /**
   * Update journal transaction note.
   */
  async updateNote(id: string, dto: NoteJournalTransactionDto): Promise<unknown> {
    return this.client.patch<unknown>(`/journals/${id}`, dto);
  }
}
