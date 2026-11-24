import {
  AuthenticationError,
  ConnectionError,
  InvezgoError,
  PaymentRequiredError,
  RateLimitError,
  ServerError,
  ValidationError,
} from './errors';
import { VERSION } from './http';

export const DEFAULT_REALTIME_URL = 'wss://api.invezgo.com/ws';

/** One running-trade row. */
export interface RealtimeTrade {
  /** Exchange trade id (string: exceeds the JS safe integer range). */
  id: string;
  /** `HHMMSS` (WIB). */
  time: string;
  code: string;
  price: number;
  lot: number;
  /** Rupiah: `price * lot * 100`. */
  value: number;
  change: number;
  side: 'buy' | 'sell';
}

export type RealtimeChannel = 'trades' | 'orderbook' | 'stock' | 'index';

export interface ConnectedMessage { type: 'connected' }
export interface PongMessage { type: 'pong' }
export interface SubscribedMessage {
  type: 'subscribed';
  channel: RealtimeChannel;
  /** `"*"` when subscribed to every stock. */
  codes: string[] | '*';
  min_lot?: number;
  min_value?: number;
}
export interface ErrorMessage { type: 'error'; message: string }
export interface LaggedMessage { type: 'lagged'; missed: number }
export interface TradesMessage {
  type: 'trades';
  /** Server send time, Unix milliseconds. */
  ts: number;
  data: RealtimeTrade[];
}
export interface OrderbookMessage {
  type: 'orderbook';
  code: string;
  side: 'bid' | 'offer';
  /** Every price level of this side (shape not documented). */
  levels: unknown[];
  seq: number | null;
}
/** Full stock quote snapshot; fields not yet available from the exchange may be `null`. */
export interface StockMessage {
  type: 'stock';
  code: string;
  last: number;
  prev?: number | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  change?: number | null;
  change_pct?: number | null;
  /** Shares (not lots). */
  volume?: number | null;
  /** Rupiah. */
  value?: number | null;
  freq?: number | null;
  avg?: number | null;
  /** Indicative Equilibrium Price (pre-opening). */
  iep?: number | null;
  /** Indicative Equilibrium Volume, shares. */
  iev?: number | null;
  /** `HHMMSS` (WIB). */
  time: string;
  seq?: number | null;
}
/** Index snapshot. `code` keeps the exchange's casing (e.g. `Investor33`): compare case-insensitively. */
export interface IndexMessage {
  type: 'index';
  code: string;
  last: number;
  prev?: number | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  change?: number | null;
  change_pct?: number | null;
  volume?: number | null;
  value?: number | null;
  freq?: number | null;
  /** `HHMMSS` (WIB). */
  time: string;
}
/** Any server message; unknown `type`s are delivered as-is. */
export type RealtimeMessage =
  | ConnectedMessage | PongMessage | SubscribedMessage | ErrorMessage | LaggedMessage | TradesMessage | OrderbookMessage | StockMessage | IndexMessage
  | { type: string; [key: string]: unknown };

/** Event name → listener payload. */
export interface RealtimeEvents {
  connected: ConnectedMessage;
  subscribed: SubscribedMessage;
  trades: TradesMessage;
  orderbook: OrderbookMessage;
  stock: StockMessage;
  index: IndexMessage;
  pong: PongMessage;
  lagged: LaggedMessage;
  /** Every server message, including unknown types. */
  message: RealtimeMessage;
  /** Handshake/connection failures and server `error` messages (as `ValidationError`). */
  error: InvezgoError;
  close: { code: number; reason: string };
  /** A reconnect is scheduled in `delay` seconds; backfill via REST after the next `connected`. */
  reconnect: { attempt: number; delay: number };
}

