/**
 * Core types for Invezgo SDK
 */

export interface InvezgoConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  statusCode?: number;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  totalPage?: number;
  page?: number;
  nextPage?: number | null;
  data: T[];
}

export interface GraphPoint {
  date: string;
  value: number;
}

// Reference Types
export interface Stock {
  code: string;
  name: string;
  logo?: string;
}

export interface Broker {
  name: string;
  code: string;
}

export type IndexCategory =
  | 'headline'
  | 'sector'
  | 'sharia'
  | 'esg'
  | 'factor'
  | 'thematic'
  | 'board'
  | 'partnership'
  | 'smc'
  | string;

export interface StockIndex {
  code: string;
  name: string;
  category: IndexCategory;
}

// Company Information Types
export interface CompanyInformation {
  code: string;
  address?: string;
  industry?: string;
  subsindustry?: string;
  activity?: string;
  name: string;
  npwp?: string;
  board?: string;
  sector?: string;
  subsector?: string;
  listing_date?: string;
  website?: string;
  logo?: string;
  additional_info?: unknown;
  people?: unknown;
  report_type?: unknown;
  administration?: unknown;
  description?: unknown;
  ipo_pct?: number | null;
  ipo_price?: number | null;
  ipo_share?: number | null;
  ipo_underwriter?: string | null;
  nominal_price?: number | null;
  commissioner?: Array<{ name: string; position: string }>;
  director?: Array<{ name: string; position: string }>;
  subsidiary?: Array<{ name: string; percentage: number }>;
}

// Market Flow Types
export interface TopFlowItem {
  code: string;
  name: string;
  price: number;
  change: number;
  logo?: string;
  graph?: GraphPoint[];
}

export interface TopChangeResponse {
  gain: TopFlowItem[];
  loss: TopFlowItem[];
}

export interface TopForeignResponse {
  accum: TopFlowItem[];
  dist: TopFlowItem[];
}

export interface TopAccumulationResponse {
  accum: TopFlowItem[];
  dist: TopFlowItem[];
}

export interface TopRetailResponse {
  accum: TopFlowItem[];
  dist: TopFlowItem[];
}

// Chart Types
export interface ChartDataPoint {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number | string;
  freq?: number | string;
  value?: number | string;
}

export interface BrokerChartPoint {
  date: string;
  value: number;
}

export interface BrokerData {
  broker: string;
  data: BrokerChartPoint[];
}

export interface ChartResponse {
  price: Array<ChartDataPoint & { code: string }>;
  broker?: BrokerData[];
}

export interface IndexChartDataPoint extends ChartDataPoint {}

export interface IntradayChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  freq: number;
  value: number;
}

export interface IntradayStockData {
  code: string;
  open: number;
  high: number;
  low: number;
  close: number;
  avg: number;
  volume: number;
  freq: number;
  value: number;
  prev: number;
  bid_price: number;
  bid_lot: number;
  bid_freq: number;
  offer_price: number;
  offer_lot: number;
  offer_freq: number;
  iep: number;
  iev: number;
}

export interface IntradayIndexData {
  code: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  freq: number;
  value: number;
  prev: number;
  positive: number;
  negative: number;
  neutral: number;
  suspend: number;
  market_cap: number;
  market_value: number;
}

export interface OrderBookResponse {
  code: string;
  bid: Array<{
    bid1price: number;
    bid1lot: number;
    bid1freq: number;
  }>;
  offer: Array<{
    offer1price: number;
    offer1lot: number;
    offer1freq: number;
  }>;
}

// Shareholder Types
export interface ShareholderDetail {
  date: string;
  value: number;
}

export interface ShareholderComposition {
  name: string;
  percentage: number;
  badge: string;
}

export interface ShareholderKSEI {
  code: string;
  date: string;
  price: string;
  local_is: string;
  local_cp: string;
  local_pf: string;
  local_ib: string;
  local_id: string;
  local_mf: string;
  local_sc: string;
  local_fd: string;
  local_ot: string;
  foreign_is: string;
  foreign_cp: string;
  foreign_pf: string;
  foreign_ib: string;
  foreign_id: string;
  foreign_mf: string;
  foreign_sc: string;
  foreign_fd: string;
  foreign_ot: string;
}

