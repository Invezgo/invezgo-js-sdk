import { HttpClient } from '../client';
import type { AlertIntervalType, AlertSendType, ScreenerCategory } from '../types';

export interface AlertDto {
  name: string;
  description?: string;
  category: ScreenerCategory[];
  every: AlertIntervalType;
  send: AlertSendType;
  scope?: string[];
  formula: string;
}

export interface AlertTestDto {
  formula: string;
  category: ScreenerCategory[];
}

export interface UpdateAlertDto {
  name: string;
  description?: string;
  category: ScreenerCategory[];
  every: AlertIntervalType;
  send: AlertSendType;
  formula: string;
  scope?: string[];
}

export class AlertsEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of alerts.
   */
  async list(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/alerts');
  }

  /**
   * Create alert.
   */
  async add(dto: AlertDto): Promise<unknown> {
    return this.client.post<unknown>('/alerts', dto);
  }

  /**
   * Update alert.
   */
  async update(id: string, dto: UpdateAlertDto): Promise<unknown> {
    return this.client.put<unknown>(`/alerts/${id}`, dto);
  }

  /**
   * Delete alert.
   */
  async delete(id: string): Promise<unknown> {
    return this.client.delete<unknown>(`/alerts/${id}`);
  }

  /**
   * Test alert formula.
   */
  async test(dto: AlertTestDto): Promise<unknown> {
    return this.client.post<unknown>('/alerts/test', dto);
  }
}