/** Minimal WebSocket shape used by the client (WHATWG `WebSocket` or the `ws` package). */
export interface WebSocketLike {
  readyState: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  onopen: ((ev: any) => void) | null;
  onmessage: ((ev: { data: unknown }) => void) | null;
  onerror: ((ev: any) => void) | null;
  onclose: ((ev: { code: number; reason: string }) => void) | null;
}
export type WebSocketConstructor = new (url: string, options: { headers: Record<string, string> }) => WebSocketLike;

export interface RealtimeOptions {
  /** API key of an account with an active Elite plan. */
  apiKey: string;
  /** Default `wss://api.invezgo.com/ws`. */
  url?: string;
  /** Reconnect with backoff (1, 2, 4 … 30 s) after a drop. Default `true`. */
  reconnect?: boolean;
  /**
   * WebSocket implementation accepting `new WebSocket(url, { headers })`, e.g. `require('ws')`.
   * Defaults to the global `WebSocket` on Node >= 22.
   */
  WebSocket?: WebSocketConstructor;
}

export interface TradesFilter {
  /** Only trades with `lot >= minLot` (`0` clears). */
  minLot?: number;
  /** Only trades with `value >= minValue` Rupiah (`0` clears). */
  minValue?: number;
}

type Listener = (payload: any) => void;

/** Handshake statuses seen by undici (Node's global WebSocket hides them); keys are watched only while connecting. */
const handshakeStatus = new Map<string, number>();
let undiciHooked = false;
function hookUndici(): void {
  if (undiciHooked) return;
  undiciHooked = true;
  const dc = (globalThis as any).process?.getBuiltinModule?.('node:diagnostics_channel');
  dc?.subscribe('undici:request:headers', (m: any) => {
    const key = `${m?.request?.origin}${m?.request?.path}`;
    if (handshakeStatus.has(key)) handshakeStatus.set(key, m.response?.statusCode ?? 0);
  });
}

function defaultWebSocket(): WebSocketConstructor | undefined {
  const node = Number((globalThis as any).process?.versions?.node?.split('.')[0]);
  return node >= 22 ? ((globalThis as any).WebSocket as WebSocketConstructor | undefined) : undefined;
}

/**
 * Real-time running trade, order book, stock quote and index stream (`wss://api.invezgo.com/ws`, Elite plan).
 * Connects on construction; subscriptions are queued until `connected` and replayed after every reconnect.
 */
export class InvezgoRealtime {
  readonly #url: string;
  readonly #apiKey: string;
  readonly #reconnect: boolean;
  readonly #WS: WebSocketConstructor;
  readonly #native: boolean;
  readonly #listeners = new Map<string, Set<Listener>>();
  #ws?: WebSocketLike;
  #ready = false;
  #closed = false;
  #attempt = 0;
  #timer?: ReturnType<typeof setTimeout>;
  #trades: '*' | Set<string> | null = null;
  #minLot?: number;
  #minValue?: number;
  readonly #orderbook = new Set<string>();
  readonly #stock = new Set<string>();
  #index: '*' | Set<string> | null = null;

  constructor(options: RealtimeOptions) {
    if (!options || typeof options.apiKey !== 'string' || !options.apiKey.trim()) {
      throw new TypeError('Invezgo: `apiKey` is required');
    }
    const WS = options.WebSocket ?? defaultWebSocket();
    if (typeof WS !== 'function') {
      throw new TypeError('Invezgo: this runtime has no WebSocket that accepts headers; pass `WebSocket: require("ws")` (Node < 22)');
    }
    this.#WS = WS;
    this.#native = !options.WebSocket;
    this.#apiKey = options.apiKey;
    this.#url = options.url ?? DEFAULT_REALTIME_URL;
    this.#reconnect = options.reconnect ?? true;
    if (this.#native) hookUndici();
    this.#connect();
  }

  on<K extends keyof RealtimeEvents>(event: K, fn: (payload: RealtimeEvents[K]) => void): this {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event)!.add(fn);
    return this;
  }

