import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {
  Invezgo,
  InvezgoClient,
  RateLimitError,
  AuthenticationError,
  ValidationError,
  PaymentRequiredError,
  NotFoundError,
  ServerError,
  TimeoutError,
  ConnectionError,
} from '../dist/index.mjs';
import cjs from '../dist/index.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Every request the mock server received: { method, url, key, body, headers }. */
let requests = [];
/** Test-specific handler: (req, body) => { status, body, headers } */
let handler;
let server;
let baseUrl;

before(async () => {
  server = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', async () => {
      const entry = { method: req.method, url: req.url, key: req.headers.authorization?.replace('Bearer ', ''), body: raw, headers: req.headers };
      requests.push(entry);
      const out = (await handler(entry)) ?? {};
      if (out.hang) return; // never answer (timeout test)
      res.writeHead(out.status ?? 200, { 'content-type': 'application/json', ...(out.headers ?? {}) });
      res.end(out.raw ?? JSON.stringify(out.body ?? { ok: true, url: req.url }));
    });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.closeAllConnections?.();
  server.close();
});

beforeEach(() => {
  requests = [];
  handler = () => ({});
});

const client = (extra = {}) => new Invezgo({ apiKey: 'A', baseUrl, ...extra });

test('exports: default/named/CJS', () => {
  assert.equal(InvezgoClient, Invezgo);
  assert.equal(typeof cjs.Invezgo, 'function');
  assert.equal(cjs.default, cjs.Invezgo);
  assert.throws(() => new Invezgo({ apiKey: '' }), TypeError);
});

test('sends auth, user agent, JSON body and canonical sorted query', async () => {
  const c = client({ cache: false });
  await c.analysis.getIndicatorChart('bdm', 'BB CA/1', { to: '2024-12-31', from: '2024-12-01' });
  await c.analysis.getTopChange({ date: '2024-12-30', filter_value: 1.5, filter_column: undefined });
  await c.watchlists.add({ group: 'g'.repeat(25), code: 'BBCA', price: 9000, scope: [] });
  const [a, b, w] = requests;
  assert.equal(a.url, '/analysis/chart/stock/bdm/BB%20CA%2F1?from=2024-12-01&to=2024-12-31');
  assert.equal(a.key, 'A');
  assert.match(a.headers['user-agent'], /^invezgo-js-sdk\/2\.0\.0$/);
  assert.equal(a.headers['content-type'], undefined);
  assert.equal(b.url, '/analysis/top/change?date=2024-12-30&filter_value=1.5');
  assert.equal(w.method, 'POST');
  assert.equal(w.headers['content-type'], 'application/json');
  assert.deepEqual(JSON.parse(w.body), { group: 'g'.repeat(25), code: 'BBCA', price: 9000, scope: [] });
});

test('null and empty bodies resolve to null', async () => {
  const c = client({ cache: false });
  handler = () => ({ raw: 'null' });
  assert.equal(await c.analysis.getShareholderClassifyTable('BBCA'), null);
  handler = () => ({ raw: '' });
  assert.equal(await c.analysis.getStockList(), null);
});

test('cache: GET hit avoids HTTP and returns a fresh object', async () => {
  const c = client();
  const a = await c.analysis.getStockList();
  a.mutated = true;
  const b = await c.analysis.getStockList();
  assert.equal(requests.length, 1);
  assert.equal(b.mutated, undefined);
  // different query = different key
  await c.analysis.getTopChange({ date: '2024-12-30' });
  await c.analysis.getTopChange({ date: '2024-12-31' });
  assert.equal(requests.length, 3);
  c.clearCache();
  await c.analysis.getStockList();
  assert.equal(requests.length, 4);
});

test('cache: disabled with cache:false', async () => {
  const c = client({ cache: false });
  await c.analysis.getStockList();
  await c.analysis.getStockList();
  assert.equal(requests.length, 2);
});

test('cache: TTL expiry', async () => {
  const c = client({ cache: { ttl: 0.05 } });
  await c.analysis.getStockList();
  await c.analysis.getStockList();
  assert.equal(requests.length, 1);
  await sleep(80);
  await c.analysis.getStockList();
  assert.equal(requests.length, 2);
});

test('cache: realtime tier uses realtimeTtl, usage endpoints never cached', async () => {
  const c = client({ cache: { realtimeTtl: 0 } });
  await c.analysis.getOrderBook('BBCA');
  await c.analysis.getOrderBook('BBCA');
  await c.analysis.getStockList();
  await c.analysis.getStockList();
  await c.usage.getApiUsage();
  await c.usage.getApiUsage();
  assert.deepEqual(requests.map((r) => r.url), ['/analysis/order-book/BBCA', '/analysis/order-book/BBCA', '/analysis/list/stock', '/usage/api', '/usage/api']);
});

