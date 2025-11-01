import { HttpClient } from '../client';
import type {
  Stock,
  Broker,
  CompanyInformation,
  TopChangeResponse,
  TopForeignResponse,
  TopAccumulationResponse,
  ChartResponse,
  IntradayChartData,
  OrderBookResponse,
  ShareholderDetail,
  ShareholderComposition,
  ShareholderKSEI,
  BrokerSummary,
  SummaryChartItem,
  InventoryChartResponse,
  MomentumChartData,
  PriceTableData,
  TimeTableData,
  PriceDiaryData,
  ShareholderAbove5,
  PaginatedResponse,
  InsiderTransaction,
  FinancialStatementResponse,
  KeyStatResponse,
  KeyStatValue,
  DateRangeParams,
  InvestorType,
  MarketType,
  ScopeType,
  ScopeShortType,
  StatementType,
  PeriodType,
  IndicatorType,
} from '../types';

export class AnalysisEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of all stocks listed on BEI
   */
  async getStockList(): Promise<Stock[]> {
    return this.client.get<Stock[]>('/analysis/list/stock');
  }

  /**
   * Get list of all brokers/securities on BEI
   */
  async getBrokerList(): Promise<Broker[]> {
    return this.client.get<Broker[]>('/analysis/list/broker');
  }

  /**
   * Get complete company information
   */
  async getInformation(code: string): Promise<CompanyInformation> {
    return this.client.get<CompanyInformation>(`/analysis/information/${code}`);
  }

  /**
   * Get top gainer and loser stocks for a specific date
   */
  async getTopChange(date: string): Promise<TopChangeResponse> {
    return this.client.get<TopChangeResponse>('/analysis/top/change', { date });
  }

  /**
   * Get top foreign accumulation and distribution
   */
  async getTopForeign(date: string): Promise<TopForeignResponse> {
    return this.client.get<TopForeignResponse>('/analysis/top/foreign', { date });
  }

  /**
   * Get top accumulation and distribution (bandarmologi)
   */
  async getTopAccumulation(date: string): Promise<TopAccumulationResponse> {
    return this.client.get<TopAccumulationResponse>('/analysis/top/accumulation', { date });
  }

  /**
   * Get intraday chart data
   */
  async getIntradayChart(
    code: string,
    market: MarketType = 'RG'
  ): Promise<IntradayChartData[]> {
    return this.client.get<IntradayChartData[]>(`/analysis/intraday/${code}`, { market });
  }

  /**
   * Get order book data
   */
  async getOrderBook(code: string, market: MarketType = 'RG'): Promise<OrderBookResponse> {
    return this.client.get<OrderBookResponse>(`/analysis/order-book/${code}`, { market });
  }

  /**
   * Get complete stock chart data
   */
  async getChart(code: string, params: DateRangeParams): Promise<ChartResponse> {
    return this.client.get<ChartResponse>(`/analysis/chart/stock/${code}`, params);
  }

  /**
   * Get stock chart with technical indicator
   */
  async getIndicatorChart(
    code: string,
    indicator: IndicatorType,
    params: DateRangeParams
  ): Promise<ChartResponse> {
    return this.client.get<ChartResponse>(
      `/analysis/chart/stock/${indicator}/${code}`,
      params
    );
  }

  /**
   * Get shareholder detail (ownership)
   */
  async getShareholderDetail(code: string): Promise<ShareholderDetail[]> {
    return this.client.get<ShareholderDetail[]>(`/analysis/shareholder-detail/${code}`);
  }

  /**
   * Get number of shareholders
   */
  async getShareholderNumber(code: string): Promise<ShareholderDetail[]> {
    return this.client.get<ShareholderDetail[]>(`/analysis/shareholder/number/${code}`);
  }

  /**
   * Get shareholder composition
   */
  async getShareholder(code: string): Promise<ShareholderComposition[]> {
    return this.client.get<ShareholderComposition[]>(`/analysis/shareholder/${code}`);
  }

  /**
   * Get KSEI shareholder data
   */
  async getShareholderKSEI(code: string, range: number): Promise<ShareholderKSEI[]> {
    return this.client.get<ShareholderKSEI[]>(`/analysis/shareholder/ksei/${code}`, {
      range: Math.min(range, 12),
    });
  }

  /**
   * Get broker summary for a stock
   */
  async getBrokerSummaryStock(
    code: string,
    params: DateRangeParams & {
      investor: InvestorType;
      market: MarketType;
    }
  ): Promise<BrokerSummary[]> {
    return this.client.get<BrokerSummary[]>(`/analysis/summary/stock/${code}`, params);
  }

  /**
   * Get broker summary for a broker
   */
  async getBrokerSummaryBroker(
    code: string,
    params: DateRangeParams & {
      investor: InvestorType;
      market: MarketType;
    }
  ): Promise<BrokerSummary[]> {
    return this.client.get<BrokerSummary[]>(`/analysis/summary/broker/${code}`, params);
  }

  /**
   * Get broker summary chart for a stock
   */
  async getBrokerSummaryChartStock(
    code: string,
    params: DateRangeParams & {
      scope: ScopeType;
      market: MarketType;
    }
  ): Promise<SummaryChartItem[]> {
    return this.client.get<SummaryChartItem[]>(
      `/analysis/summary-chart/stock/${code}`,
      params
    );
  }

  /**
   * Get broker summary chart for a broker
   */
  async getBrokerSummaryChartBroker(
    code: string,
    params: DateRangeParams & {
      scope: ScopeType;
      market: MarketType;
    }
  ): Promise<SummaryChartItem[]> {
    return this.client.get<SummaryChartItem[]>(
      `/analysis/summary-chart/broker/${code}`,
      params
    );
  }

  /**
   * Get inventory chart for a stock
   */
  async getInventoryChartStock(
    code: string,
    params: DateRangeParams & {
      scope: ScopeShortType;
      investor: InvestorType;
      limit: number;
      market: MarketType;
      filter?: string[];
    }
  ): Promise<InventoryChartResponse> {
    const requestParams: any = { ...params };
    if (params.filter) {
      requestParams.filter = params.filter;
    }
    return this.client.get<InventoryChartResponse>(
      `/analysis/inventory-chart/stock/${code}`,
      requestParams
    );
  }

  /**
   * Get inventory chart for a broker
   */
  async getInventoryChartBroker(
    code: string,
    params: DateRangeParams & {
      scope: ScopeShortType;
      investor: InvestorType;
      limit: number;
      market: MarketType;
      filter?: string[];
    }
  ): Promise<any[]> {
    const requestParams: any = { ...params };
    if (params.filter) {
      requestParams.filter = params.filter;
    }
    return this.client.get<any[]>(`/analysis/inventory-chart/broker/${code}`, requestParams);
  }

  /**
   * Get momentum chart
   */
  async getMomentumChart(
    code: string,
    params: {
      date: string;
      range: number;
      scope: ScopeShortType;
    }
  ): Promise<MomentumChartData[]> {
    return this.client.get<MomentumChartData[]>(`/analysis/momentum-chart/${code}`, params);
  }

  /**
   * Get intraday inventory chart
   */
  async getIntradayInventoryChart(
    code: string,
    params: {
      range: number;
      type: string;
      total: number;
      buyer: string;
      seller: string;
      market: MarketType;
      broker?: string;
    }
  ): Promise<InventoryChartResponse> {
    return this.client.get<InventoryChartResponse>(
      `/analysis/intraday-inventory-chart/${code}`,
      params
    );
  }

  /**
   * Get sankey/crossing chart
   */
  async getSankeyChart(
    code: string,
    params: {
      type: string;
      market: MarketType;
      buyer?: string;
      seller?: string;
    }
  ): Promise<InventoryChartResponse> {
    return this.client.get<InventoryChartResponse>(`/analysis/sankey-chart/${code}`, params);
  }

  /**
   * Get price table
   */
  async getPriceTable(code: string, date: string): Promise<PriceTableData[]> {
    return this.client.get<PriceTableData[]>(`/analysis/price-table/${code}`, { date });
  }

  /**
   * Get time table
   */
  async getTimeTable(
    code: string,
    params: {
      date: string;
      range: number;
    }
  ): Promise<TimeTableData[]> {
    return this.client.get<TimeTableData[]>(`/analysis/time-table/${code}`, params);
  }

  /**
   * Get price diary
   */
  async getPriceDiary(code: string): Promise<PriceDiaryData[]> {
    return this.client.get<PriceDiaryData[]>(`/analysis/price-diary/${code}`);
  }

  /**
   * Get price seasonality
   */
  async getPriceSeasonality(code: string, range: number): Promise<PriceDiaryData[]> {
    return this.client.get<PriceDiaryData[]>(`/analysis/price-seasonality/${code}`, {
      range: Math.min(range, 60),
    });
  }

  /**
   * Get shareholders above 5%
   */
  async getShareholderAbove(
    params: DateRangeParams & {
      limit: number;
      page: number;
      name?: string;
      broker?: string[];
      code?: string;
    }
  ): Promise<PaginatedResponse<ShareholderAbove5>> {
    return this.client.get<PaginatedResponse<ShareholderAbove5>>(
      '/analysis/shareholder-above',
      params
    );
  }

  /**
   * Get shareholder above 5% chart
   */
  async getShareholderAboveChart(
    code: string,
    params: {
      broker: string;
      name: string;
      date: string;
    }
  ): Promise<any> {
    return this.client.get<any>(`/analysis/shareholder-above-chart/${code}`, params);
  }

  /**
   * Get insider trading data
   */
  async getInsiderTrading(
    params: DateRangeParams & {
      limit: number;
      page: number;
      name?: string;
      code?: string;
    }
  ): Promise<PaginatedResponse<InsiderTransaction>> {
    return this.client.get<PaginatedResponse<InsiderTransaction>>(
      '/analysis/shareholder-insider',
      params
    );
  }

  /**
   * Get insider chart
   */
  async getInsiderChart(
    code: string,
    params: {
      name: string;
      date: string;
    }
  ): Promise<any> {
    return this.client.get<any>(`/analysis/insider-chart/${code}`, params);
  }

  /**
   * Get financial statement
   */
  async getFinancialStatement(
    code: string,
    params: {
      statement: StatementType;
      type: PeriodType;
      limit: number;
    }
  ): Promise<FinancialStatementResponse> {
    return this.client.get<FinancialStatementResponse>(
      `/analysis/financial-statement/${code}`,
      { ...params, limit: Math.min(params.limit, 20) }
    );
  }

  /**
   * Get financial statement chart
   */
  async getFinancialStatementChart(
    code: string,
    params: {
      statement: StatementType;
      type: PeriodType;
      limit: string;
      account: string;
    }
  ): Promise<FinancialStatementResponse['rows'][0]['values']> {
    return this.client.get(
      `/analysis/financial-statement-chart/${code}`,
      { ...params, limit: Math.min(Number(params.limit), 20).toString() }
    );
  }

  /**
   * Get key statistics
   */
  async getKeyStat(
    code: string,
    params: {
      type: PeriodType;
      limit: number;
    }
  ): Promise<KeyStatResponse> {
    return this.client.get<KeyStatResponse>(`/analysis/keystat/${code}`, {
      ...params,
      limit: Math.min(params.limit, 20),
    });
  }

  /**
   * Get key statistics chart
   */
  async getKeyStatChart(
    code: string,
    params: {
      type: PeriodType;
      limit: string;
      name: string;
    }
  ): Promise<KeyStatValue[]> {
    return this.client.get<KeyStatValue[]>(`/analysis/keystat-chart/${code}`, params);
  }
}