  off<K extends keyof RealtimeEvents>(event: K, fn: (payload: RealtimeEvents[K]) => void): this {
    this.#listeners.get(event)?.delete(fn);
    return this;
  }

  /** Running trades for `codes`, or every stock when `codes` is omitted. */
  subscribeTrades(codes?: string[], filter: TradesFilter = {}): void {
    const upper = codes?.map((c) => c.toUpperCase());
    if (upper) {
      const next = new Set(this.#trades instanceof Set ? this.#trades : []);
      upper.forEach((c) => next.add(c));
      if (next.size > 200) throw new RangeError('Invezgo: at most 200 trade codes per connection');
      if (this.#trades !== '*') this.#trades = next;
    } else {
      this.#trades = '*';
    }
    if (filter.minLot !== undefined) this.#minLot = filter.minLot;
    if (filter.minValue !== undefined) this.#minValue = filter.minValue;
    this.#send({ op: 'subscribe', channel: 'trades', codes: upper, min_lot: filter.minLot, min_value: filter.minValue });
  }

  /** Order book for `codes` (1 to 20 codes per connection). */
  subscribeOrderbook(codes: string[]): void {
    if (!Array.isArray(codes) || codes.length === 0) throw new TypeError('Invezgo: orderbook `codes` must not be empty');
    const upper = codes.map((c) => c.toUpperCase());
    if (new Set([...this.#orderbook, ...upper]).size > 20) throw new RangeError('Invezgo: at most 20 orderbook codes per connection');
    upper.forEach((c) => this.#orderbook.add(c));
    this.#send({ op: 'subscribe', channel: 'orderbook', codes: upper });
  }

  /** Stock quote (OHLC, volume, value, freq, IEP/IEV) for `codes` (1 to 50 codes per connection). */
  subscribeStock(codes: string[]): void {
    if (!Array.isArray(codes) || codes.length === 0) throw new TypeError('Invezgo: stock `codes` must not be empty');
    const upper = codes.map((c) => c.toUpperCase());
    if (new Set([...this.#stock, ...upper]).size > 50) throw new RangeError('Invezgo: at most 50 stock quote codes per connection');
    upper.forEach((c) => this.#stock.add(c));
    this.#send({ op: 'subscribe', channel: 'stock', codes: upper });
  }

  /** Index quotes for `codes` (e.g. `['COMPOSITE', 'LQ45']`), or every index when `codes` is omitted. */
  subscribeIndex(codes?: string[]): void {
    const upper = codes?.map((c) => c.toUpperCase());
    if (upper) {
      const next = new Set(this.#index instanceof Set ? this.#index : []);
      upper.forEach((c) => next.add(c));
      if (next.size > 100) throw new RangeError('Invezgo: at most 100 index codes per connection');
      if (this.#index !== '*') this.#index = next;
    } else {
      this.#index = '*';
    }
    this.#send({ op: 'subscribe', channel: 'index', codes: upper });
  }

  /** Stop `codes` on `channel`, or the whole channel (and trade filters) when `codes` is omitted. */
  unsubscribe(channel: RealtimeChannel, codes?: string[]): void {
    const upper = codes?.map((c) => c.toUpperCase());
    if (channel === 'trades') {
      if (!upper) [this.#trades, this.#minLot, this.#minValue] = [null, undefined, undefined];
      else if (this.#trades instanceof Set) upper.forEach((c) => (this.#trades as Set<string>).delete(c));
    } else if (channel === 'index') {
      if (!upper) this.#index = null;
      else if (this.#index instanceof Set) upper.forEach((c) => (this.#index as Set<string>).delete(c));
    } else {
      const set = channel === 'stock' ? this.#stock : this.#orderbook;
      if (!upper) set.clear();
      else upper.forEach((c) => set.delete(c));
    }
    this.#send({ op: 'unsubscribe', channel, codes: upper });
  }

  /** Server answers with a `pong` event. */
  ping(): void {
    if (!this.#ready) throw new ConnectionError({ status: 0, message: 'Invezgo: realtime connection is not open' });
    this.#send({ op: 'ping' });
  }

  /** Close for good (no reconnect). */
  close(): void {
    this.#closed = true;
    clearTimeout(this.#timer);
    this.#ws?.close(1000);
  }

  #emit(event: string, payload: unknown): void {
    this.#listeners.get(event)?.forEach((fn) => fn(payload));
  }

  /** Sends only once `connected`; earlier calls are covered by the replay on `connected`. */
  #send(message: object): void {
    if (this.#ready) this.#ws!.send(JSON.stringify(message));
  }

  #replay(): void {
    if (this.#trades) {
      this.#send({
        op: 'subscribe', channel: 'trades', codes: this.#trades === '*' ? undefined : [...this.#trades],
        min_lot: this.#minLot, min_value: this.#minValue,
      });
    }
    if (this.#orderbook.size) this.#send({ op: 'subscribe', channel: 'orderbook', codes: [...this.#orderbook] });
    if (this.#stock.size) this.#send({ op: 'subscribe', channel: 'stock', codes: [...this.#stock] });
    if (this.#index === '*' || this.#index?.size) {
      this.#send({ op: 'subscribe', channel: 'index', codes: this.#index === '*' ? undefined : [...this.#index] });
    }
  }

  #connect(): void {
    const statusKey = this.#url.replace(/^ws/, 'http');
    if (this.#native) handshakeStatus.set(statusKey, 0);
    let opened = false;
    let failure = '';
    const ws = new this.#WS(this.#url, { headers: { Authorization: `Bearer ${this.#apiKey}`, 'User-Agent': `invezgo-js-sdk/${VERSION}` } });
    this.#ws = ws;
    ws.onopen = () => {
      opened = true;
      handshakeStatus.delete(statusKey);
    };
    ws.onerror = (ev) => {
      failure = String(ev?.message ?? '');
    };
    ws.onmessage = (ev) => {
      let msg: RealtimeMessage;
      try {
        msg = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      if (msg.type === 'connected') {
        this.#ready = true;
        this.#attempt = 0;
        this.#replay();
      }
      this.#emit('message', msg);
      if (msg.type === 'error') {
        this.#emit('error', new ValidationError({ status: 400, message: String(msg.message), body: msg }));
      } else if (typeof msg.type === 'string') {
        this.#emit(msg.type, msg);
      }
    };
    ws.onclose = (ev) => {
      this.#ready = false;
      let fatal = this.#closed || ev.code === 4400;
      if (!opened) {
        // `ws` reports "Unexpected server response: 401"; undici only via diagnostics_channel.
        const status = Number(/response: (\d{3})/.exec(failure)?.[1] ?? handshakeStatus.get(statusKey) ?? 0);
        handshakeStatus.delete(statusKey);
        if (!this.#closed) {
          this.#emit('error', handshakeError(status, failure));
          fatal ||= status === 401 || status === 403;
        }
      }
      this.#emit('close', { code: ev.code, reason: String(ev.reason ?? '') });
      if (fatal || !this.#reconnect) return;
      const delay = Math.min(2 ** this.#attempt, 30);
      this.#attempt++;
      this.#emit('reconnect', { attempt: this.#attempt, delay });
      this.#timer = setTimeout(() => this.#connect(), delay * 1000);
    };
  }
}

function handshakeError(status: number, detail: string): InvezgoError {
  const init = { status, message: `Invezgo: realtime handshake failed${status ? ` (HTTP ${status})` : ''}${detail ? `: ${detail}` : ''}`, path: '/ws' };
  if (status === 401) return new AuthenticationError(init);
  if (status === 403) return new PaymentRequiredError(init);
  if (status === 429) return new RateLimitError({ ...init, retryAfter: 0, quotaExceeded: false });
  if (status >= 500) return new ServerError(init);
  return new ConnectionError(init);
}
