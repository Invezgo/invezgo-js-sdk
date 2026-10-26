import { LruCache } from './cache';
import { ConnectionError, InvezgoError, RateLimitError, TimeoutError, errorClassFor } from './errors';

export const VERSION = '2.0.0';
export const DEFAULT_BASE_URL = 'https://api.invezgo.com';

/** Path segments holding per-account data; a successful mutation purges their cached GETs. */
const PERSONAL_SEGMENTS = new Set(['watchlists', 'journals', 'portfolios', 'trades', 'alerts', 'screener']);
const QUOTA_MESSAGE = /quota|kuota|monthly|bulanan/i;

/** Cache options. TTLs are in seconds; a TTL `<= 0` disables caching for that tier. */
export interface CacheOptions {
  /** TTL for regular GET endpoints. Default `60`. */
  ttl?: number;
  /** TTL for `[REALTIME]` endpoints (order book, running trade, intraday…). Default `5`. */
  realtimeTtl?: number;
  /** Maximum number of cached responses. Default `1000`. */
  maxEntries?: number;
  /** Maximum total size of cached response bodies in bytes. Default `33554432` (32 MiB). */
  maxBytes?: number;
}

export interface InvezgoConfig {
  /** Primary API key (https://invezgo.com/id/setting/api). Required. */
  apiKey: string;
  /** Extra API keys used automatically when a key gets HTTP 429 (rate limit or monthly quota). */
  additionalApiKeys?: string[];
  /** API base URL. Default `https://api.invezgo.com`. */
  baseUrl?: string;
  /** Per-attempt timeout in milliseconds. Default `30000`. */
  timeout?: number;
  /** In-memory LRU cache for GET requests. Enabled by default; `false` disables it. */
  cache?: boolean | CacheOptions;
  /** Custom `fetch` implementation (defaults to the global `fetch`). */
  fetch?: typeof fetch;
}

/** Per-request options. */
export interface RequestOptions {
  /** Abort the request. */
  signal?: AbortSignal;
}

/** @internal Description of one API call, produced by the generated resources. */
export interface RequestSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Path template, e.g. `/analysis/information/{code}`. */
  route: string;
  cache: 'default' | 'realtime' | 'none';
  pathParams?: Record<string, string | number>;
  query?: object;
  body?: unknown;
}

/** @internal HTTP transport: caching, API key rotation and error mapping. */
export class Transport {
  private readonly keys: string[];
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly fetchImpl: typeof fetch;
  private readonly cache?: LruCache;
  private readonly ttlMs: number = 0;
  private readonly realtimeTtlMs: number = 0;
  /** `"<keyIndex>"` → quota block, `"<keyIndex> <route>"` → per-minute block; values are `performance.now()` deadlines. */
  private readonly blocks = new Map<string, { until: number; quota: boolean }>();

  constructor(config: InvezgoConfig) {
    if (!config || typeof config.apiKey !== 'string' || !config.apiKey.trim()) {
      throw new TypeError('Invezgo: `apiKey` is required');
    }
    this.keys = [...new Set([config.apiKey, ...(config.additionalApiKeys ?? [])].filter((k) => !!k && !!k.trim()))];
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeout = config.timeout ?? 30_000;
    const f = config.fetch ?? globalThis.fetch;
    if (typeof f !== 'function') throw new TypeError('Invezgo: global fetch is unavailable; pass `fetch` in the config (Node >= 18)');
    this.fetchImpl = f;
    if (config.cache !== false) {
      const o = config.cache === true || config.cache === undefined ? {} : config.cache;
      this.cache = new LruCache(o.maxEntries ?? 1000, o.maxBytes ?? 32 * 1024 * 1024);
      this.ttlMs = (o.ttl ?? 60) * 1000;
      this.realtimeTtlMs = (o.realtimeTtl ?? 5) * 1000;
    }
  }

  clearCache(): void {
    this.cache?.clear();
  }

  async request<T>(spec: RequestSpec, options?: RequestOptions): Promise<T> {
    const path = spec.route.replace(/\{(\w+)\}/g, (_, name: string) => {
      const value = spec.pathParams?.[name];
      if (value === undefined || value === null || value === '') throw new TypeError(`Invezgo: path parameter \`${name}\` is required`);
      return encodeURIComponent(String(value));
    });
    const qs = canonicalQuery(spec.query);
    const target = qs ? `${path}?${qs}` : path;

    const ttl = spec.method !== 'GET' ? 0 : spec.cache === 'realtime' ? this.realtimeTtlMs : spec.cache === 'default' ? this.ttlMs : 0;
    if (this.cache && ttl > 0) {
      const hit = this.cache.get(target);
      if (hit !== undefined) return parseBody(hit) as T;
    }

    const tried = new Set<number>();
    let last: RateLimitError | undefined;
    for (;;) {
      const index = this.pickKey(spec.route, tried);
      if (index < 0) throw this.allKeysBlocked(spec.route, last);
      tried.add(index);

      const res = await this.send(index, spec, target, options);
      const text = await res.text();

      if (res.status === 429) {
        last = this.rateLimited(index, spec.route, res, text);
        continue;
      }
      if (!res.ok) throw buildError(res, text);

      let data: unknown;
      try {
        data = parseBody(text);
      } catch (cause) {
        throw new InvezgoError({ status: res.status, message: 'Invezgo: response is not valid JSON', body: text, path, cause });
      }
      if (this.cache) {
        if (ttl > 0) this.cache.set(target, text, ttl);
        else if (spec.method !== 'GET') this.cache.deleteWhere((key) => PERSONAL_SEGMENTS.has(key.split(/[/?]/)[1]));
      }
      return data as T;
    }
  }

