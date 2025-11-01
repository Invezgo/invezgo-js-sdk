# Invezgo SDK Examples

Kumpulan contoh penggunaan Invezgo SDK untuk berbagai use case.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Stock Analysis](#stock-analysis)
3. [Chart Visualization](#chart-visualization)
4. [Financial Analysis](#financial-analysis)
5. [Broker Analysis](#broker-analysis)
6. [Shareholder Analysis](#shareholder-analysis)
7. [Watchlist Management](#watchlist-management)
8. [Trading Journal](#trading-journal)
9. [AI Analysis](#ai-analysis)
10. [Stock Screening](#stock-screening)

## Basic Setup

```typescript
import Invezgo from '@invezgo/sdk';

// Initialize the client
const client = new Invezgo({
  apiKey: process.env.INVEZGO_API_KEY!,
  baseURL: 'https://api.invezgo.com', // Optional
  timeout: 30000 // Optional, in milliseconds
});
```

## Stock Analysis

### Get All Stocks

```typescript
const stocks = await client.analysis.getStockList();
console.log(`Total stocks: ${stocks.length}`);

// Filter stocks
const bankStocks = stocks.filter(stock => 
  stock.name.toLowerCase().includes('bank')
);
```

### Get Company Information

```typescript
const company = await client.analysis.getInformation('BBCA');
console.log({
  name: company.name,
  sector: company.sector,
  industry: company.industry,
  listingDate: company.listing_date,
  website: company.website,
  directors: company.director,
  commissioners: company.commissioner
});
```

### Top Gainers and Losers

```typescript
const today = new Date().toISOString().split('T')[0];
const topChange = await client.analysis.getTopChange(today);

console.log('Top 5 Gainers:');
topChange.gain.slice(0, 5).forEach((stock, index) => {
  console.log(`${index + 1}. ${stock.code} - ${stock.name}: +${stock.change}%`);
});

console.log('Top 5 Losers:');
topChange.loss.slice(0, 5).forEach((stock, index) => {
  console.log(`${index + 1}. ${stock.code} - ${stock.name}: ${stock.change}%`);
});
```

## Chart Visualization

### Basic Stock Chart

```typescript
const chart = await client.analysis.getChart('BBCA', {
  from: '2024-01-01',
  to: '2024-12-30'
});

// Use with charting library (e.g., Chart.js, Recharts, etc.)
const chartData = chart.price.map(point => ({
  date: point.date,
  open: point.open,
  high: point.high,
  low: point.low,
  close: point.close,
  volume: point.volume
}));
```

### Chart with Technical Indicator

```typescript
// RSI Indicator
const rsiChart = await client.analysis.getIndicatorChart('BBCA', 'rsi', {
  from: '2024-01-01',
  to: '2024-12-30'
});

// MACD Indicator
const macdChart = await client.analysis.getIndicatorChart('BBCA', 'macd', {
  from: '2024-01-01',
  to: '2024-12-30'
});

// BDM Indicator
const bdmChart = await client.analysis.getIndicatorChart('BBCA', 'bdm', {
  from: '2024-01-01',
  to: '2024-12-30'
});
```

### Intraday Chart

```typescript
const intraday = await client.analysis.getIntraday('BBCA', {
  market: 'RG' // Reguler market
});

// Real-time intraday data
intraday.forEach(candle => {
  console.log(`${candle.date}: O=${candle.open}, H=${candle.high}, L=${candle.low}, C=${candle.close}, V=${candle.volume}`);
});
```

## Financial Analysis

### Balance Sheet Analysis

```typescript
const balanceSheet = await client.analysis.getFinancialStatement('BBCA', {
  statement: 'BS', // Balance Sheet
  type: 'Q',       // Quarterly
  limit: 8         // Last 8 quarters
});

// Find total assets
const totalAssetsRow = balanceSheet.rows.find(row => 
  row.name.toLowerCase().includes('total assets') ||
  row.name.toLowerCase().includes('total aktiva')
);

if (totalAssetsRow) {
  console.log('Total Assets over quarters:');
  totalAssetsRow.values.forEach(val => {
    console.log(`${val.col}: ${val.amount.toLocaleString('id-ID')}`);
  });
}
```

### Income Statement Analysis

```typescript
const incomeStatement = await client.analysis.getFinancialStatement('BBCA', {
  statement: 'IS', // Income Statement
  type: 'FY',     // Annual
  limit: 5         // Last 5 years
});

// Calculate revenue growth
const revenues = incomeStatement.rows
  .find(row => row.name.toLowerCase().includes('revenue') || 
               row.name.toLowerCase().includes('pendapatan'))
  ?.values || [];

if (revenues.length >= 2) {
  const currentYear = revenues[0].amount;
  const previousYear = revenues[1].amount;
  const growth = ((currentYear - previousYear) / previousYear) * 100;
  console.log(`Revenue Growth: ${growth.toFixed(2)}%`);
}
```

### Key Statistics

```typescript
const keyStat = await client.analysis.getKeyStat('BBCA', {
  type: 'Q',
  limit: 4
});

// Find PER (Price to Earnings Ratio)
const perRow = keyStat.rows.find(row => 
  row.name.toLowerCase().includes('per') ||
  row.name.toLowerCase().includes('price to earnings')
);

if (perRow) {
  console.log('PER over quarters:');
  perRow.values.forEach(val => {
    console.log(`${val.col}: ${val.amount}`);
  });
}
```

## Broker Analysis

### Broker Summary for Stock

```typescript
const brokerSummary = await client.analysis.getBrokerSummaryStock('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  investor: 'all',
  market: 'RG'
});

// Sort by buy volume
const sortedBrokers = brokerSummary.sort((a, b) => 
  parseInt(b.buy_volume) - parseInt(a.buy_volume)
);

console.log('Top 5 Brokers by Buy Volume:');
sortedBrokers.slice(0, 5).forEach((broker, index) => {
  console.log(`${index + 1}. ${broker.code}: Buy ${broker.buy_volume}, Sell ${broker.sell_volume}`);
});
```

### Inventory Chart

```typescript
const inventoryChart = await client.analysis.getInventoryChartStock('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  scope: 'vol',
  investor: 'all',
  limit: 5,
  market: 'RG'
});

// Visualize broker accumulation/distribution
inventoryChart.broker.forEach(broker => {
  const totalValue = broker.data.reduce((sum, point) => sum + point.value, 0);
  const isAccumulating = totalValue > 0;
  console.log(`${broker.broker}: ${isAccumulating ? 'Accumulating' : 'Distributing'} - Total: ${totalValue}`);
});
```

## Shareholder Analysis

### Shareholder Composition

```typescript
const shareholders = await client.analysis.getShareholder('BBCA');

// Find controlling shareholder
const controlling = shareholders.find(sh => 
  sh.badge.includes('PENGENDALI')
);

console.log('Controlling Shareholder:', controlling);

// Calculate public float
const publicFloat = shareholders
  .filter(sh => sh.badge === '{}' || sh.name.includes('Masyarakat'))
  .reduce((sum, sh) => sum + sh.percentage, 0);

console.log(`Public Float: ${publicFloat.toFixed(2)}%`);
```

### Insider Trading

```typescript
const insiderTrades = await client.analysis.getInsider({
  from: '2024-12-01',
  to: '2024-12-30',
  page: 1,
  limit: 20,
  code: 'BBCA'
});

console.log('Insider Transactions:');
insiderTrades.data.forEach(trade => {
  console.log(`${trade.name} (${trade.badge}): ${trade.change > 0 ? '+' : ''}${trade.change}%`);
});
```

### KSEI Shareholder Classification

```typescript
const kseiData = await client.analysis.getShareholderKSEI('BBCA', {
  range: 6 // Last 6 months
});

// Calculate foreign vs domestic ownership
const latest = kseiData[0];
const totalForeign = Object.keys(latest)
  .filter(key => key.startsWith('foreign_'))
  .reduce((sum, key) => sum + parseInt(latest[key] || '0'), 0);

const totalDomestic = Object.keys(latest)
  .filter(key => key.startsWith('local_'))
  .reduce((sum, key) => sum + parseInt(latest[key] || '0'), 0);

console.log(`Foreign: ${totalForeign.toLocaleString()}`);
console.log(`Domestic: ${totalDomestic.toLocaleString()}`);
```

## Watchlist Management

### Complete Watchlist Workflow

```typescript
// Create watchlist group
await client.watchlists.addGroup({
  name: 'Blue Chip Stocks'
});

// Get groups
const groups = await client.watchlists.listGroups();

// Add stocks to watchlist
const blueChipStocks = ['BBCA', 'BBRI', 'BMRI', 'TLKM', 'EXCL'];
for (const code of blueChipStocks) {
  await client.watchlists.add({
    code,
    group: 'Blue Chip Stocks'
  });
}

// Get watchlist
const watchlist = await client.watchlists.list('Blue Chip Stocks');
console.log('Watchlist:', watchlist);

// Update note
await client.watchlists.updateNote(watchlist[0].id, {
  note: 'Monitoring for dividend announcement'
});
```

## Trading Journal

### Journal Management

```typescript
// Add buy transaction
await client.journals.add({
  code: 'BBCA',
  price: 10000,
  volume: 100,
  date: '2024-12-30',
  type: 'buy',
  note: 'Entry based on technical analysis'
});

// Add sell transaction
await client.journals.add({
  code: 'BBCA',
  price: 10500,
  volume: 100,
  date: '2024-12-31',
  type: 'sell',
  note: 'Profit taking at resistance level'
});

// Get journal summary
const summary = await client.journals.getSummary();
console.log('Journal Summary:', summary);

// List all journals
const journals = await client.journals.list();
console.log('All Journals:', journals);
```

## AI Analysis

### AI-Powered Analysis

```typescript
// AI analysis of KSEI data
const kseiAnalysis = await client.ai.analyzeShareholderKSEI('BBCA');
console.log('AI KSEI Analysis:', kseiAnalysis);

// AI analysis of broker summary
const brokerAnalysis = await client.ai.analyzeBrokerSummary('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  investor: 'all',
  market: 'RG'
});
console.log('AI Broker Analysis:', brokerAnalysis);

// AI analysis of news
const newsAnalysis = await client.ai.analyzeNews('BBCA');
console.log('AI News Analysis:', newsAnalysis);
```

## Stock Screening

### Advanced Screener

```typescript
// Screen for high volume stocks
const results = await client.screener.screen({
  columns: ['volume', 'close', 'value', 'change'],
  conditions: [
    {
      ratio: 'BASIC',
      column: 'close',
      operator: '>=',
      value: '5000'
    },
    {
      ratio: 'BASIC',
      column: 'volume',
      operator: '>=',
      value: '10000000'
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

console.log(`Found ${results.length} stocks matching criteria`);
results.forEach(stock => {
  console.log(`${stock.code}: Close=${stock.close}, Volume=${stock.value}`);
});
```

### Save and Reuse Screener

```typescript
// Save preset
await client.screener.save({
  name: 'High Volume Blue Chips',
  conditions: {
    columns: ['volume', 'close'],
    conditions: [
      {
        ratio: 'BASIC',
        column: 'close',
        operator: '>=',
        value: '5000'
      },
      {
        ratio: 'BASIC',
        column: 'volume',
        operator: '>=',
        value: '10000000'
      }
    ]
  }
});

// Get saved presets
const presets = await client.screener.list();
console.log('Saved Presets:', presets);
```

## Error Handling Pattern

```typescript
import { Invezgo, InvezgoError } from '@invezgo/sdk';

async function safeApiCall() {
  try {
    const data = await client.analysis.getInformation('BBCA');
    return data;
  } catch (error) {
    if (error instanceof InvezgoError) {
      switch (error.statusCode) {
        case 401:
          console.error('Authentication failed. Check your API key.');
          break;
        case 402:
          console.error('Subscription required.');
          break;
        case 429:
          console.error('Rate limit exceeded. Please wait.');
          break;
        case 404:
          console.error('Resource not found.');
          break;
        default:
          console.error(`API Error: ${error.message}`);
      }
      throw error;
    }
    throw error;
  }
}
```

## Batch Operations

```typescript
// Get information for multiple stocks
async function getMultipleStockInfo(codes: string[]) {
  const results = await Promise.allSettled(
    codes.map(code => client.analysis.getInformation(code))
  );
  
  return results.map((result, index) => ({
    code: codes[index],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
}

const stockInfos = await getMultipleStockInfo(['BBCA', 'BBRI', 'BMRI']);
stockInfos.forEach(info => {
  if (info.success) {
    console.log(`${info.code}: ${info.data.name}`);
  } else {
    console.error(`${info.code}: Error - ${info.error.message}`);
  }
});
```