export interface ShareholderDetailOneItem {
  code: string;
  name: string;
  type: string;
  status: string;
  nationality: string;
  domicile: string;
  scripless: number;
  scrip: number;
  total: number;
  percentage: number;
}

export interface ShareholderRelationNode {
  id: string;
  type: string;
  kind: string;
  label: string;
  root: boolean;
  depth: number;
  percentage: number;
  source_type: string;
  code?: string;
  company_name?: string;
  logo?: string;
  name?: string;
}

export interface ShareholderRelationEdge {
  id: string;
  source: string;
  target: string;
  code?: string;
  name: string;
  normalized_name: string;
  percentage: number;
  weight: number;
  source_type: string;
}

export interface ShareholderRelationResponse {
  nodes: ShareholderRelationNode[];
  edges: ShareholderRelationEdge[];
}

export interface ShareholderAbove5 {
  date: string;
  code: string;
  name: string;
  format_securities: string;
  prev_val: string;
  next_val: string;
  change: string;
}

export interface ShareholderOneItem {
  date: string;
  code: string;
  name: string;
  type: string;
  status: string;
  nationality: string;
  domicile: string;
  prev_scripless: string;
  next_scripless: string;
  prev_scrip: string;
  next_scrip: string;
  prev_total: string;
  next_total: string;
  prev_pct: number;
  next_pct: number;
}

export interface ShareholderOneChartPoint {
  date: string;
  scrip: string;
  scripless: string;
  total: string;
}

// Broker Summary Types
export interface BrokerSummary {
  code: string;
  buy_freq: string;
  buy_volume: string;
  buy_value: string;
  sell_freq: string;
  sell_volume: string;
  sell_value: string;
  buy_avg: number;
  sell_avg: number;
}

export interface SummaryChartItem {
  label: string;
  value: number;
  fill: string;
}

export interface InventoryChartResponse {
  price: Array<ChartDataPoint & { code: string }>;
  broker: BrokerData[];
}

export interface InventoryBrokerChartItem {
  code: string;
  data: GraphPoint[];
}

export interface MomentumChartData {
  time: string;
  buy_lot: number;
  sell_lot: number;
  buy_percentage: number;
  sell_percentage: number;
}

export interface SectorStalkerSeries {
  index: string;
  data: GraphPoint[];
}

export interface SectorStalkerResponse {
  index: SectorStalkerSeries[];
}

export interface SectorRotationPoint {
  date: string;
  x: number;
  y: number;
}

export interface SectorRotationItem {
  code: string;
  name: string;
  trail: SectorRotationPoint[];
  quadrant: string;
}

export interface SectorRotationResponse {
  benchmark: string;
  lastDate: string;
  data: SectorRotationItem[];
}

export interface BrokerStalkerResponse {
  broker: string;
  stock: string;
  summary: {
    active: number;
    total: number;
    avg: number;
    peak: {
      date: string;
      value: number;
    };
  };
  calendar: Array<{
    date: string;
    value: number;
    buy: number;
    sell: number;
    buy_dom: number;
  }>;
}

export interface BrokerStalkerListResponse {
  summary: {
    stocks: number;
    total_net: number;
    top: string;
    concentration: number;
    buy_dom: number;
  };
  list: Array<{
    code: string;
    value: number;
    transaction: number;
    buy_dom: number;
  }>;
}

// Price Types
export interface PriceTableData {
  price: number;
  buy_volume: number;
  sell_volume: number;
  buy_freq: number;
  sell_freq: number;
}

export interface TimeTableData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  value: number;
  buy: number;
  sell: number;
}

export interface PriceDiaryData {
  date: string;
  price: number;
  value: string;
  volume: string;
  change: number;
}

export type CorporateActionType =
  | 'IPO'
  | 'PUBLIC_EXPOSE'
  | 'REVERSE'
  | 'RIGHT'
  | 'RUPS_RESULT'
  | 'RUPS_SCHEDULE'
  | 'SPLIT'
  | 'WARRANT'
  | 'BONUS'
  | 'CONVERTION'
  | 'DIVIDEND'
  | string;