  private async send(index: number, spec: RequestSpec, target: string, options?: RequestOptions): Promise<Response> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.keys[index]}`,
      Accept: 'application/json',
      'User-Agent': `invezgo-js-sdk/${VERSION}`,
    };
    let body: string | undefined;
    if (spec.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(spec.body);
    }

    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, this.timeout);
    const signal = options?.signal;
    const onAbort = () => controller.abort(signal?.reason);
    if (signal?.aborted) onAbort();
    else signal?.addEventListener('abort', onAbort, { once: true });

    try {
      return await this.fetchImpl(this.baseUrl + target, { method: spec.method, headers, body, signal: controller.signal });
    } catch (cause) {
      if (signal?.aborted) throw cause;
      if (timedOut) throw new TimeoutError({ status: 0, message: `Invezgo: request timed out after ${this.timeout} ms`, path: target, cause });
      throw new ConnectionError({ status: 0, message: `Invezgo: network error: ${(cause as Error)?.message ?? cause}`, path: target, cause });
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }
  }

  /** Remaining block of a key for a route, in ms (0 = usable). */
  private blockedFor(index: number, route: string, now: number): { ms: number; quota: boolean } {
    let ms = 0;
    let quota = false;
    for (const [id, isQuota] of [[`${index}`, true], [`${index} ${route}`, false]] as const) {
      const b = this.blocks.get(id);
      if (!b) continue;
      if (b.until <= now) this.blocks.delete(id);
      else if (b.until - now > ms) {
        ms = b.until - now;
        quota = isQuota;
      }
    }
    return { ms, quota };
  }

  private pickKey(route: string, tried: Set<number>): number {
    const now = performance.now();
    for (let i = 0; i < this.keys.length; i++) {
      if (!tried.has(i) && this.blockedFor(i, route, now).ms === 0) return i;
    }
    return -1;
  }

  private rateLimited(index: number, route: string, res: Response, text: string): RateLimitError {
    const err = buildError(res, text);
    const retryAfter = num(res.headers.get('retry-after'));
    const reset = num(res.headers.get('x-ratelimit-reset'));
    let wait = 60;
    if (retryAfter !== undefined && retryAfter > 0) wait = retryAfter;
    else if (reset !== undefined && reset - Date.now() / 1000 > 0) wait = reset - Date.now() / 1000;
    const quota = QUOTA_MESSAGE.test(err.message);
    this.blocks.set(quota ? `${index}` : `${index} ${route}`, { until: performance.now() + wait * 1000, quota });
    return new RateLimitError({
      status: 429,
      message: err.message,
      error: err.error,
      requestId: err.requestId,
      path: err.path,
      body: err.body,
      retryAfter: Math.ceil(wait),
      limit: num(res.headers.get('x-ratelimit-limit')),
      remaining: num(res.headers.get('x-ratelimit-remaining')),
      reset,
      quotaExceeded: quota,
    });
  }

  private allKeysBlocked(route: string, last?: RateLimitError): RateLimitError {
    const now = performance.now();
    let min = Infinity;
    let allQuota = true;
    for (let i = 0; i < this.keys.length; i++) {
      const b = this.blockedFor(i, route, now);
      min = Math.min(min, b.ms);
      allQuota &&= b.quota;
    }
    const retryAfter = Math.max(0, Math.ceil((Number.isFinite(min) ? min : 0) / 1000));
    if (last) {
      return new RateLimitError({ ...last, message: last.message, retryAfter, quotaExceeded: last.quotaExceeded });
    }
    return new RateLimitError({
      status: 429,
      message: `Invezgo: all API keys are rate limited; retry in ${retryAfter}s`,
      retryAfter,
      quotaExceeded: allQuota,
    });
  }
}

/** Sorted, null-free query string; also the canonical cache key suffix. */
export function canonicalQuery(query?: object): string {
  if (!query) return '';
  const entries = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => [k, String(v)]);
  return new URLSearchParams(entries).toString();
}

function parseBody(text: string): unknown {
  return text.trim() === '' ? null : JSON.parse(text);
}

function num(value: string | null): number | undefined {
  if (value === null || value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function buildError(res: Response, text: string): InvezgoError {
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    // keep raw text
  }
  const b = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const msg = Array.isArray(b.message) ? b.message.join('; ') : typeof b.message === 'string' ? b.message : '';
  const Cls = errorClassFor(res.status);
  return new Cls({
    status: res.status,
    message: msg || res.statusText || `HTTP ${res.status}`,
    error: typeof b.error === 'string' ? b.error : undefined,
    requestId: typeof b.requestId === 'string' ? b.requestId : (res.headers.get('request-id') ?? undefined),
    path: typeof b.path === 'string' ? b.path : undefined,
    body,
  });
}
