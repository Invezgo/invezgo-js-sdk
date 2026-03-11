# Examples

## Setup

```ts
import Invezgo from '@invezgo/sdk';

const client = new Invezgo({
  apiKey: process.env.INVEZGO_API_KEY!,
});
```

## Alerts

```ts
await client.alerts.add({
  name: 'Momentum breakout',
  formula: 'close > ema(20) and rsi > 60',
  category: ['COMPOSITE'],
  every: 'END_OF_DAY',
  send: 'IN_OUT',
});

const alerts = await client.alerts.list();
await client.alerts.test({
  formula: 'close > ema(20)',
  category: ['IDXFINANCE'],
});
```

## Analysis

```ts
const indexes = await client.analysis.getIndexList();

const topRetail = await client.analysis.getTopRitel('2026-03-10');

const stockIntraday = await client.analysis.getIntradayData('BBCA', 'RG');
const indexIntraday = await client.analysis.getIntradayIndex('COMPOSITE', 'RG');

const relation = await client.analysis.getShareholderRelation({
  code: 'BBCA',
  depth: 2,
  max_nodes: 50,
});

const calendar = await client.analysis.getCorporateActionCalendar({
  page: 1,
  limit: 10,
});
```

## Watchlists

```ts
await client.watchlists.add({
  group: 'swing',
  code: 'BBRI',
  price: 4500,
  scope: ['private'],
});

await client.watchlists.addGroup({ name: 'Dividend' });
await client.watchlists.updateGroup('group-id', { name: 'Value Plays' });
await client.watchlists.deleteGroup('group-id');
```

## Journals

```ts
await client.journals.add({
  code: 'BBCA',
  broker: 'AK',
  date: '2026-03-10',
  lot: 5,
  fee: 12000,
  price: 9050,
  status: 'BUY',
  scope: ['private'],
  note: 'Starter position',
});

const journalSummary = await client.journals.getSummary();
```

## Screener

```ts
await client.screener.save({
  name: 'Above EMA20',
  formula: 'close > ema(20)',
  category: ['COMPOSITE'],
});

const results = await client.screener.screen({
  formula: 'close > ema(20) and volume > sma(volume, 20)',
  category: ['COMPOSITE', 'IDXENERGY'],
});
```

## Recommendation

```ts
const recommendations = await client.recommendation.getUserRecommendations();
```