test('cache: LRU evicts by entry count (least recently used first)', async () => {
  const c = client({ cache: { maxEntries: 2 } });
  await c.analysis.getInformation('AAAA');
  await c.analysis.getInformation('BBBB');
  await c.analysis.getInformation('AAAA'); // hit, AAAA becomes MRU
  await c.analysis.getInformation('CCCC'); // evicts BBBB
  assert.equal(requests.length, 3);
  await c.analysis.getInformation('AAAA'); // still cached
  assert.equal(requests.length, 3);
  await c.analysis.getInformation('BBBB'); // evicted -> refetch
  assert.equal(requests.length, 4);
});

test('cache: LRU evicts by total bytes and skips oversized bodies', async () => {
  handler = (r) => ({ raw: JSON.stringify({ pad: 'x'.repeat(r.url.includes('BIG') ? 500 : 40) }) });
  const c = client({ cache: { maxBytes: 120 } });
  await c.analysis.getInformation('AAAA'); // ~50 bytes
  await c.analysis.getInformation('BBBB'); // ~50 bytes (total ~100)
  await c.analysis.getInformation('CCCC'); // > 120 -> evicts AAAA
  await c.analysis.getInformation('CCCC');
  await c.analysis.getInformation('BBBB');
  assert.equal(requests.length, 3);
  await c.analysis.getInformation('AAAA');
  assert.equal(requests.length, 4);
  await c.analysis.getInformation('BIG');
  await c.analysis.getInformation('BIG'); // larger than maxBytes -> never cached
  assert.equal(requests.length, 6);
});

test('cache: successful mutation purges personal segments only', async () => {
  const c = client();
  await c.watchlists.list();
  await c.portfolios.list();
  await c.analysis.getStockList();
  await c.journals.add({ code: 'BBCA', broker: 'YP', date: '2024-12-30', lot: 1, fee: 0, price: 9000, scope: [] });
  await c.watchlists.list();
  await c.portfolios.list();
  await c.analysis.getStockList();
  assert.deepEqual(requests.map((r) => `${r.method} ${r.url}`), [
    'GET /watchlists',
    'GET /portfolios',
    'GET /analysis/list/stock',
    'POST /journals',
    'GET /watchlists',
    'GET /portfolios',
  ]);
});

test('cache: failed mutation does not purge', async () => {
  const c = client();
  await c.watchlists.list();
  handler = () => ({ status: 422, body: { statusCode: 422, message: 'bad', error: 'Unprocessable Entity' } });
  await assert.rejects(c.watchlists.delete({ id: ['x'] }), ValidationError);
  await c.watchlists.list();
  assert.equal(requests.length, 2);
});

