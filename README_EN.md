<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

# 📈 Invezgo SDK

**Official JavaScript/TypeScript SDK for Invezgo API**

A comprehensive SDK for accessing Indonesia Stock Market data and features from the Invezgo platform.

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples) • [API Reference](#-api-reference)

</div>

---

## ✨ Features

- 🔥 **Full TypeScript Support** - Complete type definitions for all endpoints and responses
- 📦 **Dual Module Support** - Works with both CommonJS and ES Modules seamlessly
- 🎯 **Comprehensive Coverage** - All Invezgo API endpoints included and typed
- 🛡️ **Robust Error Handling** - Typed exceptions with detailed error information
- ⚡ **Modern Async/Await** - Built with modern JavaScript patterns
- 📚 **Well Documented** - Comprehensive JSDoc comments and IntelliSense support
- 🚀 **Zero Dependencies** - Lightweight, fast, and dependency-free
- 🔐 **Secure** - Automatic authentication handling with Bearer tokens
- 🌐 **Browser & Node.js** - Works in both browser and Node.js environments

## 📦 Installation

Install the SDK using npm, yarn, or pnpm:

```bash
# Using npm
npm install @invezgo/sdk

# Using yarn
yarn add @invezgo/sdk

# Using pnpm
pnpm add @invezgo/sdk
```

## 🚀 Quick Start

### Get Your API Key

First, you need an API key from Invezgo. Get yours at:
- [API Key Settings](https://invezgo.com/id/setting/api)
- [Subscription Plans](https://invezgo.com/subscription)

### JavaScript (CommonJS)

```javascript
const { Invezgo } = require('@invezgo/sdk');

const client = new Invezgo({
  apiKey: 'your-api-key-here'
});

// Get list of all stocks
(async () => {
  try {
    const stocks = await client.analysis.getStockList();
    console.log(`Found ${stocks.length} stocks`);
    console.log(stocks[0]); // { code: 'BBCA', name: 'Bank Central Asia', logo: '...' }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
```

### TypeScript / ES Modules

```typescript
import Invezgo from '@invezgo/sdk';

const client = new Invezgo({
  apiKey: 'your-api-key-here'
});

// Get company information
(async () => {
  try {
    const info = await client.analysis.getInformation('BBCA');
    console.log(info.name); // Bank Central Asia
    console.log(info.sector); // Keuangan
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

## 📚 Documentation

### Configuration

```typescript
import Invezgo from '@invezgo/sdk';

const client = new Invezgo({
  apiKey: 'your-api-key',        // Required: Your Invezgo API key
  baseURL: 'https://api.invezgo.com', // Optional: Defaults to https://api.invezgo.com
  timeout: 30000                   // Optional: Request timeout in ms (default: 30000)
});
```

### Endpoint Categories

The SDK is organized into logical endpoint categories:

| Category | Description | Methods |
|----------|-------------|---------|
| **`analysis`** | Stock analysis, charts, financial data | 30+ methods |
| **`watchlists`** | Personal watchlist management | 7 methods |
| **`journals`** | Trading journal management | 5 methods |
| **`portfolios`** | Portfolio tracking and summary | 2 methods |
| **`ai`** | AI-powered stock analysis | 10 methods |
| **`search`** | Search stocks and users | 3 methods |
| **`profile`** | User profiles and social features | 8 methods |
| **`membership`** | Subscription management | 5 methods |
| **`posts`** | Community posts and interactions | 8 methods |
| **`trades`** | Trade tracking and summaries | 4 methods |
| **`screener`** | Stock screening with filters | 3 methods |
| **`health`** | API health checks | 3 methods |

## 💡 Examples

### 📊 Stock Analysis

```typescript
import Invezgo from '@invezgo/sdk';

const client = new Invezgo({ apiKey: 'your-api-key' });

// Get all listed stocks
const stocks = await client.analysis.getStockList();
console.log(`Total stocks: ${stocks.length}`);

// Get company information
const company = await client.analysis.getInformation('BBCA');
console.log(company.name);        // Bank Central Asia
console.log(company.sector);      // Keuangan
console.log(company.industry);    // Bank
console.log(company.listing_date); // 2000-05-30T17:00:00.000Z

// Get all brokers
const brokers = await client.analysis.getBrokerList();
console.log(brokers); // Array of broker objects

// Get top gainers and losers
const topChange = await client.analysis.getTopChange('2024-12-30');
console.log('Top Gainers:', topChange.gain);
console.log('Top Losers:', topChange.loss);

// Get top foreign accumulation and distribution
const topForeign = await client.analysis.getTopForeign('2024-12-30');
console.log('Foreign Accumulation:', topForeign.accum);
console.log('Foreign Distribution:', topForeign.dist);
```

### 📈 Stock Charts

```typescript
// Get stock chart with OHLCV data
const chart = await client.analysis.getChart('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30'
});
console.log(chart.price); // Array of OHLCV data points
console.log(chart.broker); // Broker activity data

// Get intraday chart
const intraday = await client.analysis.getIntraday('BBCA', {
  market: 'RG' // 'RG' (Reguler), 'NG' (Negotiated), 'TN' (Tunai)
});

// Get order book
const orderBook = await client.analysis.getOrderBook('BBCA', {
  market: 'RG'
});
console.log(orderBook.bid);  // Bid orders
console.log(orderBook.offer); // Ask orders

// Get chart with technical indicator
const chartWithIndicator = await client.analysis.getIndicatorChart('BBCA', 'rsi', {
  from: '2024-12-01',
  to: '2024-12-30'
});
```

### 💰 Financial Statements

```typescript
// Get balance sheet (Neraca)
const balanceSheet = await client.analysis.getFinancialStatement('BBCA', {
  statement: 'BS', // 'BS' (Balance Sheet), 'IS' (Income Statement), 'CF' (Cash Flow)
  type: 'Q',      // 'FY' (Annual), 'Q' (Quarterly), 'Q1', 'Q2', 'Q3', 'Q4'
  limit: 10       // Maximum 20 periods
});

console.log(balanceSheet.rows);    // Financial statement rows
console.log(balanceSheet.columns);  // Period columns

// Get income statement (Laba Rugi)
const incomeStatement = await client.analysis.getFinancialStatement('BBCA', {
  statement: 'IS',
  type: 'FY',
  limit: 5
});

// Get cash flow statement (Arus Kas)
const cashFlow = await client.analysis.getFinancialStatement('BBCA', {
  statement: 'CF',
  type: 'Q',
  limit: 10
});

// Get financial statement chart for specific account
const chart = await client.analysis.getFinancialStatementChart('BBCA', {
  statement: 'BS',
  type: 'Q',
  limit: '10',
  account: 'account-id-here'
});
```

### 📊 Key Statistics

```typescript
// Get key statistics
const keyStat = await client.analysis.getKeyStat('BBCA', {
  type: 'Q',
  limit: 10
});

// Get key statistics chart
const keyStatChart = await client.analysis.getKeyStatChart('BBCA', {
  type: 'Q',
  limit: '10',
  name: 'PER' // Metric name like PER, PBV, etc.
});
```

### 🏢 Shareholder Analysis

```typescript
// Get shareholder composition
const shareholders = await client.analysis.getShareholder('BBCA');
console.log(shareholders); // Array of shareholders with percentages

// Get shareholder detail (number of shareholders)
const shareholderDetail = await client.analysis.getShareholderDetail('BBCA');
console.log(shareholderDetail); // Time series of shareholder count

// Get shareholder number
const shareholderNumber = await client.analysis.getShareholderNumber('BBCA');

// Get KSEI shareholder classification
const kseiData = await client.analysis.getShareholderKSEI('BBCA', {
  range: 6 // Number of months (max 12)
});
console.log(kseiData); // Foreign and domestic investor breakdown

// Get shareholders above 5%
const shareholdersAbove5 = await client.analysis.getShareholderAbove({
  from: '2024-12-01',
  to: '2024-12-30',
  page: 1,
  limit: 10,
  code: 'BBCA', // Optional filter
  name: '',     // Optional filter by name
  broker: []    // Optional filter by broker codes
});

// Get insider trading
const insiderTrades = await client.analysis.getInsider({
  from: '2024-12-01',
  to: '2024-12-30',
  page: 1,
  limit: 10,
  code: 'BBCA', // Optional
  name: ''      // Optional
});
```

### 📈 Broker Analysis

```typescript
// Get broker summary for a stock
const brokerSummary = await client.analysis.getBrokerSummaryStock('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  investor: 'all', // 'all', 'f' (foreign), 'd' (domestic)
  market: 'RG'     // 'RG' (Reguler), 'NG' (Negotiated), 'TN' (Tunai)
});
console.log(brokerSummary); // Broker activity data

// Get broker summary chart
const summaryChart = await client.analysis.getBrokerSummaryChartStock('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  scope: 'volume', // 'volume', 'value', 'freq'
  market: 'RG'
});

