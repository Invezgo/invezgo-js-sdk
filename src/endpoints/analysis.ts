import { HttpClient } from '../client';
import type {
  Stock,
  Broker,
  StockIndex,
  CompanyInformation,
  TopChangeResponse,
  TopForeignResponse,
  TopAccumulationResponse,
  TopRetailResponse,
  ChartResponse,
  IndexChartDataPoint,
  IntradayChartData,
  IntradayStockData,
  IntradayIndexData,
  OrderBookResponse,
  ShareholderDetail,
  ShareholderComposition,
  ShareholderKSEI,
  ShareholderDetailOneItem,
  ShareholderRelationResponse,
  BrokerSummary,
  SummaryChartItem,
  InventoryChartResponse,
  InventoryBrokerChartItem,
  MomentumChartData,
  SectorStalkerResponse,
  SectorRotationResponse,
  BrokerStalkerResponse,
  BrokerStalkerListResponse,
  PriceTableData,
  TimeTableData,
  PriceDiaryData,
  ShareholderAbove5,
  ShareholderOneItem,
  ShareholderOneChartPoint,
  CorporateActionCalendarItem,
  PaginatedResponse,
  InsiderTransaction,
  FinancialStatementResponse,
  KeyStatResponse,
  KeyStatValue,
  DateRangeParams,
  InvestorType,
  TradingBoardType,
  ScopeType,
  ScopeShortType,
  StatementType,
  PeriodType,
  IndicatorType,
  SectorBaseType,
  StalkerFilterColumn,
  FilterOperatorType,
  CorporateActionType,
} from '../types';

