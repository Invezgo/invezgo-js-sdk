<div align="center">

# 📈 Invezgo SDK - API Saham Indonesia Resmi untuk JavaScript & TypeScript

![API Saham Indonesia](https://img.shields.io/badge/API%20Saham%20Indonesia-Lengkap-blue)
![Official SDK](https://img.shields.io/badge/SDK-Resmi-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6)
![Node](https://img.shields.io/badge/Node-%3E%3D14-brightgreen)

**SDK resmi untuk integrasi API Saham Indonesia yang lengkap, resmi, dan performance-oriented.**

Dirancang untuk developer yang membangun aplikasi saham, dashboard analitik, screener, alert engine, watchlist, jurnal transaksi, dan backend service yang membutuhkan akses stabil ke **API Saham Indonesia** dari Invezgo.

[🌐 Website Invezgo](https://invezgo.com) • [📚 Dokumentasi API](https://api.invezgo.com/documentation)

</div>

---

## 🚀 Mengapa Invezgo untuk API Saham Indonesia

Jika Anda mencari **API Saham Indonesia** yang siap dipakai untuk production, `@invezgo/sdk` memberikan surface integrasi yang lebih rapi dibanding request manual. SDK ini dibuat untuk mempermudah integrasi **API Saham Indonesia resmi** ke aplikasi JavaScript dan TypeScript dengan kontrak yang konsisten, typing yang jelas, dan footprint runtime yang ringan.

Keunggulan utamanya:

- ✅ **Resmi**: mengikuti surface API resmi Invezgo
- ✅ **Lengkap**: mencakup data saham, broker, index, screener, alert, watchlist, jurnal, portofolio, post, dan recommendation
- ✅ **Cepat dan ringan**: memakai `fetch` native tanpa dependency runtime tambahan
- ✅ **Developer-first**: mendukung TypeScript, DTO terstruktur, `CJS`, `ESM`, dan error handling yang jelas
- ✅ **Production-ready**: cocok untuk backend service, internal tools, fintech product, dan dashboard monitoring

---

## 🎯 Cocok untuk Use Case Berikut

- 📊 Dashboard berbasis **API Saham Indonesia**
- 🤖 Screener saham Indonesia dengan formula custom
- 🔔 Alert saham dan monitoring market behavior
- 🧾 Jurnal transaksi dan manajemen watchlist
- 💼 Portofolio dan personal investment tools
- 🏗️ Backend integration untuk aplikasi fintech dan wealth platform
- 🧠 Research tooling untuk quant, trader, dan analis

---

## 📦 Instalasi

```bash
npm install @invezgo/sdk
```

---

## 🛒 Cara Mulai dan Berlangganan

Sebelum menggunakan SDK ini, Anda perlu memiliki akses aktif ke **API Saham Indonesia** dari Invezgo.

### 1. Pilih paket langganan API

Kunjungi halaman resmi API Saham Indonesia Invezgo untuk melihat paket yang tersedia dan memilih plan yang sesuai dengan kebutuhan aplikasi Anda:

- Paket API Saham Indonesia: [https://invezgo.com/id/data-api-saham-indonesia](https://invezgo.com/id/data-api-saham-indonesia)

### 2. Login ke akun Invezgo

Setelah memilih paket, login ke akun Invezgo Anda melalui website utama:

- Website Invezgo: [https://invezgo.com](https://invezgo.com)

### 3. Generate API key

Setelah langganan aktif, generate API key dari dashboard akun Invezgo Anda. API key inilah yang akan dipakai untuk autentikasi semua request ke **API Saham Indonesia**.

### 4. Install SDK

Install package JavaScript/TypeScript resmi:

```bash
npm install @invezgo/sdk
```

### 5. Simpan API key di environment variable

Contoh yang direkomendasikan:

```bash
INVEZGO_API_KEY=your_api_key_here
```

### 6. Mulai integrasi

Gunakan API key tersebut untuk mengakses endpoint Invezgo melalui SDK:

```ts
import Invezgo from '@invezgo/sdk';

const client = new Invezgo({
  apiKey: process.env.INVEZGO_API_KEY!,
});
```

---

## ⚡ Quick Start

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

---

## 🧩 Fitur Utama API Saham Indonesia di SDK Ini

### 📈 Data pasar dan analysis yang lengkap

Modul `analysis` mencakup endpoint penting untuk **API Saham Indonesia**, termasuk:

- daftar saham dan broker BEI
- daftar index IDX
- top gainer, top loser, top foreign, top accumulation, dan top retail flow
- chart saham dan index
- intraday chart, intraday summary, dan order book
- broker summary, broker stalker, inventory chart, momentum chart
- shareholder data, shareholder relation, insider activity, dan corporate action calendar
- financial statement dan key statistics

### 🛡️ SDK resmi yang lebih aman untuk production

Menggunakan SDK resmi membantu mengurangi mismatch pada path, query params, payload, dan struktur response. Untuk tim yang membangun produk berbasis **API Saham Indonesia resmi**, pendekatan ini membuat proses development dan maintenance lebih efisien.

### ⚙️ Ringan dan fokus pada performa

`Invezgo SDK` tidak membawa dependency runtime tambahan. Ini relevan untuk aplikasi yang sensitif terhadap startup time, cold start, footprint container, atau deployment serverless.

### 👨‍💻 Developer experience yang rapi

- TypeScript-first
- `InvezgoError` untuk error handling terstruktur
- deklarasi tipe untuk DTO dan response utama
- output build untuk `require` dan `import`

---

## 🗂️ Modul yang Tersedia

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

---

## 💡 Contoh Integrasi API Saham Indonesia

### 🔔 Alert saham

```ts
await client.alerts.add({
  name: 'Breakout volume',
  formula: 'close > ema(20) and volume > sma(volume, 20)',
  category: ['COMPOSITE'],
  every: 'END_OF_DAY',
  send: 'IN_OUT',
});
```

### 📊 Analysis dan data intraday

```ts
const topRetail = await client.analysis.getTopRitel('2026-03-10');

const intraday = await client.analysis.getIntradayData('BBCA', 'RG');

const calendar = await client.analysis.getCalendar({
  code: 'BBCA',
  page: 1,
  limit: 10,
});
```

### 👀 Watchlist

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

### 🧾 Jurnal transaksi

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

### 🔎 Screener saham Indonesia

```ts
const results = await client.screener.screen({
  formula: 'close > ema(20)',
  category: ['COMPOSITE', 'IDXFINANCE'],
});
```

### 🤝 Recommendation

```ts
const recommendations = await client.recommendation.getUserRecommendations();
```

---

## 🏗️ Keunggulan untuk Tim Developer

Saat membangun aplikasi di atas **API Saham Indonesia**, tim engineering biasanya membutuhkan kontrak yang jelas, integrasi yang ringan, dan surface yang mudah dipelihara. `Invezgo SDK` membantu menyederhanakan proses tersebut sehingga tim dapat fokus pada logic produk, bukan pada detail HTTP request yang berulang.

Secara praktis, manfaatnya:

- mengurangi boilerplate request manual
- mengurangi risiko typo pada endpoint dan payload
- mempercepat onboarding engineer baru
- mempermudah review, testing, dan maintenance

---

## 🔄 Catatan Migrasi Versi 1.1.0

- ditambahkan `client.alerts`
- ditambahkan `client.recommendation`
- ditambahkan endpoint analysis baru seperti index list, top retail flow, intraday summary, sector stalker, shareholder 1%, dan corporate action calendar
- DTO `watchlists`, `journals`, `membership`, dan `screener` sudah mengikuti skema request terbaru
- `client.ai` dan `client.health` dihapus karena tidak lagi tersedia pada kontrak API terbaru

---

## 🛠️ Build

```bash
npm run build
```

---

## 🧠 Tipe yang Diekspor

SDK ini mengekspor tipe inti seperti:

- `InvezgoConfig`
- `Stock`, `Broker`, `StockIndex`
- `TopChangeResponse`, `TopRetailResponse`
- `IntradayStockData`, `IntradayIndexData`
- `ShareholderRelationResponse`
- `FinancialStatementResponse`, `KeyStatResponse`
- DTO endpoint seperti `AlertDto`, `CreateWatchlistDto`, `AddJournalTransactionDto`, `ScreenDto`

---

## 🔗 Referensi

- 🌐 Website utama: [https://invezgo.com](https://invezgo.com)
- 📚 Dokumentasi API: [https://api.invezgo.com/documentation](https://api.invezgo.com/documentation)
- 🧪 Contoh tambahan: [`docs/EXAMPLES.md`](./docs/EXAMPLES.md)