export interface CorporateActionCalendarItem {
  code: string;
  type: CorporateActionType;
  payload: Record<string, unknown>;
}

// Insider Trading Types
export interface InsiderTransaction {
  date: string;
  code: string;
  name: string;
  prev_percent: number;
  prev_val: string;
  next_percent: number;
  next_val: string;
  change: number;
  badge: string;
  nationality: string;
  purpose: string;
  child: number;
  subrow?: Array<{
    date: string;
    price: number;
    status: string;
    value: number;
  }>;
}

// Financial Statement Types
export interface FinancialStatementColumn {
  year: number;
  label: string;
  period: string;
}

export interface FinancialStatementValue {
  col: string;
  year: number;
  amount: number;
  period: string;
}

export interface FinancialStatementRow {
  id: string;
  name: string;
  level: number;
  values: FinancialStatementValue[];
  parent_id: string | null;
  is_abstract: boolean;
  display_order: number;
}

export interface FinancialStatementResponse {
  rows: FinancialStatementRow[];
  columns: FinancialStatementColumn[];
}

// Key Statistics Types
export interface KeyStatValue {
  col: string;
  year: number;
  amount: number;
  period: string;
}

export interface KeyStatRow {
  id: string;
  name: string;
  level: number;
  values: KeyStatValue[];
  parent_id: string | null;
  is_abstract: boolean;
  display_order: number;
}

export interface KeyStatResponse {
  rows: KeyStatRow[];
  columns: FinancialStatementColumn[];
}

// Query Parameters Types
export interface DateRangeParams {
  from: string;
  to: string;
}

export type InvestorType = 'all' | 'f' | 'd';
export type TradingBoardType = 'RG' | 'NG' | 'TN';
export type MarketType = TradingBoardType | 'ALL';
export type ScopeType = 'volume' | 'value' | 'freq';
export type ScopeShortType = 'vol' | 'val' | 'freq';
export type StatementType = 'BS' | 'IS' | 'CF';
export type PeriodType = 'FY' | 'Q' | 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type IndicatorType = 'bdm' | 'rsi' | 'macd' | string;

export type ScreenerCategory =
  | 'COMPOSITE'
  | 'SYARIAH'
  | 'IDXENERGY'
  | 'IDXBASIC'
  | 'IDXINDUST'
  | 'IDXNONCYC'
  | 'IDXCYCLIC'
  | 'IDXHEALTH'
  | 'IDXFINANCE'
  | 'IDXPROPERT'
  | 'IDXTECHNO'
  | 'IDXINFRA'
  | 'IDXTRANS';

export type SectorBaseType =
  | 'COMPOSITE'
  | 'IDX30'
  | 'IDX80'
  | 'LQ45'
  | 'IDXFINANCE'
  | 'IDXENERGY'
  | 'IDXBASIC'
  | 'IDXINDUST'
  | 'IDXNONCYC'
  | 'IDXCYCLIC'
  | 'IDXHEALTH'
  | 'IDXPROPERT'
  | 'IDXTECHNO'
  | 'IDXINFRA'
  | 'IDXTRANS';

export type StalkerFilterColumn =
  | 'change'
  | 'value'
  | 'volume'
  | 'foreign'
  | 'freq'
  | 'bdm'
  | 'ritel'
  | 'ratio'
  | 'open'
  | 'high'
  | 'low'
  | 'close';

export type FilterOperatorType = '<' | '>' | '=' | '>=' | '<=' | '!=';

export type AlertIntervalType =
  | 'FOURTY_FIVE_SECONDS'
  | 'FIVE_MINUTES'
  | 'TEN_MINUTES'
  | 'THIRTY_MINUTES'
  | 'ONE_HOUR'
  | 'END_SESSION'
  | 'END_OF_DAY';

export type AlertSendType = 'IN_OUT' | 'IN' | 'OUT';

// Request Options
export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}