const minuteLimit = { status: 429, headers: { 'retry-after': '1', 'x-ratelimit-limit': '250', 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1' }, body: { statusCode: 429, message: 'Too many requests: the ADVANCE plan allows 250 requests per minute on this endpoint. Try again in 57 seconds.', error: 'Too Many Requests' } };
const quotaLimit = { status: 429, headers: { 'retry-after': '3600' }, body: { statusCode: 429, message: 'Monthly quota exceeded. Quota resets at 2026-11-01 00:00 WIB', error: 'Too Many Requests' } };

test('rotation: per-minute 429 blocks only that route for that key', async () => {
  const c = client({ cache: false, additionalApiKeys: ['B', 'A', ''] });
  handler = (r) => (r.key === 'A' && r.url === '/analysis/list/stock' ? minuteLimit : {});
  await c.analysis.getStockList(); // A 429 -> B 200
  await c.analysis.getBrokerList(); // A still fine on other route
  await c.analysis.getStockList(); // A blocked for this route -> B directly
  assert.deepEqual(requests.map((r) => `${r.key} ${r.url}`), [
    'A /analysis/list/stock',
    'B /analysis/list/stock',
    'A /analysis/list/broker',
    'B /analysis/list/stock',
  ]);
});

test('rotation: Retry-After is honoured and primary key is preferred again', async () => {
  const c = client({ cache: false, additionalApiKeys: ['B'] });
  let first = true;
  handler = (r) => {
    if (r.key === 'A' && first) {
      first = false;
      return minuteLimit;
    }
    return {};
  };
  await c.analysis.getStockList();
  await sleep(1100);
  await c.analysis.getStockList();
  assert.deepEqual(requests.map((r) => r.key), ['A', 'B', 'A']);
});

test('rotation: monthly quota 429 blocks the whole key', async () => {
  const c = client({ cache: false, additionalApiKeys: ['B'] });
  handler = (r) => (r.key === 'A' ? quotaLimit : {});
  await c.analysis.getStockList();
  await c.analysis.getBrokerList();
  await c.search.search({ query: 'bca' });
  assert.deepEqual(requests.map((r) => r.key), ['A', 'B', 'B', 'B']);
});

test('rotation: all keys blocked -> RateLimitError, then fail fast without HTTP', async () => {
  const c = client({ cache: false, additionalApiKeys: ['B'] });
  handler = () => minuteLimit;
  const err = await c.analysis.getStockList().catch((e) => e);
  assert.ok(err instanceof RateLimitError);
  assert.equal(err.status, 429);
  assert.equal(err.retryAfter, 1);
  assert.equal(err.limit, 250);
  assert.equal(err.remaining, 0);
  assert.equal(err.quotaExceeded, false);
  assert.match(err.message, /per minute/);
  assert.equal(requests.length, 2);

  const again = await c.analysis.getStockList().catch((e) => e);
  assert.ok(again instanceof RateLimitError);
  assert.ok(again.retryAfter >= 1);
  assert.equal(requests.length, 2);
  // other routes are still allowed (both keys tried again for this route)
  await c.analysis.getBrokerList().catch(() => {});
  assert.equal(requests.length, 4);
});

test('rotation: single key quota error reports quotaExceeded', async () => {
  const c = client({ cache: false });
  handler = () => quotaLimit;
  const err = await c.analysis.getStockList().catch((e) => e);
  assert.ok(err instanceof RateLimitError);
  assert.equal(err.quotaExceeded, true);
  assert.equal(err.retryAfter, 3600);
  const again = await c.analysis.getBrokerList().catch((e) => e);
  assert.ok(again instanceof RateLimitError && again.quotaExceeded);
  assert.equal(requests.length, 1);
});

test('rotation: falls back to X-RateLimit-Reset when Retry-After is missing', async () => {
  const c = client({ cache: false });
  const reset = Math.floor(Date.now() / 1000) + 30;
  handler = () => ({ status: 429, headers: { 'x-ratelimit-reset': String(reset) }, body: { statusCode: 429, message: 'Too many requests per minute', error: 'Too Many Requests' } });
  const err = await c.analysis.getStockList().catch((e) => e);
  assert.ok(err.retryAfter >= 29 && err.retryAfter <= 31, String(err.retryAfter));
});

test('errors: status mapping and fields', async () => {
  const c = client({ cache: false });
  const cases = [
    [401, AuthenticationError],
    [402, PaymentRequiredError],
    [404, NotFoundError],
    [400, ValidationError],
    [503, ServerError],
  ];
  for (const [status, Cls] of cases) {
    handler = () => ({ status, body: { statusCode: status, message: `m${status}`, error: 'E', requestId: 'req-1', path: '/x' } });
    const err = await c.analysis.getStockList().catch((e) => e);
    assert.ok(err instanceof Cls, `${status} -> ${err?.constructor?.name}`);
    assert.equal(err.status, status);
    assert.equal(err.message, `m${status}`);
    assert.equal(err.error, 'E');
    assert.equal(err.requestId, 'req-1');
    assert.equal(err.path, '/x');
  }
  handler = () => ({ status: 422, body: { statusCode: 422, message: ['`date`: required', '`code`: too short'], error: 'Unprocessable Entity' } });
  const v = await c.analysis.getStockList().catch((e) => e);
  assert.ok(v instanceof ValidationError);
  assert.equal(v.message, '`date`: required; `code`: too short');
  handler = () => ({ status: 500, raw: 'oops' });
  const s = await c.analysis.getStockList().catch((e) => e);
  assert.ok(s instanceof ServerError);
  assert.equal(s.body, 'oops');
});

test('errors: timeout and connection failures', async () => {
  handler = () => ({ hang: true });
  const t = await client({ cache: false, timeout: 100 }).analysis.getStockList().catch((e) => e);
  assert.ok(t instanceof TimeoutError && t instanceof ConnectionError);
  assert.equal(t.status, 0);
  const dead = new Invezgo({ apiKey: 'A', baseUrl: 'http://127.0.0.1:1' });
  const e = await dead.analysis.getStockList().catch((x) => x);
  assert.ok(e instanceof ConnectionError && !(e instanceof TimeoutError));
});

test('abort signal cancels the request', async () => {
  handler = () => ({ hang: true });
  const ac = new AbortController();
  const p = client({ cache: false }).analysis.getStockList({ signal: ac.signal });
  ac.abort();
  await assert.rejects(p, (e) => e.name === 'AbortError');
});