// Get broker summary for a specific broker
const brokerSummaryByBroker = await client.analysis.getBrokerSummaryBroker('AG', {
  from: '2024-12-01',
  to: '2024-12-30',
  investor: 'all',
  market: 'RG'
});

// Get inventory chart for stock
const inventoryChart = await client.analysis.getInventoryChartStock('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  scope: 'vol',   // 'vol', 'val', 'freq'
  investor: 'all',
  limit: 5,       // Max 20 brokers
  market: 'RG',
  filter: []      // Optional: filter specific broker codes
});

// Get inventory chart for broker
const brokerInventoryChart = await client.analysis.getInventoryChartBroker('AG', {
  from: '2024-12-01',
  to: '2024-12-30',
  scope: 'vol',
  investor: 'all',
  limit: 5,
  market: 'RG',
  filter: []      // Optional: filter specific stock codes
});
```

### 📊 Advanced Charts

```typescript
// Get momentum chart
const momentum = await client.analysis.getMomentumChart('BBCA', {
  date: '2024-12-30',
  range: 5,  // Interval in minutes: 5, 10, 15, 30, 60
  scope: 'vol' // 'vol', 'val', 'freq'
});

// Get intraday inventory chart
const intradayInventory = await client.analysis.getIntradayInventoryChart('BBCA', {
  range: 5,
  type: 'inventory',
  total: 5,
  buyer: '',
  seller: '',
  broker: '',
  market: 'RG'
});

