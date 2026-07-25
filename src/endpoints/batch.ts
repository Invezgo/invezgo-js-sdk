import { HttpClient } from '../client';
import type {
  OrderBookResponse,
  IntradayStockData,
  IntradayIndexData,
  BatchOrderBookParams,
  BatchIntradayDataParams,
} from '../types';

export class BatchEndpoints {
  constructor(private client: HttpClient) {}

  private formatCode(code: string | string[]): string {
    return Array.isArray(code) ? code.join('|') : code;
  }

  /**
   * Get order book data for multiple stocks in a single request (max 3 for MAX, 10 for ELITE).
   *
   * @param code Stock codes (e.g. 'BBCA|GOTO|HUMI' or ['BBCA', 'GOTO', 'HUMI'])
   * @param params Parameters including required market ('RG', 'NG', 'TN'), optional date, and time
   */
  async getOrderBook(
    code: string | string[],
    params: BatchOrderBookParams
  ): Promise<OrderBookResponse[]> {
    const formattedCode = this.formatCode(code);
    return this.client.get<OrderBookResponse[]>(`/batch/order-book/${formattedCode}`, params);
  }

  /**
   * Alias for getOrderBook.
   */
  async getOrderBookBatch(
    code: string | string[],
    params: BatchOrderBookParams
  ): Promise<OrderBookResponse[]> {
    return this.getOrderBook(code, params);
  }

  /**
   * Get summary intraday price data for multiple stocks in a single request (max 3 for MAX, 10 for ELITE).
   *
   * @param code Stock codes (e.g. 'BBCA|GOTO|HUMI' or ['BBCA', 'GOTO', 'HUMI'])
   * @param params Parameters including required market ('RG', 'NG', 'TN') and optional date
   */
  async getIntradayData(
    code: string | string[],
    params: BatchIntradayDataParams
  ): Promise<IntradayStockData[]> {
    const formattedCode = this.formatCode(code);
    return this.client.get<IntradayStockData[]>(`/batch/intraday-data/${formattedCode}`, params);
  }

  /**
   * Alias for getIntradayData.
   */
  async getIntradayDataBatch(
    code: string | string[],
    params: BatchIntradayDataParams
  ): Promise<IntradayStockData[]> {
    return this.getIntradayData(code, params);
  }

  /**
   * Get summary intraday price data for multiple indexes in a single request (max 3 for MAX, 10 for ELITE).
   *
   * @param code Index codes (e.g. 'COMPOSITE|LQ45|IDX30' or ['COMPOSITE', 'LQ45', 'IDX30'])
   */
  async getIntradayIndex(code: string | string[]): Promise<IntradayIndexData[]> {
    const formattedCode = this.formatCode(code);
    return this.client.get<IntradayIndexData[]>(`/batch/intraday-index/${formattedCode}`);
  }

  /**
   * Alias for getIntradayIndex.
   */
  async getIntradayIndexBatch(code: string | string[]): Promise<IntradayIndexData[]> {
    return this.getIntradayIndex(code);
  }
}
