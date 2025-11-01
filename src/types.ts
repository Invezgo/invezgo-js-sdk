/**
 * Core types for Invezgo SDK
 */

export interface InvezgoConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface ApiResponse<T = any> {
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

// Stock List Types
export interface Stock {
  code: string;
  name: string;
  logo?: string;
}

export interface Broker {
  name: string;
  code: string;
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
  additional_info?: any;
  people?: any;
  report_type?: any;
  administration?: any;
  description?: any;
  ipo_pct?: number;
  ipo_price?: number;
  ipo_share?: number;
  ipo_underwriter?: string;
  nominal_price?: number;
  commissioner?: Array<{ name: string; position: string }>;
  director?: Array<{ name: string; position: string }>;
  subsidiary?: Array<{ name: string; percentage: number }>;
}

// Top Change Types
export interface TopChangeItem {
  code: string;
  name: string;
  price: number;
  change: number;
  logo?: string;
}

export interface TopChangeResponse {
  gain: TopChangeItem[];
  loss: TopChangeItem[];
}

export interface TopForeignResponse {
  accum: TopChangeItem[];
  dist: TopChangeItem[];
}

export interface TopAccumulationResponse {
  accum: TopChangeItem[];
  dist: TopChangeItem[];
}

// Chart Types
export interface ChartDataPoint {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  freq?: number;
  value?: number;
}

export interface BrokerData {
  broker: string;
  data: Array<{ date: string; value: number }>;
}

export interface ChartResponse {
  price: Array<ChartDataPoint & { code: string }>;
  broker?: BrokerData[];
}

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

// Inventory Chart Types
export interface InventoryChartResponse {
  price: Array<ChartDataPoint & { code: string }>;
  broker: BrokerData[];
}

// Momentum Chart Types
export interface MomentumChartData {
  time: string;
  buy_lot: number;
  sell_lot: number;
  buy_percentage: number;
  sell_percentage: number;
}

// Price Table Types
export interface PriceTableData {
  price: number;
  buy_volume: number;
  sell_volume: number;
  buy_freq: number;
  sell_freq: number;
}

// Time Table Types
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

// Price Diary Types
export interface PriceDiaryData {
  date: string;
  price: number;
  value: string;
  volume: string;
  change: number;
}

// Shareholder Above 5% Types
export interface ShareholderAbove5 {
  date: string;
  code: string;
  name: string;
  format_securities: string;
  prev_val: string;
  next_val: string;
  change: string;
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
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export type InvestorType = 'all' | 'f' | 'd';
export type MarketType = 'RG' | 'NG' | 'TN' | 'ALL';
export type ScopeType = 'volume' | 'value' | 'freq';
export type ScopeShortType = 'vol' | 'val' | 'freq';
export type StatementType = 'BS' | 'IS' | 'CF';
export type PeriodType = 'FY' | 'Q' | 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type IndicatorType = 'bdm' | 'rsi' | 'macd' | string;

// Request Options
export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