// Get sankey/crossing chart
const sankeyChart = await client.analysis.getSankeyChart('BBCA', {
  type: 'crossing',
  buyer: '',
  seller: '',
  market: 'RG'
});

// Get price table
const priceTable = await client.analysis.getPriceTable('BBCA', {
  date: '2024-12-30'
});

// Get time table
const timeTable = await client.analysis.getTimeTable('BBCA', {
  date: '2024-12-30',
  range: 5 // Interval in minutes
});
```

### 📅 Price History

```typescript
// Get price diary (daily price changes)
const priceDiary = await client.analysis.getPriceDiary('BBCA');

// Get price seasonality (monthly price changes)
const priceSeasonality = await client.analysis.getPriceSeasonality('BBCA', {
  range: 12 // Number of months (max 60)
});
```

### 📋 Watchlists

```typescript
// Get all watchlists
const watchlists = await client.watchlists.list();

// Get watchlists by group
const bankingWatchlist = await client.watchlists.list('banking');

// Add stock to watchlist
await client.watchlists.add({
  code: 'BBCA',
  group: 'banking' // Optional
});

// Update watchlist
await client.watchlists.update('watchlist-id', {
  code: 'BBRI',
  group: 'banking'
});

// Update watchlist note
await client.watchlists.updateNote('watchlist-id', {
  note: 'Monitoring for potential entry'
});

// Create watchlist group
await client.watchlists.addGroup({
  name: 'Technology Stocks'
});

// Get watchlist groups
const groups = await client.watchlists.listGroups();

// Delete watchlist
await client.watchlists.delete({
  ids: ['watchlist-id-1', 'watchlist-id-2']
});
```

### 📖 Trading Journals

```typescript
// Add journal transaction
await client.journals.add({
  code: 'BBCA',
  price: 10000,
  volume: 100,
  date: '2024-12-30',
  type: 'buy', // 'buy' or 'sell'
  note: 'First entry'
});

// Get all journal transactions
const journals = await client.journals.list();

// Get journal summary
const summary = await client.journals.getSummary();

// Update journal note
await client.journals.updateNote('journal-id', {
  note: 'Updated notes'
});

// Extract journal from file (CSV, Excel, etc.)
const file = /* your File or Blob */;
const extracted = await client.journals.extractFromFile(file);

