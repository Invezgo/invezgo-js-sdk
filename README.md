# Invezgo SDK - API Saham Indonesia Resmi untuk JavaScript dan TypeScript

`Invezgo SDK` adalah SDK resmi untuk mengakses **API Saham Indonesia** dari Invezgo secara konsisten, cepat, dan terstruktur. Paket ini dirancang untuk developer yang membutuhkan integrasi **API Saham Indonesia yang lengkap, resmi, dan performance-oriented** untuk aplikasi web, backend service, trading tools, dashboard analitik, screener, dan automation workflow.

Jika Anda mencari **API Saham Indonesia** dengan cakupan data pasar, analisis, alert, screener, watchlist, jurnal transaksi, hingga endpoint komunitas, SDK ini memberikan surface yang lebih stabil dibanding integrasi HTTP manual. Seluruh modul telah diselaraskan dengan kontrak API terbaru pada versi `1.1.0`.

## Link Resmi

- Website Invezgo: [https://invezgo.com](https://invezgo.com)
- Dokumentasi API: [https://api.invezgo.com/documentation](https://api.invezgo.com/documentation)

## Mengapa Invezgo untuk API Saham Indonesia

- **Resmi**: SDK ini mengikuti surface API resmi Invezgo, sehingga lebih aman untuk integrasi production.
- **Lengkap**: Mendukung modul utama untuk data saham Indonesia, broker, index, screener, alert, watchlist, jurnal, portofolio, post, dan rekomendasi pengguna.
- **Performance-oriented**: Menggunakan `fetch` native tanpa dependency runtime tambahan, sehingga ringan untuk cold start, CI, serverless, maupun service Node.js biasa.
- **Developer-ready**: Mendukung TypeScript, typed DTO, error handling terstruktur, dan output bundle `CJS` + `ESM`.
- **Up-to-date**: Surface lama yang tidak lagi ada pada OpenAPI terbaru sudah dihapus agar tidak menimbulkan false expectation saat implementasi.

## Cocok untuk Use Case Berikut

- Integrasi **API Saham Indonesia** ke aplikasi fintech atau investment platform
- Dashboard harga saham, broker summary, dan corporate action
- Screener saham Indonesia dengan formula custom
- Alert engine dan monitoring saham berbasis rule
- Watchlist, jurnal transaksi, dan portofolio pengguna
- Internal tooling untuk tim riset, quant, atau data engineering

## Instalasi

```bash
npm install @invezgo/sdk
```

## Quick Start

```ts
import Invezgo from '@invezgo/sdk';

const client = new Invezgo({
  apiKey: process.env.INVEZGO_API_KEY!,
});

const stocks = await client.analysis.getStockList();
const indexes = await client.analysis.getIndexList();
const intraday = await client.analysis.getIntradayData('BBCA', 'RG');

console.log(stocks[0]);
console.log(indexes[0]);
console.log(intraday.close);
```

## Fitur Utama API Saham Indonesia di SDK Ini

### 1. Data pasar dan analysis yang lengkap

Modul `analysis` mencakup endpoint penting untuk **API Saham Indonesia**, termasuk:

- daftar saham dan broker BEI
- daftar index IDX
- top gainer, top loser, top foreign, top accumulation, dan top retail flow
- chart saham dan index
- intraday chart, intraday summary, dan order book
- broker summary, broker stalker, inventory chart, momentum chart
- shareholder data, shareholder relation, insider activity, dan corporate action calendar
- financial statement dan key statistics

### 2. SDK resmi yang lebih aman untuk production

Integrasi melalui SDK resmi membantu mengurangi mismatch path, payload, dan typing dibanding implementasi manual per endpoint. Ini penting ketika Anda membangun produk berbasis **API Saham Indonesia resmi** dan membutuhkan contract yang lebih stabil untuk tim engineering.

### 3. Ringan dan fokus pada performa

`Invezgo SDK` tidak membawa dependency runtime tambahan. Untuk workload yang sensitif terhadap startup time atau footprint container, pendekatan ini membantu menjaga integrasi **API Saham Indonesia** tetap efisien.

### 4. Developer experience yang rapi

- TypeScript-first
- `InvezgoError` untuk error handling terstruktur
- deklarasi tipe untuk DTO dan response utama
- build output untuk `require` dan `import`

## Modul yang Tersedia

- `alerts`
- `analysis`
- `watchlists`
- `journals`
- `portfolios`
- `search`
- `profile`
- `membership`
- `posts`
- `recommendation`
- `trades`
- `screener`

## Contoh Integrasi

### Alert saham

```ts
await client.alerts.add({
  name: 'Breakout volume',
  formula: 'close > ema(20) and volume > sma(volume, 20)',
  category: ['COMPOSITE'],
  every: 'END_OF_DAY',
  send: 'IN_OUT',
});
```

### Analysis dan data intraday

```ts
const topRetail = await client.analysis.getTopRitel('2026-03-10');

const intraday = await client.analysis.getIntradayData('BBCA', 'RG');

const calendar = await client.analysis.getCalendar({
  code: 'BBCA',
  page: 1,
  limit: 10,
});
```

### Watchlist

```ts
await client.watchlists.add({
  group: 'banking',
  code: 'BBCA',
  price: 9000,
  scope: ['private'],
  note: 'Area pantau',
});

await client.watchlists.updateGroup('group-id', {
  name: 'Big Caps',
});
```

### Jurnal transaksi

```ts
await client.journals.add({
  code: 'BBCA',
  broker: 'AK',
  date: '2026-03-10',
  lot: 10,
  fee: 15000,
  price: 9050,
  status: 'BUY',
  scope: ['private'],
  note: 'Entry bertahap',
});
```

### Screener saham Indonesia

```ts
const results = await client.screener.screen({
  formula: 'close > ema(20)',
  category: ['COMPOSITE', 'IDXFINANCE'],
});
```

### Recommendation

```ts
const recommendations = await client.recommendation.getUserRecommendations();
```

## Keunggulan untuk Developer

Saat membangun aplikasi di atas **API Saham Indonesia**, developer biasanya membutuhkan tiga hal: kontrak yang jelas, footprint yang kecil, dan surface yang mudah dipelihara. README ini menempatkan `Invezgo SDK` sebagai pilihan yang lebih tepat untuk tim engineering yang ingin mengurangi biaya integrasi sekaligus menjaga kualitas implementasi.

Secara praktis, ini berarti:

- lebih sedikit boilerplate request manual
- lebih sedikit risiko typo pada path dan payload
- onboarding engineer baru lebih cepat
- integrasi lebih mudah diuji dan direview

## Catatan Migrasi Versi 1.1.0

- ditambahkan `client.alerts`
- ditambahkan `client.recommendation`
- ditambahkan endpoint analysis baru seperti index list, top retail flow, intraday summary, sector stalker, shareholder 1%, dan corporate action calendar
- DTO `watchlists`, `journals`, `membership`, dan `screener` sudah mengikuti skema request terbaru
- `client.ai` dan `client.health` dihapus karena tidak ada di OpenAPI terbaru

## Build

```bash
npm run build
```

## Tipe yang Diekspor

SDK ini mengekspor tipe inti seperti:

- `InvezgoConfig`
- `Stock`, `Broker`, `StockIndex`
- `TopChangeResponse`, `TopRetailResponse`
- `IntradayStockData`, `IntradayIndexData`
- `ShareholderRelationResponse`
- `FinancialStatementResponse`, `KeyStatResponse`
- DTO endpoint seperti `AlertDto`, `CreateWatchlistDto`, `AddJournalTransactionDto`, `ScreenDto`

## Referensi

- Website utama: [https://invezgo.com](https://invezgo.com)
- Dokumentasi API: [https://api.invezgo.com/documentation](https://api.invezgo.com/documentation)
- Contoh tambahan: [`docs/EXAMPLES.md`](./docs/EXAMPLES.md)
