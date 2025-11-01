import { HttpClient } from '../client';

export class AiEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * AI analysis of KSEI shareholder data
   */
  async analyzeShareholderKSEI(code: string): Promise<any> {
    return this.client.get<any>(`/ai/shareholder/ksei/${code}`);
  }

  /**
   * AI analysis of inventory chart
   */
  async analyzeInventoryChart(
    code: string,
    params: {
      from: string;
      to: string;
      scope: string;
      investor: string;
      limit: string;
      market: string;
      filter?: string;
    }
  ): Promise<any> {
    return this.client.get<any>(`/ai/inventory-chart/stock/${code}`, params);
  }

  /**
   * AI analysis of stock news
   */
  async analyzeNews(code: string): Promise<any> {
    return this.client.get<any>(`/ai/news/${code}`);
  }

  /**
   * AI analysis of broker summary
   */
  async analyzeBrokerSummary(
    code: string,
    params: {
      from: string;
      to: string;
      investor: string;
      market: string;
    }
  ): Promise<any> {
    return this.client.get<any>(`/ai/summary/stock/${code}`, params);
  }

  /**
   * AI analysis of insider trading
   */
  async analyzeInsider(
    params: {
      code?: string;
      name: string;
      from: string;
      to: string;
      page: string;
      limit: string;
    }
  ): Promise<any> {
    return this.client.get<any>('/ai/shareholder-insider', params);
  }

  /**
   * AI analysis of shareholders above 5%
   */
  async analyzeShareholderAbove(
    params: {
      code?: string;
      broker: string;
      name: string;
      from: string;
      to: string;
      page: string;
      limit: string;
    }
  ): Promise<any> {
    return this.client.get<any>('/ai/shareholder-above', params);
  }

  /**
   * AI analysis of intraday inventory chart
   */
  async analyzeIntradayInventory(
    code: string,
    params: {
      range: number;
      type: string;
      total: number;
      buyer: string;
      seller: string;
      broker: string;
      market: string;
    }
  ): Promise<any> {
    return this.client.get<any>(`/ai/intraday-inventory-chart/${code}`, params);
  }

  /**
   * AI analysis of sankey/crossing chart
   */
  async analyzeSankeyChart(
    code: string,
    params: {
      type: string;
      buyer: string;
      seller: string;
      market: string;
    }
  ): Promise<any> {
    return this.client.get<any>(`/ai/sankey-chart/${code}`, params);
  }

  /**
   * AI analysis of shareholder table
   */
  async analyzeShareholder(code: string): Promise<any> {
    return this.client.get<any>(`/ai/shareholder/${code}`);
  }

  /**
   * AI analysis of financial statement
   */
  async analyzeFinancialStatement(
    code: string,
    params: {
      statement: string;
      type: string;
      limit: string;
    }
  ): Promise<any> {
    return this.client.get<any>(`/ai/financial-statement/${code}`, params);
  }

  /**
   * AI analysis of key statistics
   */
  async analyzeKeyStat(
    code: string,
    params: {
      type: string;
      limit: string;
    }
  ): Promise<any> {
    return this.client.get<any>(`/ai/keystat/${code}`, params);
  }
}