// Delete journal
await client.journals.delete({
  ids: ['journal-id-1', 'journal-id-2']
});
```

### 💼 Portfolios

```typescript
// Get all portfolios
const portfolios = await client.portfolios.list();

// Get portfolio summary
const portfolioSummary = await client.portfolios.getSummary();
```

### 🤖 AI Analysis

```typescript
// AI analysis of KSEI shareholder data
const kseiAnalysis = await client.ai.analyzeShareholderKSEI('BBCA');

// AI analysis of inventory chart
const inventoryAnalysis = await client.ai.analyzeInventoryChart('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  scope: 'vol',
  investor: 'all',
  limit: '5',
  market: 'RG',
  filter: ''
});

// AI analysis of stock news
const newsAnalysis = await client.ai.analyzeNews('BBCA');

// AI analysis of broker summary
const brokerAnalysis = await client.ai.analyzeBrokerSummary('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  investor: 'all',
  market: 'RG'
});

// AI analysis of insider trading
const insiderAnalysis = await client.ai.analyzeInsider({
  code: 'BBCA',
  name: '',
  from: '2024-12-01',
  to: '2024-12-30',
  page: '1',
  limit: '10'
});

// AI analysis of shareholders above 5%
const shareholderAnalysis = await client.ai.analyzeShareholderAbove({
  code: 'BBCA',
  broker: '',
  name: '',
  from: '2024-12-01',
  to: '2024-12-30',
  page: '1',
  limit: '10'
});
```

### 🔍 Search

```typescript
// Search stocks and users
const searchResults = await client.search.search('BBCA');

// Search stocks only
const stockResults = await client.search.searchStock('BBCA', {
  cursor: '' // Pagination cursor
});

// Search users only
const userResults = await client.search.searchUser('username', {
  cursor: ''
});
```

### 👤 Profile

```typescript
// Get user profile details
const profile = await client.profile.getUserDetails('username');

// Get user posts
const posts = await client.profile.getUserPosts('username', {
  page: '1',
  limit: '10'
});

// Get user posts by category
const categoryPosts = await client.profile.getCategoryPosts('username', 'analysis', {
  page: '1',
  limit: '10'
});

// Get user watchlist
const userWatchlist = await client.profile.getUserWatchlist('username');

// Get user followers
const followers = await client.profile.getFollowers('username');

// Get user following
const following = await client.profile.getFollowing('username');

// Get user memberships
const memberships = await client.profile.getMemberships('username');
```

### 💳 Membership

```typescript
// Get all memberships
const memberships = await client.membership.list();

// Get membership scopes
const scopes = await client.membership.getScope();

// Get membership transactions
const transactions = await client.membership.getTransactions();

// Add new membership
await client.membership.add({
  planId: 'plan-id',
  paymentMethod: 'credit-card'
});

// Update membership
await client.membership.update('membership-id', {
  planId: 'new-plan-id'
});

// Delete membership
await client.membership.delete('membership-id');
```

### 📝 Posts

```typescript
// Get all posts
const posts = await client.posts.getAll();

// Get posts by category
const categoryPosts = await client.posts.getByCategory('analysis');

// Get posts for a stock
const stockPosts = await client.posts.getStockPosts('BBCA');

// Get stock posts by category
const stockCategoryPosts = await client.posts.getStockCategoryPosts('BBCA', 'news');

// Get post details
const post = await client.posts.getPostById('post-id');

// Get post comments
const comments = await client.posts.getComments('post-id');

// Get liked posts
const likedPosts = await client.posts.getLiked();

// Get favorite posts
const favorites = await client.posts.getFavorites();

// Get post voters
const voters = await client.posts.getVoters('post-id');
```

### 💹 Trades

```typescript
// Get all realized trades
const trades = await client.trades.list();

// Get trades summary
const summary = await client.trades.getSummary();

// Get trades summary chart
const summaryChart = await client.trades.getSummaryChart();

// Update trade note
await client.trades.updateNote('trade-id', {
  note: 'Updated note'
});

// Delete trades
await client.trades.delete({
  ids: ['trade-id-1', 'trade-id-2']
});
```

### 🔎 Screener

```typescript
// Get preset screeners
const presets = await client.screener.list();

// Save preset screener
await client.screener.save({
  name: 'High Volume Stocks',
  conditions: {
    columns: ['volume', 'close'],
    conditions: [
      {
        ratio: 'BASIC',
        column: 'close',
        operator: '>=',
        value: '5000'
      }
    ]
  }
});

