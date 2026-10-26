# Invezgo JavaScript & TypeScript SDK

[![npm](https://img.shields.io/npm/v/@invezgo/sdk.svg)](https://www.npmjs.com/package/@invezgo/sdk)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

SDK resmi untuk [Invezgo API](https://invezgo.com), penyedia data pasar modal Indonesia (BEI/IDX). SDK ini menyediakan akses bertipe ke seluruh endpoint Invezgo API, dilengkapi cache in-memory dan rotasi API key otomatis.

[Dokumentasi API](https://api.invezgo.com/documentation) · [Referensi SDK](docs/API.md) · [Changelog](CHANGELOG.md)

## Daftar Isi

- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Konfigurasi](#konfigurasi)
- [Memanggil Endpoint](#memanggil-endpoint)
- [Tipe Data](#tipe-data)
- [Caching](#caching)
- [Rotasi API Key](#rotasi-api-key)
- [Penanganan Error](#penanganan-error)
- [Pagination](#pagination)
- [Praktik yang Disarankan](#praktik-yang-disarankan)
- [Pengembangan](#pengembangan)
- [Dukungan](#dukungan)
- [Lisensi](#lisensi)

## Persyaratan

- Node.js 18 atau lebih baru (menggunakan `fetch` bawaan)
- API key Invezgo, dapat dibuat di [halaman pengaturan API](https://invezgo.com/id/setting/api)

SDK ini tidak memiliki dependency runtime dan mendukung ESM maupun CommonJS.

## Instalasi

```bash
npm install @invezgo/sdk
```

## Penggunaan

```ts
import { Invezgo } from '@invezgo/sdk';

const client = new Invezgo({ apiKey: process.env.INVEZGO_API_KEY! });

const stocks = await client.analysis.getStockList();
const info = await client.analysis.getInformation('BBCA');
const top = await client.analysis.getTopChange({ date: '2024-12-30' });

console.log(top.gain[0].code, top.gain[0].change);
```

CommonJS:

```js
const { Invezgo } = require('@invezgo/sdk');

const client = new Invezgo({ apiKey: process.env.INVEZGO_API_KEY });
```

> **Penting:** gunakan SDK ini dari sisi server. Jangan menyertakan API key pada aplikasi browser atau mobile.

## Konfigurasi

```ts
const client = new Invezgo({
  apiKey: process.env.INVEZGO_API_KEY!,
  additionalApiKeys: [process.env.INVEZGO_API_KEY_2!],
  timeout: 30_000,
  cache: { ttl: 60, realtimeTtl: 5 },
});
```

| Opsi | Tipe | Default | Keterangan |
|---|---|---|---|
| `apiKey` | `string` | wajib | API key utama. |
| `additionalApiKeys` | `string[]` | `[]` | API key cadangan, digunakan saat terjadi `429`. Lihat [Rotasi API Key](#rotasi-api-key). |
| `baseUrl` | `string` | `https://api.invezgo.com` | Base URL API. |
| `timeout` | `number` | `30000` | Timeout per request, dalam milidetik. |
| `cache` | `boolean \| CacheOptions` | `true` | Konfigurasi cache. `false` untuk menonaktifkan. |
| `cache.ttl` | `number` | `60` | TTL endpoint reguler, dalam detik. |
| `cache.realtimeTtl` | `number` | `5` | TTL endpoint realtime, dalam detik. |
| `cache.maxEntries` | `number` | `1000` | Jumlah maksimum entri cache. |
| `cache.maxBytes` | `number` | `33554432` | Ukuran maksimum cache (32 MiB). |
| `fetch` | `typeof fetch` | `globalThis.fetch` | Implementasi `fetch` alternatif, misalnya untuk proxy. |

Buat satu instance client dan gunakan kembali di seluruh aplikasi. Cache dan status rotasi API key disimpan per instance.

## Memanggil Endpoint

Endpoint dikelompokkan berdasarkan resource:

| Resource | Cakupan |
|---|---|
| `analysis` | Daftar saham, broker, dan indeks; harga, chart, intraday, order book, running trade; broker summary; pemegang saham; laporan keuangan; kalender aksi korporasi; berita dan keterbukaan informasi |
| `batch` | Order book dan data intraday untuk beberapa saham dalam satu request |
| `search` | Pencarian saham dan pengguna |
| `screener` | Eksekusi screener dan pengelolaan preset |
| `usage` | Pemakaian dan sisa kuota API |
| `watchlists` | Watchlist dan grup watchlist |
| `journals` | Jurnal transaksi |
| `portfolios` | Portofolio |
| `alerts` | Alert berbasis formula |
| `posts` | Post, komentar, like, dan vote komunitas |
| `trades` | Realized trade |

Setiap method mengikuti pola berikut:

```
client.<resource>.<method>(...pathParams, body?, params?, options?)
```

| Argumen | Keterangan |
|---|---|
| `pathParams` | Parameter path sebagai argumen posisional, sesuai urutan di URL. |
| `body` | Request body untuk `POST`, `PUT`, `PATCH`, dan `DELETE`, bertipe `*Request`. |
| `params` | Query parameter dalam satu objek bertipe `<Nama>Params`. Nama field sama dengan nama di API. Wajib diisi jika endpoint memiliki query parameter wajib. |
| `options` | `{ signal?: AbortSignal }` untuk membatalkan request. |

```ts
// Path parameter
await client.analysis.getBrokerStalker('YP', 'BBCA', {
  from: '2024-12-01',
  to: '2024-12-31',
  investor: 'all',
  market: 'RG',
});

// Request body
await client.screener.screen({ formula: 'close > prev AND volume > 1000000', category: ['SYARIAH'] });

// Beberapa saham sekaligus, dihitung sebagai satu request
await client.batch.getOrderBook('BBCA|BBRI|BMRI');

// Membatalkan request
const controller = new AbortController();
setTimeout(() => controller.abort(), 2_000);
await client.analysis.getOrderBook('BBCA', { market: 'RG' }, { signal: controller.signal });
```

Daftar lengkap method, parameter, nilai default, dan tipe kembalian tersedia di [docs/API.md](docs/API.md).

## Tipe Data

Seluruh model request, query parameter, dan response diekspor dari paket:

```ts
import type { TopChangeParams, TopChangeResponse } from '@invezgo/sdk';

const params: TopChangeParams = {
  date: '2024-12-30',
  filter_column: 'change', // 'change' | 'value' | 'volume' | 'ratio'
  filter_operator: '>',
  filter_value: 5,
};

const top: TopChangeResponse = await client.analysis.getTopChange(params);
```

Ketentuan tipe:

| Kasus | Representasi |
|---|---|
| Parameter enum | Literal union, misalnya `'BUY' \| 'SELL' \| 'ALL'` |
| Field nullable | `T \| null` |
| Field opsional | `field?: T` |
| Response array | Alias `XResponse = XItem[]` |
| Response yang dapat bernilai `null` | `Promise<X \| null>`, misalnya `getShareholderClassifyTable` |
| Angka yang dapat dikirim sebagai string | `number \| string` |

Response berbentuk union dapat dipersempit melalui field `type`:

```ts
const graph = await client.analysis.getShareholderRelation({ code: 'BBCA' });

for (const node of graph.nodes) {
  if (node.type === 'stock') {
    console.log(node.code, node.company_name);
  } else {
    console.log(node.label);
  }
}
```

## Caching

Cache in-memory aktif secara default untuk mengurangi pemakaian kuota dan latensi.

- Hanya request `GET` yang disimpan. Cache key terdiri dari path dan query string yang telah dinormalisasi.
- Cache menggunakan algoritma LRU dengan batas jumlah entri (`maxEntries`) dan total ukuran (`maxBytes`). Entri yang paling lama tidak digunakan akan dihapus saat salah satu batas terlampaui.
- Endpoint realtime (order book, running trade, intraday, chart, batch, dan sejenisnya) menggunakan `realtimeTtl`. Endpoint lainnya menggunakan `ttl`.
- Endpoint `usage` dan request selain `GET` tidak disimpan di cache.
- Setiap request `POST`, `PUT`, `PATCH`, atau `DELETE` yang berhasil akan menghapus cache data personal (`watchlists`, `journals`, `portfolios`, `trades`, `alerts`, `screener`).

```ts
new Invezgo({ apiKey, cache: false });                // nonaktifkan cache
new Invezgo({ apiKey, cache: { realtimeTtl: 0 } });   // nonaktifkan cache untuk endpoint realtime
new Invezgo({ apiKey, cache: { ttl: 300 } });         // TTL endpoint reguler 5 menit

client.clearCache();                                  // hapus seluruh cache
```

## Rotasi API Key

Setiap API key memiliki batas request per menit untuk setiap endpoint dan kuota bulanan. Jika Anda memiliki lebih dari satu API key, tambahkan sebagai cadangan:

```ts
const client = new Invezgo({
  apiKey: process.env.INVEZGO_API_KEY!,
  additionalApiKeys: [process.env.INVEZGO_API_KEY_2!, process.env.INVEZGO_API_KEY_3!],
});
```

Ketika API mengembalikan `429 Too Many Requests`:

1. Lama penundaan diambil dari header `Retry-After`. Jika tidak tersedia, digunakan `X-RateLimit-Reset`, kemudian 60 detik.
2. Untuk batas per menit, API key ditangguhkan hanya pada endpoint tersebut. Untuk kuota bulanan, API key ditangguhkan pada seluruh endpoint.
3. Request dikirim ulang menggunakan API key berikutnya yang tersedia.
4. API key utama digunakan kembali setelah masa penangguhan berakhir.
5. Jika seluruh API key sedang ditangguhkan, SDK melempar `RateLimitError` tanpa mengirim request.

Rotasi hanya dilakukan untuk status `429`. Untuk endpoint data personal seperti watchlist dan portofolio, gunakan API key dari akun yang sama.

Sisa kuota dapat diperiksa tanpa mengurangi kuota:

```ts
const usage = await client.usage.getApiUsage();
console.log(usage.usage, usage.limit, usage.remaining, usage.expire);
```

## Penanganan Error

Seluruh error merupakan turunan `InvezgoError`.

| Class | Status HTTP | Penyebab |
|---|---|---|
| `ValidationError` | 400, 422 | Parameter atau body tidak valid |
| `AuthenticationError` | 401 | API key tidak valid atau kedaluwarsa |
| `PaymentRequiredError` | 402 | Endpoint tidak termasuk dalam paket langganan |
| `NotFoundError` | 404 | Data tidak ditemukan |
| `RateLimitError` | 429 | Batas request atau kuota tercapai pada seluruh API key |
| `ServerError` | 5xx | Kesalahan pada server |
| `TimeoutError` | — | Request melebihi `timeout` |
| `ConnectionError` | — | Kegagalan jaringan |

Properti yang tersedia: `status`, `message`, `error`, `requestId`, `path`, dan `body`. `RateLimitError` juga menyediakan `retryAfter` (detik), `limit`, `remaining`, `reset`, dan `quotaExceeded`.

```ts
import { InvezgoError, RateLimitError, ValidationError } from '@invezgo/sdk';

try {
  await client.analysis.getSummaryStock('BBCA', {
    from: '2024-12-01',
    to: '2024-12-31',
    investor: 'all',
    market: 'RG',
  });
} catch (err) {
  if (err instanceof RateLimitError) {
    console.error(`Rate limit tercapai, coba lagi dalam ${err.retryAfter} detik`);
  } else if (err instanceof ValidationError) {
    console.error(`Parameter tidak valid: ${err.message}`);
  } else if (err instanceof InvezgoError) {
    console.error(err.status, err.message, err.requestId);
  } else {
    throw err;
  }
}
```

## Pagination

Endpoint dengan pagination mengembalikan `page`, `totalPage`, dan `nextPage`. Nilai `nextPage` adalah `null` pada halaman terakhir.

```ts
let page: number | null = 1;

while (page !== null) {
  const res = await client.analysis.getNews({ page, limit: 50 });
  for (const item of res.data) console.log(item.title);
  page = res.nextPage;
}
```

## Praktik yang Disarankan

- Gunakan satu instance client untuk seluruh aplikasi.
- Simpan API key di environment variable atau secret manager.
- Gunakan format tanggal `YYYY-MM-DD`. Data end-of-day tersedia setelah pukul 18.00 WIB.
- Field waktu bersufiks `Z` menggunakan waktu WIB (UTC+7); jangan dikonversi ke zona waktu lain.
- Gunakan resource `batch` untuk mengambil data beberapa saham sekaligus.
- Saat menerima `RateLimitError`, tunggu sesuai `retryAfter` sebelum mencoba kembali.
- Untuk polling data realtime, sesuaikan `realtimeTtl` dengan interval polling.

Contoh lengkap tersedia di direktori [examples](examples/).

## Pengembangan

File di `src/generated/` dan `docs/API.md` dihasilkan dari spesifikasi OpenAPI dan tidak boleh diubah secara manual.

```bash
npm run generate    # generate ulang kode dari OpenAPI
npm run typecheck   # pemeriksaan tipe
npm test            # build dan unit test
```

## Dukungan

Sertakan nilai `requestId` dari error saat menghubungi tim dukungan Invezgo.

- Website: [invezgo.com](https://invezgo.com)
- Dokumentasi API: [api.invezgo.com/documentation](https://api.invezgo.com/documentation)

## Lisensi

Dirilis di bawah [MIT License](LICENSE).
