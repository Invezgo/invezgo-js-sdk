import { HttpClient } from '../client';

export interface ScreenCondition {
  ratio: 'BASIC' | 'COMPARE';
  column: string;
  operator: '>' | '>=' | '<' | '<=' | '==' | '!=';
  value?: string;
  compare?: string;
  multiply?: 'x' | '/';
}

export interface ScreenDto {
  columns: string[];
  conditions: ScreenCondition[];
}

export interface ScreenSaveDto {
  name: string;
  conditions: ScreenDto;
}

export class ScreenerEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of preset screeners
   */
  async list(): Promise<any[]> {
    return this.client.get<any[]>('/screener');
  }

  /**
   * Save preset screener
   */
  async save(dto: ScreenSaveDto): Promise<any> {
    return this.client.post<any>('/screener', dto);
  }

  /**
   * Run screener
   */
  async screen(dto: ScreenDto): Promise<any[]> {
    return this.client.post<any[]>('/screener/screen', dto);
  }
}

