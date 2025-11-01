<div align="center">

![Versi](https://img.shields.io/badge/versi-1.0.0-blue.svg)
![Lisensi](https://img.shields.io/badge/lisensi-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Siap-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

# 📈 Invezgo SDK

**SDK Resmi JavaScript/TypeScript untuk Invezgo API — Platform AI & Data Pasar Saham Indonesia**

SDK ini menyediakan akses mudah ke **API Saham Indonesia** dari platform **Invezgo**, mencakup data **Bursa Efek Indonesia (BEI)**, **laporan keuangan emiten**, **Bandarmology**, **Foreign Flow**, **AI Insight**, dan banyak lagi.

[✨ Fitur](#-fitur) • [⚙️ Instalasi](#-instalasi) • [🚀 Mulai Cepat](#-mulai-cepat) • [📚 Dokumentasi](#-dokumentasi) • [💡 Contoh](#-contoh) • [📖 API Reference](#-api-reference)

</div>

---

## 🇮🇩 Tentang Invezgo

**Invezgo** adalah **platform analisis saham berbasis kecerdasan buatan (AI)** yang berfokus pada pasar modal Indonesia.  
Misi kami adalah membantu investor ritel mendapatkan **akses setara terhadap data, wawasan, dan analisis pasar saham** melalui kombinasi teknologi data, AI, dan antarmuka yang mudah digunakan.

Invezgo menyediakan:
- 📊 **Data pasar saham Indonesia (BEI)** secara real-time  
- 🧮 **Analisis otomatis** seperti Bandarmology, Foreign Flow, dan akumulasi investor  
- 🤖 **AI Insight** yang menjelaskan pola perdagangan dan perilaku pasar  
- 📈 **Laporan keuangan & indikator fundamental** yang terintegrasi  
- 🧠 **Alat riset seperti screener, portofolio, watchlist, dan jurnal trading**  

Dengan **Invezgo SDK**, Anda dapat mengintegrasikan seluruh fitur tersebut langsung ke aplikasi Anda — baik untuk **Fintech**, **dashboard analisis saham**, **screener otomatis**, atau **riset kuantitatif**.

---

## ✨ Fitur Utama

- 🔥 **Dukungan Penuh TypeScript** — Semua endpoint memiliki definisi tipe lengkap  
- 📦 **Dual Module (CJS & ESM)** — Dapat digunakan di Node.js maupun browser modern  
- 🎯 **Cakupan Lengkap** — Mencakup semua endpoint API Invezgo  
- 🛡️ **Error Handling Terstruktur** — Menampilkan kode, pesan, dan detail error  
- ⚡ **Async/Await Modern** — Memanfaatkan sintaks modern yang mudah dibaca  
- 📚 **Dokumentasi Lengkap** — Mendukung IntelliSense & komentar JSDoc  
- 🚀 **Tanpa Dependensi** — Ringan, cepat, dan efisien  
- 🔐 **Keamanan Otomatis** — Autentikasi via Bearer Token  
- 🌐 **Node.js & Browser** — Dapat digunakan di server maupun aplikasi web  

---

## ⚙️ Instalasi

Pasang SDK menggunakan npm, yarn, atau pnpm:

```bash
# Menggunakan npm
npm install @invezgo/sdk

# Menggunakan yarn
yarn add @invezgo/sdk

# Menggunakan pnpm
pnpm add @invezgo/sdk
```

---

## 🚀 Mulai Cepat

### 1️⃣ Dapatkan API Key Anda

Untuk mulai menggunakan SDK, Anda membutuhkan API key dari Invezgo:

- 🔑 [Pengaturan API Key](https://invezgo.com/id/setting/api)
- 💳 [Paket Langganan](https://invezgo.com/subscription)

---

### 2️⃣ Contoh JavaScript (CommonJS)

```javascript
const { Invezgo } = require('@invezgo/sdk');

const client = new Invezgo({
  apiKey: 'api-key-anda'
});

// Ambil daftar seluruh saham
(async () => {
  try {
    const stocks = await client.analysis.getStockList();
    console.log(`Ditemukan ${stocks.length} saham`);
    console.log(stocks[0]); // { code: 'BBCA', name: 'Bank Central Asia', logo: '...' }
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
  }
})();
```

---

### 3️⃣ Contoh TypeScript / ES Modules

```typescript
import Invezgo from '@invezgo/sdk';

const client = new Invezgo({
  apiKey: 'api-key-anda'
});

(async () => {
  try {
    const info = await client.analysis.getInformation('BBCA');
    console.log(info.name);   // Bank Central Asia
    console.log(info.sector); // Keuangan
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

---

## 📚 Dokumentasi

### Konfigurasi

```typescript
import Invezgo from '@invezgo/sdk';

const client = new Invezgo({
  apiKey: 'api-key-anda',              // Wajib
  baseURL: 'https://api.invezgo.com',  // Opsional
  timeout: 30000                       // Opsional (default 30 detik)
});
```

---

### Kategori Endpoint

| Kategori | Deskripsi | Jumlah Metode |
|----------|------------|---------------|
| **`analysis`** | Analisis saham, grafik, data keuangan | 30+ |
| **`watchlists`** | Manajemen watchlist pribadi | 7 |
| **`journals`** | Catatan transaksi/jurnal trading | 5 |
| **`portfolios`** | Portofolio & ringkasan investasi | 2 |
| **`ai`** | Analisis saham dengan AI | 10 |
| **`search`** | Pencarian saham & pengguna | 3 |
| **`profile`** | Profil pengguna & sosial | 8 |
| **`membership`** | Langganan & transaksi paket | 5 |
| **`posts`** | Konten komunitas & postingan | 8 |
| **`trades`** | Data transaksi realisasi | 4 |
| **`screener`** | Filter saham otomatis | 3 |
| **`health`** | Status kesehatan API | 3 |

---

## 💡 Contoh Penggunaan

### 📊 Analisis Saham

```typescript
import Invezgo from '@invezgo/sdk';
const client = new Invezgo({ apiKey: 'api-key-anda' });

// Ambil seluruh daftar saham
const stocks = await client.analysis.getStockList();
console.log(`Total saham: ${stocks.length}`);

// Ambil informasi perusahaan
const info = await client.analysis.getInformation('BBCA');
console.log(info.name); // Bank Central Asia
console.log(info.sector); // Keuangan
```

---

### 💰 Laporan Keuangan Emiten

```typescript
// Ambil laporan Neraca (Balance Sheet)
const balanceSheet = await client.analysis.getFinancialStatement('BBCA', {
  statement: 'BS',
  type: 'Q',
  limit: 10
});

console.log(balanceSheet.rows);
console.log(balanceSheet.columns);
```

---

### 🧭 Broker & Bandarmology

```typescript
// Ambil data ringkasan broker untuk saham tertentu
const summary = await client.analysis.getBrokerSummaryStock('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  investor: 'all',
  market: 'RG'
});
console.log(summary);
```

---

### 🤖 Analisis AI

```typescript
// Analisis AI terhadap aktivitas broker
const result = await client.ai.analyzeInventoryChart('BBCA', {
  from: '2024-12-01',
  to: '2024-12-30',
  scope: 'vol',
  investor: 'all',
  limit: 5,
  market: 'RG'
});

console.log(result.summary);
```

---

### 🔎 Screener Saham Otomatis

```typescript
const results = await client.screener.screen({
  columns: ['volume', 'close', 'value'],
  conditions: [
    { ratio: 'BASIC', column: 'close', operator: '>=', value: '5000' },
    { ratio: 'COMPARE', column: 'value', compare: 'volume', operator: '>', multiply: 'x', value: '1' }
  ]
});
```

---

## 📖 Referensi API

Tersedia lebih dari **100 endpoint terstruktur** dalam kategori berikut:

- `analysis.getStockList()`, `getBrokerList()`, `getInformation(code)`
- `getChart(code, {from, to})`, `getOrderBook(code)`, `getIntraday(code)`
- `getTopChange(date)`, `getTopForeign(date)`, `getTopAccumulation(date)`
- `getFinancialStatement(code, {...})`
- `getKeyStat(code, {...})`, `getKeyStatChart(...)`
- `getShareholder(code)`, `getShareholderKSEI(...)`, `getInsider(...)`
- `getBrokerSummaryStock(...)`, `getInventoryChartStock(...)`
- `ai.analyzeInventoryChart(...)`, `ai.analyzeShareholderAbove(...)`
- `watchlists.*`, `journals.*`, `portfolios.*`, `screener.*`, `health.*`

---

## 🔐 Keamanan

1. Jangan pernah commit **API key** ke repositori publik  
2. Gunakan **environment variable** di server:
   ```typescript
   const client = new Invezgo({
     apiKey: process.env.INVEZGO_API_KEY!
   });
   ```
3. Gunakan kunci berbeda untuk *dev* dan *production*  
4. Lakukan rotasi API key secara berkala  

---

## 🌍 Kompatibilitas

SDK ini menggunakan `fetch` API bawaan yang tersedia di:

- ✅ Browser modern (Chrome, Edge, Safari, Firefox)
- ✅ Node.js 18+
- ⚠️ Node.js 14–17 → butuh `node-fetch`
- ⚠️ Browser lama → butuh `whatwg-fetch`

---

## ⚠️ Penanganan Error

```typescript
import { Invezgo, InvezgoError } from '@invezgo/sdk';

try {
  await client.analysis.getInformation('INVALID');
} catch (err) {
  if (err instanceof InvezgoError) {
    console.error('Kode:', err.statusCode);
    console.error('Pesan:', err.message);
  }
}
```

---

## 🧠 FAQ

**Apakah data ini real-time?**  
> Sebagian data seperti harga dan orderbook bersifat real-time (jika tersedia). Beberapa data seperti laporan keuangan bersifat periodik (EoD atau kuartalan).

**Apakah aman digunakan di frontend?**  
> Sebaiknya gunakan server (backend) untuk menyimpan API key, atau gunakan token scoped khusus frontend.

**Apakah SDK ini gratis?**  
> Beberapa endpoint memerlukan langganan. Lihat [Paket Langganan](https://invezgo.com/subscription).

---

## 🤝 Kontribusi

Kami sangat terbuka terhadap kontribusi komunitas.  
Langkahnya:

1. Fork repository ini  
2. Buat branch baru: `git checkout -b fitur-baru`  
3. Commit perubahan: `git commit -m "feat: tambah fitur baru"`  
4. Push: `git push origin fitur-baru`  
5. Buka Pull Request  

---

## 📝 Lisensi

Proyek ini dirilis di bawah **MIT License** — silakan lihat [LICENSE](LICENSE).

---

## 🔗 Tautan Penting

- 🌐 [Website Invezgo](https://invezgo.com)  
- 📚 [Dokumentasi API](https://api.invezgo.com)  
- 🔑 [Dapatkan API Key](https://invezgo.com/id/setting/api)  
- 💳 [Langganan Paket](https://invezgo.com/subscription)  
- 📋 [Syarat & Ketentuan](https://invezgo.com/terms)  
- 🔒 [Kebijakan Privasi](https://invezgo.com/privacy-policy)  
- 🐛 [Laporkan Bug](https://github.com/Invezgo/invezgo-js-sdk/issues)

---

<div align="center">

Made with ❤️ by the [Invezgo](https://invezgo.com) team  
**Empowering Indonesian investors with better data, better insights, and better decisions**

⭐ [Beri bintang di GitHub](https://github.com/Invezgo/invezgo-js-sdk)

</div>
