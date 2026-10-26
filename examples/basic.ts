/**
 * Contoh penggunaan @invezgo/sdk.
 *
 *   INVEZGO_API_KEY=xxx npx tsx examples/basic.ts
 *
 * (di project Anda, ganti import '../src' menjadi '@invezgo/sdk')
 */
import {
  Invezgo,
  InvezgoError,
  RateLimitError,
  type StockListItem,
  type StockRunningTradeParams,
  type TopChangeResponse,
} from '../src';

const client = new Invezgo({
  apiKey: process.env.INVEZGO_API_KEY ?? '',
  // Key cadangan: dipakai otomatis saat key utama kena 429 (rate limit per menit / kuota bulanan).
  additionalApiKeys: (process.env.INVEZGO_EXTRA_KEYS ?? '').split(',').filter(Boolean),
  cache: { ttl: 120, realtimeTtl: 3 },
});

async function main(): Promise<void> {
  // Respons ter-typing penuh.
  const stocks: StockListItem[] = await client.analysis.getStockList();
  console.log(`${stocks.length} saham, contoh:`, stocks[0]?.code, stocks[0]?.sector ?? '-');

  // Parameter query wajib (`date`) dicek compiler; enum menjadi literal union.
  const top: TopChangeResponse = await client.analysis.getTopChange({
    date: '2024-12-30',
    filter_column: 'change',
    filter_operator: '>',
    filter_value: 5,
  });
  for (const s of top.gain.slice(0, 5)) console.log(s.code, `${s.change}%`, s.graph.map((g) => g.value));

  const params: StockRunningTradeParams = { date: '2024-12-30', type: 'BUY', limit: 100 };
  const trades = await client.analysis.getStockRunningTrade('BBCA', params);
  console.log('running trade:', trades.data.length);

  // Union terdiskriminasi: TypeScript mempersempit tipe berdasarkan `type`.
  const graph = await client.analysis.getShareholderRelation({ code: 'BBCA', depth: 2 });
  for (const node of graph.nodes) {
    if (node.type === 'stock') console.log('saham', node.code, node.company_name);
    else console.log('entitas', node.label);
  }

  // Endpoint bisa mengembalikan null — compiler memaksa Anda menanganinya.
  const classify = await client.analysis.getShareholderClassifyTable('BBCA');
  console.log('klasifikasi:', classify?.code ?? 'tidak ada data');

  // @ts-expect-error -- `date` wajib diisi
  void client.analysis.getTopChange({});
  // @ts-expect-error -- nilai enum tidak valid
  void client.analysis.getStockRunningTrade('BBCA', { date: '2024-12-30', type: 'HOLD' });
}

main().catch((err: unknown) => {
  if (err instanceof RateLimitError) {
    console.error(`Semua key terkena limit. Coba lagi dalam ${err.retryAfter} detik (kuota bulanan: ${err.quotaExceeded}).`);
  } else if (err instanceof InvezgoError) {
    console.error(`[${err.status}] ${err.message} (requestId: ${err.requestId ?? '-'})`);
  } else {
    throw err;
  }
  process.exitCode = 1;
});
