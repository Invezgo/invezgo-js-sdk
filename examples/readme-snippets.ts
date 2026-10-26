/**
 * Every code sample from README.md, kept here so `npm run typecheck` proves the docs compile.
 * Not meant to be executed as-is.
 */
import {
  Invezgo,
  InvezgoError,
  RateLimitError,
  ValidationError,
  type TopChangeParams,
  type TopChangeResponse,
} from '../src';

export async function snippets(apiKey: string): Promise<void> {
  // Penggunaan
  const client = new Invezgo({ apiKey: process.env.INVEZGO_API_KEY! });
  await client.analysis.getStockList();
  await client.analysis.getInformation('BBCA');
  const top = await client.analysis.getTopChange({ date: '2024-12-30' });
  console.log(top.gain[0].code, top.gain[0].change);

  // Konfigurasi
  new Invezgo({
    apiKey: process.env.INVEZGO_API_KEY!,
    additionalApiKeys: [process.env.INVEZGO_API_KEY_2!],
    timeout: 30_000,
    cache: { ttl: 60, realtimeTtl: 5 },
  });

  // Memanggil Endpoint
  await client.analysis.getBrokerStalker('YP', 'BBCA', {
    from: '2024-12-01',
    to: '2024-12-31',
    investor: 'all',
    market: 'RG',
  });
  await client.screener.screen({ formula: 'close > prev AND volume > 1000000', category: ['SYARIAH'] });
  await client.batch.getOrderBook('BBCA|BBRI|BMRI');
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 2_000);
  await client.analysis.getOrderBook('BBCA', { market: 'RG' }, { signal: controller.signal });

  // Tipe Data
  const params: TopChangeParams = {
    date: '2024-12-30',
    filter_column: 'change',
    filter_operator: '>',
    filter_value: 5,
  };
  const typed: TopChangeResponse = await client.analysis.getTopChange(params);
  console.log(typed.loss.length);

  const graph = await client.analysis.getShareholderRelation({ code: 'BBCA' });
  for (const node of graph.nodes) {
    if (node.type === 'stock') {
      console.log(node.code, node.company_name);
    } else {
      console.log(node.label);
    }
  }

  // Caching
  new Invezgo({ apiKey, cache: false });
  new Invezgo({ apiKey, cache: { realtimeTtl: 0 } });
  new Invezgo({ apiKey, cache: { ttl: 300 } });
  client.clearCache();

  // Rotasi API Key
  new Invezgo({
    apiKey: process.env.INVEZGO_API_KEY!,
    additionalApiKeys: [process.env.INVEZGO_API_KEY_2!, process.env.INVEZGO_API_KEY_3!],
  });
  const usage = await client.usage.getApiUsage();
  console.log(usage.usage, usage.limit, usage.remaining, usage.expire);

  // Penanganan Error
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

  // Pagination
  let page: number | null = 1;
  while (page !== null) {
    const res = await client.analysis.getNews({ page, limit: 50 });
    for (const item of res.data) console.log(item.title);
    page = res.nextPage;
  }
}