// Run screener
const results = await client.screener.screen({
  columns: ['volume', 'close', 'value'],
  conditions: [
    {
      ratio: 'BASIC',
      column: 'close',
      operator: '>=',
      value: '5000'
    },
    {
      ratio: 'COMPARE',
      column: 'value',
      compare: 'volume',
      operator: '>',
      multiply: 'x',
      value: '1'
    }
  ]
});
```

### 🏥 Health Checks

```typescript
// Check API status
const status = await client.health.check();

// Check database status
const dbStatus = await client.health.checkDatabase();

// Full health check (API + Database)
const fullStatus = await client.health.fullCheck();
```

### ⚠️ Error Handling

```typescript
import { Invezgo, InvezgoError } from '@invezgo/sdk';

const client = new Invezgo({ apiKey: 'your-api-key' });

try {
  const stock = await client.analysis.getInformation('INVALID');
} catch (error) {
  if (error instanceof InvezgoError) {
    console.error('API Error Status:', error.statusCode);
    console.error('Error Message:', error.message);
    console.error('Error Type:', error.error);
    console.error('Full Response:', error.response);
    
    // Handle specific error codes
    switch (error.statusCode) {
      case 401:
        console.error('Invalid API key');
        break;
      case 402:
        console.error('Subscription required');
        break;
      case 429:
        console.error('Rate limit exceeded');
        break;
      default:
        console.error('Unknown error');
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 📖 API Reference

### Analysis Endpoints

<details>
<summary>Click to expand Analysis methods</summary>

| Method | Description | Parameters |
|--------|-------------|-------------|
| `getStockList()` | Get all listed stocks | - |
| `getBrokerList()` | Get all brokers | - |
| `getInformation(code)` | Get company information | `code: string` |
| `getTopChange(date)` | Get top gainers/losers | `date: string` |
| `getTopForeign(date)` | Get top foreign accumulation/distribution | `date: string` |
| `getTopAccumulation(date)` | Get top bandarmologi accumulation/distribution | `date: string` |
| `getIntraday(code, params)` | Get intraday chart | `code`, `market: 'RG'\|'NG'\|'TN'` |
| `getOrderBook(code, params)` | Get order book | `code`, `market` |
| `getChart(code, params)` | Get stock chart | `code`, `from`, `to` |
| `getIndicatorChart(code, indicator, params)` | Get chart with indicator | `code`, `indicator`, `from`, `to` |
| `getShareholder(code)` | Get shareholder composition | `code` |
| `getShareholderDetail(code)` | Get shareholder detail | `code` |
| `getShareholderNumber(code)` | Get shareholder number | `code` |
| `getShareholderKSEI(code, params)` | Get KSEI shareholder data | `code`, `range` |
| `getBrokerSummaryStock(code, params)` | Get broker summary for stock | `code`, `from`, `to`, `investor`, `market` |
| `getBrokerSummaryBroker(code, params)` | Get broker summary for broker | `code`, `from`, `to`, `investor`, `market` |
| `getBrokerSummaryChartStock(code, params)` | Get broker summary chart for stock | `code`, `from`, `to`, `scope`, `market` |
| `getBrokerSummaryChartBroker(code, params)` | Get broker summary chart for broker | `code`, `from`, `to`, `scope`, `market` |
| `getInventoryChartStock(code, params)` | Get inventory chart for stock | `code`, `from`, `to`, `scope`, `investor`, `limit`, `market`, `filter?` |
| `getInventoryChartBroker(code, params)` | Get inventory chart for broker | `code`, `from`, `to`, `scope`, `investor`, `limit`, `market`, `filter?` |
| `getMomentumChart(code, params)` | Get momentum chart | `code`, `date`, `range`, `scope` |
| `getIntradayInventoryChart(code, params)` | Get intraday inventory chart | `code`, `range`, `type`, `total`, `buyer`, `seller`, `broker?`, `market` |
| `getSankeyChart(code, params)` | Get sankey/crossing chart | `code`, `type`, `buyer?`, `seller?`, `market` |
| `getPriceTable(code, params)` | Get price table | `code`, `date` |
| `getTimeTable(code, params)` | Get time table | `code`, `date`, `range` |
| `getPriceDiary(code)` | Get price diary | `code` |
| `getPriceSeasonality(code, params)` | Get price seasonality | `code`, `range` |
| `getShareholderAbove(params)` | Get shareholders above 5% | `from`, `to`, `page`, `limit`, `code?`, `name?`, `broker?` |
| `getInsider(params)` | Get insider trading | `from`, `to`, `page`, `limit`, `code?`, `name?` |
| `getFinancialStatement(code, params)` | Get financial statement | `code`, `statement`, `type`, `limit` |
| `getFinancialStatementChart(code, params)` | Get financial statement chart | `code`, `statement`, `type`, `limit`, `account` |
| `getKeyStat(code, params)` | Get key statistics | `code`, `type`, `limit` |
| `getKeyStatChart(code, params)` | Get key statistics chart | `code`, `type`, `limit`, `name` |

</details>

### TypeScript Types

The SDK exports comprehensive TypeScript types:

```typescript
import type {
  // Core types
  InvezgoConfig,
  ApiResponse,
  PaginatedResponse,
  
  // Stock & Broker types
  Stock,
  Broker,
  CompanyInformation,
  
  // Chart types
  ChartResponse,
  IntradayChartData,
  OrderBookResponse,
  InventoryChartResponse,
  MomentumChartData,
  
  // Shareholder types
  ShareholderComposition,
  ShareholderDetail,
  ShareholderKSEI,
  ShareholderAbove5,
  InsiderTransaction,
  
  // Broker analysis types
  BrokerSummary,
  SummaryChartItem,
  
  // Financial types
  FinancialStatementResponse,
  KeyStatResponse,
  
  // Price data types
  PriceTableData,
  TimeTableData,
  PriceDiaryData,
  
  // Parameter types
  DateRangeParams,
  InvestorType,      // 'all' | 'f' | 'd'
  MarketType,        // 'RG' | 'NG' | 'TN' | 'ALL'
  ScopeType,         // 'volume' | 'value' | 'freq'
  StatementType,     // 'BS' | 'IS' | 'CF'
  PeriodType,        // 'FY' | 'Q' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
  IndicatorType,     // 'bdm' | 'rsi' | 'macd' | string
} from '@invezgo/sdk';
```

## 🔧 Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | `string` | ✅ Yes | - | Your Invezgo API key |
| `baseURL` | `string` | ❌ No | `https://api.invezgo.com` | API base URL |
| `timeout` | `number` | ❌ No | `30000` | Request timeout in milliseconds |

## 🌐 Browser Support

The SDK uses the native `fetch` API, which is available in:

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Node.js 18+ (native fetch)
- ⚠️ Node.js 14-17 (requires polyfill)
- ⚠️ Older browsers (requires polyfill)

### Node.js 14-17 Polyfill

```bash
npm install node-fetch
```

```typescript
import fetch from 'node-fetch';
(global as any).fetch = fetch;

import Invezgo from '@invezgo/sdk';
```

### Browser Polyfill

```bash
npm install whatwg-fetch
```

```typescript
import 'whatwg-fetch';
import Invezgo from '@invezgo/sdk';
```

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** in production:

```typescript
const client = new Invezgo({
  apiKey: process.env.INVEZGO_API_KEY!
});
```

3. **Keep API keys secure** - Don't expose them in client-side code
4. **Use different keys** for development and production
5. **Rotate keys regularly** for better security

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- 🌐 [Invezgo Website](https://invezgo.com)
- 📚 [API Documentation](https://api.invezgo.com)
- 🔑 [Get API Key](https://invezgo.com/id/setting/api)
- 💳 [Subscription Plans](https://invezgo.com/subscription)
- 📋 [Terms of Service](https://invezgo.com/terms)
- 🔒 [Privacy Policy](https://invezgo.com/privacy-policy)

## 💬 Support

For support, please contact:

- 📧 Email: admin@invezgo.com
- 🌐 Website: https://invezgo.com
- 🐛 Issues: [GitHub Issues](https://github.com/invezgo/invezgo-sdk-javascript/issues)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

Made with ❤️ by the [Invezgo](https://invezgo.com) team

**Empowering investors with better data and insights**

[⭐ Star us on GitHub](https://github.com/invezgo/invezgo-sdk-javascript)

</div>