export class AnalysisEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of all stocks listed on BEI.
   */
  async getStockList(): Promise<Stock[]> {
    return this.client.get<Stock[]>('/analysis/list/stock');
  }

  /**
   * Get list of all brokers/securities on BEI.
   */
  async getBrokerList(): Promise<Broker[]> {
    return this.client.get<Broker[]>('/analysis/list/broker');
  }

  /**
   * Get list of all supported IDX indexes.
   */
  async getIndexList(): Promise<StockIndex[]> {
    return this.client.get<StockIndex[]>('/analysis/list/index');
  }

  /**
   * Get complete company information.
   */
  async getInformation(code: string): Promise<CompanyInformation> {
    return this.client.get<CompanyInformation>(`/analysis/information/${code}`);
  }

  /**
   * Get top gainer and loser stocks for a specific date.
   */
  async getTopChange(date: string): Promise<TopChangeResponse> {
    return this.client.get<TopChangeResponse>('/analysis/top/change', { date });
  }

  /**
   * Get top foreign accumulation and distribution.
   */
  async getTopForeign(date: string): Promise<TopForeignResponse> {
    return this.client.get<TopForeignResponse>('/analysis/top/foreign', { date });
  }

  /**
   * Get top bandarmology accumulation and distribution.
   */
  async getTopAccumulation(date: string): Promise<TopAccumulationResponse> {
    return this.client.get<TopAccumulationResponse>('/analysis/top/accumulation', { date });
  }

  /**
   * Get top retail accumulation and distribution.
   */
  async getTopRitel(date: string): Promise<TopRetailResponse> {
    return this.client.get<TopRetailResponse>('/analysis/top/ritel', { date });
  }

  /**
   * Alias for getTopRitel.
   */
  async getTopRetail(date: string): Promise<TopRetailResponse> {
    return this.getTopRitel(date);
  }

  /**
   * Get intraday chart data.
   */
  async getIntradayChart(
    code: string,
    market: TradingBoardType = 'RG'
  ): Promise<IntradayChartData[]> {
    return this.client.get<IntradayChartData[]>(`/analysis/intraday/${code}`, { market });
  }

  /**
   * Get intraday stock summary data.
   */
  async getIntradayData(
    code: string,
    market: TradingBoardType = 'RG'
  ): Promise<IntradayStockData> {
    return this.client.get<IntradayStockData>(`/analysis/intraday-data/${code}`, { market });
  }

  /**
   * Get intraday index summary data.
   */
  async getIntradayIndex(
    code: string,
    market: TradingBoardType = 'RG'
  ): Promise<IntradayIndexData> {
    return this.client.get<IntradayIndexData>(`/analysis/intraday-index/${code}`, { market });
  }

  /**
   * Get order book data.
   */
  async getOrderBook(
    code: string,
    market: TradingBoardType = 'RG'
  ): Promise<OrderBookResponse> {
    return this.client.get<OrderBookResponse>(`/analysis/order-book/${code}`, { market });
  }

  /**
   * Get complete stock chart data.
   */
  async getChart(code: string, params: DateRangeParams): Promise<ChartResponse> {
    return this.client.get<ChartResponse>(`/analysis/chart/stock/${code}`, params);
  }

  /**
   * Get historical index chart data.
   */
  async getIndexChart(code: string, params: DateRangeParams): Promise<IndexChartDataPoint[]> {
    return this.client.get<IndexChartDataPoint[]>(`/analysis/chart/index/${code}`, params);
  }

  /**
   * Get stock chart with technical indicator.
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
   * Get shareholder detail above 5%.
   */
  async getShareholderDetail(code: string): Promise<ShareholderDetail[]> {
    return this.client.get<ShareholderDetail[]>(`/analysis/shareholder-detail/${code}`);
  }

  /**
   * Get shareholder detail above 1% for a specific holder.
   */
  async getShareholderDetailOne(params: {
    code: string;
    name: string;
  }): Promise<ShareholderDetailOneItem[]> {
    return this.client.get<ShareholderDetailOneItem[]>('/analysis/shareholder-detail-one', params);
  }

  /**
   * Get number of shareholders.
   */
  async getShareholderNumber(code: string): Promise<ShareholderDetail[]> {
    return this.client.get<ShareholderDetail[]>(`/analysis/shareholder/number/${code}`);
  }

  /**
   * Get shareholder relation graph.
   */
  async getShareholderRelation(params: {
    code?: string;
    name?: string;
    depth?: number;
    max_nodes?: number;
    neighbors?: number;
    min_percentage?: number;
  }): Promise<ShareholderRelationResponse> {
    return this.client.get<ShareholderRelationResponse>('/analysis/shareholder/relation', params);
  }

  /**
   * Get shareholder composition.
   */
  async getShareholder(code: string): Promise<ShareholderComposition[]> {
    return this.client.get<ShareholderComposition[]>(`/analysis/shareholder/${code}`);
  }

  /**
   * Get KSEI shareholder data.
   */
  async getShareholderKSEI(code: string, range: number): Promise<ShareholderKSEI[]> {
    return this.client.get<ShareholderKSEI[]>(`/analysis/shareholder/ksei/${code}`, {
      range: Math.min(range, 12),
    });
  }

  /**
   * Get broker summary for a stock.
   */
  async getBrokerSummaryStock(
    code: string,
    params: DateRangeParams & {
      investor: InvestorType;
      market: TradingBoardType;
    }
  ): Promise<BrokerSummary[]> {
    return this.client.get<BrokerSummary[]>(`/analysis/summary/stock/${code}`, params);
  }

  /**
   * Get broker summary for a broker.
   */
  async getBrokerSummaryBroker(
    code: string,
    params: DateRangeParams & {
      investor: InvestorType;
      market: TradingBoardType;
    }
  ): Promise<BrokerSummary[]> {
    return this.client.get<BrokerSummary[]>(`/analysis/summary/broker/${code}`, params);
  }

  /**
   * Get sector stalker data.
   */
  async getStalkerSector(params: DateRangeParams & {
    base?: SectorBaseType;
    limit?: number;
    filter?: string;
    filter_column?: StalkerFilterColumn;
    filter_operator?: FilterOperatorType;
    filter_value?: number;
  }): Promise<SectorStalkerResponse> {
    return this.client.get<SectorStalkerResponse>('/analysis/stalker/sector', params);
  }

  /**
   * Get sector rotation chart.
   */
  async getSectorRotation(params: DateRangeParams & {
    base?: SectorBaseType;
    length?: number;
    tail?: number;
    limit?: number;
    filter?: string;
    filter_column?: StalkerFilterColumn;
    filter_operator?: FilterOperatorType;
    filter_value?: number;
  }): Promise<SectorRotationResponse> {
    return this.client.get<SectorRotationResponse>('/analysis/sector/rotation', params);
  }

  /**
   * Get broker stalker data for a stock.
   */
  async getBrokerStalker(
    broker: string,
    stock: string,
    params: DateRangeParams & {
      investor: InvestorType;
      market: TradingBoardType;
      scope: 'volume' | 'value';
    }
  ): Promise<BrokerStalkerResponse> {
    return this.client.get<BrokerStalkerResponse>(
      `/analysis/stalker/broker/${broker}/${stock}`,
      params
    );
  }

  /**
   * Get broker stalker list.
   */
  async getBrokerStalkerList(
    code: string,
    params: DateRangeParams & {
      investor: InvestorType;
      scope: 'volume' | 'value';
      market: TradingBoardType;
    }
  ): Promise<BrokerStalkerListResponse> {
    return this.client.get<BrokerStalkerListResponse>(
      `/analysis/stalker/list/${code}`,
      params
    );
  }

  /**
   * Get broker summary chart for a stock.
   */
  async getBrokerSummaryChartStock(
    code: string,
    params: DateRangeParams & {
      scope: ScopeType;
      market: TradingBoardType;
    }
  ): Promise<SummaryChartItem[]> {
    return this.client.get<SummaryChartItem[]>(
      `/analysis/summary-chart/stock/${code}`,
      params
    );
  }

  /**
   * Get broker summary chart for a broker.
   */
  async getBrokerSummaryChartBroker(
    code: string,
    params: DateRangeParams & {
      scope: ScopeType;
      market: TradingBoardType;
    }
  ): Promise<SummaryChartItem[]> {
    return this.client.get<SummaryChartItem[]>(
      `/analysis/summary-chart/broker/${code}`,
      params
    );
  }

  /**
   * Get inventory chart for a stock.
   */
  async getInventoryChartStock(
    code: string,
    params: DateRangeParams & {
      scope: ScopeShortType;
      investor: InvestorType;
      limit: number;
      market: TradingBoardType;
      filter?: string[];
    }
  ): Promise<InventoryChartResponse> {
    return this.client.get<InventoryChartResponse>(
      `/analysis/inventory-chart/stock/${code}`,
      params
    );
  }

  /**
   * Get inventory chart for a broker.
   */
  async getInventoryChartBroker(
    code: string,
    params: DateRangeParams & {
      scope: ScopeShortType;
      investor: InvestorType;
      limit: number;
      market: TradingBoardType;
      filter?: string[];
    }
  ): Promise<InventoryBrokerChartItem[]> {
    return this.client.get<InventoryBrokerChartItem[]>(
      `/analysis/inventory-chart/broker/${code}`,
      params
    );
  }

  /**
   * Get momentum chart.
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
   * Get intraday inventory chart.
   */
  async getIntradayInventoryChart(
    code: string,
    params: {
      range: number;
      type: string;
      total: number;
      buyer: string;
      seller: string;
      market: TradingBoardType;
      broker?: string;
    }
  ): Promise<InventoryChartResponse> {
    return this.client.get<InventoryChartResponse>(
      `/analysis/intraday-inventory-chart/${code}`,
      params
    );
  }

  /**
   * Get distribution or crossing chart.
   */
  async getSankeyChart(
    code: string,
    params: {
      type: string;
      market: TradingBoardType;
      buyer?: string;
      seller?: string;
    }
  ): Promise<unknown> {
    return this.client.get<unknown>(`/analysis/sankey-chart/${code}`, params);
  }

  /**
   * Get price table.
   */
  async getPriceTable(code: string, date: string): Promise<PriceTableData[]> {
    return this.client.get<PriceTableData[]>(`/analysis/price-table/${code}`, { date });
  }

  /**
   * Get time table.
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
   * Get price diary.
   */
  async getPriceDiary(code: string): Promise<PriceDiaryData[]> {
    return this.client.get<PriceDiaryData[]>(`/analysis/price-diary/${code}`);
  }

  /**
   * Get price seasonality.
   */
  async getPriceSeasonality(code: string, range: number): Promise<PriceDiaryData[]> {
    return this.client.get<PriceDiaryData[]>(`/analysis/price-seasonality/${code}`, {
      range: Math.min(range, 60),
    });
  }

  /**
   * Get shareholders above 5%.
   */
  async getShareholderAbove(
    params: DateRangeParams & {
      limit?: number;
      page?: number;
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
   * Get shareholder above 5% chart.
   */
  async getShareholderAboveChart(
    code: string,
    params: {
      broker: string;
      name: string;
      date: string;
    }
  ): Promise<unknown> {
    return this.client.get<unknown>(`/analysis/shareholder-above-chart/${code}`, params);
  }

  /**
   * Get shareholders above 1%.
   */
  async getShareholderOne(
    params: DateRangeParams & {
      page?: number;
      limit?: number;
      code?: string;
      name?: string;
    }
  ): Promise<PaginatedResponse<ShareholderOneItem>> {
    return this.client.get<PaginatedResponse<ShareholderOneItem>>(
      '/analysis/shareholder-one',
      params
    );
  }

  /**
   * Get shareholder above 1% chart.
   */
  async getShareholderOneChart(
    code: string,
    params: {
      broker?: string;
      name?: string;
      date?: string;
    }
  ): Promise<ShareholderOneChartPoint[]> {
    return this.client.get<ShareholderOneChartPoint[]>(
      `/analysis/shareholder-one-chart/${code}`,
      params
    );
  }

  /**
   * Get insider trading data.
   */
  async getInsiderTrading(
    params: DateRangeParams & {
      limit?: number;
      page?: number;
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
   * Get insider chart.
   */
  async getInsiderChart(
    code: string,
    params: {
      name: string;
      date: string;
    }
  ): Promise<unknown> {
    return this.client.get<unknown>(`/analysis/insider-chart/${code}`, params);
  }

  /**
   * Get financial statement.
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
   * Get financial statement chart.
   */
  async getFinancialStatementChart(
    code: string,
    params: {
      statement: StatementType;
      type: PeriodType;
      limit: number;
      account: string;
    }
  ): Promise<FinancialStatementResponse['rows'][0]['values']> {
    return this.client.get<FinancialStatementResponse['rows'][0]['values']>(
      `/analysis/financial-statement-chart/${code}`,
      { ...params, limit: Math.min(params.limit, 20) }
    );
  }

  /**
   * Get key statistics.
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
   * Get key statistics chart.
   */
  async getKeyStatChart(
    code: string,
    params: {
      type: PeriodType;
      limit: number;
      name: string;
    }
  ): Promise<KeyStatValue[]> {
    return this.client.get<KeyStatValue[]>(`/analysis/keystat-chart/${code}`, {
      ...params,
      limit: Math.min(params.limit, 20),
    });
  }

  /**
   * Get corporate action calendar.
   */
  async getCalendar(params: {
    code?: string;
    type?: CorporateActionType;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<CorporateActionCalendarItem>> {
    return this.client.get<PaginatedResponse<CorporateActionCalendarItem>>(
      '/analysis/calendar',
      params
    );
  }

  /**
   * Alias for getCalendar.
   */
  async getCorporateActionCalendar(params: {
    code?: string;
    type?: CorporateActionType;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<CorporateActionCalendarItem>> {
    return this.getCalendar(params);
  }
}
