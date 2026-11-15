/** Why a webhook delivery was rejected. */
export type WebhookVerificationReason = 'timestamp' | 'signature' | 'payload';

/** Thrown by {@link verifyWebhook} / {@link parseWebhook}. Not an HTTP API error. */
export class WebhookVerificationError extends Error {
  readonly reason: WebhookVerificationReason;

  constructor(reason: WebhookVerificationReason, message: string, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'WebhookVerificationError';
    this.reason = reason;
  }
}

/** `data` of every `update.*` event. */
export interface WebhookUpdateData {
  /** `YYYY-MM-DD` (`YYYY-MM-DD HH:mm:ss` WIB for `update.news`). */
  date: string;
  /** API endpoints whose data changed. */
  path: string[];
  code?: string;
  title?: string;
}

export interface WebhookAlertStock {
  code: string;
  price: number;
}

/** `data` of `alert.triggered`. */
export interface WebhookAlertTriggeredData {
  alert_id: string;
  alert_name: string;
  stocks_in: WebhookAlertStock[];
  stocks_out: WebhookAlertStock[];
}

/** `data` of `alert.disabled`. */
export interface WebhookAlertDisabledData {
  alert_id: string;
  alert_name: string;
  reason: string;
}

/** `data` of `test.ping`. */
export interface WebhookTestPingData {
  message: string;
}

/** `data` of `quota.low` / `quota.exhausted`. */
export interface WebhookQuotaData {
  plan: string;
  limit: number;
  used: number;
  remaining: number;
  /** Unix seconds. */
  reset_at: number | null;
}

type UpdateType =
  | 'summary' | 'notation' | 'news' | 'disclosure' | 'financial' | 'five' | 'one' | 'classification'
  | 'ksei' | 'hsc' | 'shareholder' | 'insider' | 'uma' | 'suspend' | 'calendar';

/** Documented event name (`{domain}.{type}`) → `data` type. */
export type WebhookEventMap = { [K in `update.${UpdateType}`]: WebhookUpdateData } & {
  'alert.triggered': WebhookAlertTriggeredData;
  'alert.disabled': WebhookAlertDisabledData;
  'test.ping': WebhookTestPingData;
  'quota.low': WebhookQuotaData;
  'quota.exhausted': WebhookQuotaData;
};

/** A webhook delivery. `domain`/`type` are plain strings so new events never break decoding. */
export interface WebhookEvent<D = Record<string, unknown>> {
  /** Delivery id (same as `X-Invezgo-Delivery`); stable across retries, use it to deduplicate. */
  id: string;
  domain: string;
  type: string;
  /** Unix seconds. */
  created_at: number;
  data: D;
  /** `"{domain}.{type}"`, e.g. `update.summary`. */
  event: string;
}

/** Narrow an event to a documented event name so `data` gets its typed shape. */
export function isWebhookEvent<K extends keyof WebhookEventMap>(event: WebhookEvent<unknown>, name: K): event is WebhookEvent<WebhookEventMap[K]> {
  return event.event === name;
}

/** Request headers: a `Headers` instance, Node's `req.headers`, or `{ signature, timestamp }`. */
export type WebhookHeaders = Headers | Record<string, string | string[] | undefined>;

export interface VerifyWebhookOptions {
  /** Maximum age/skew of `X-Invezgo-Timestamp` in seconds. Default `300`. */
  tolerance?: number;
  /** Current Unix time in seconds (for tests). Default `Date.now() / 1000`. */
  now?: number;
}

const encoder = new TextEncoder();

function header(headers: WebhookHeaders, name: string, short: string): string {
  if (typeof (headers as Headers).get === 'function') return (headers as Headers).get(name) ?? '';
  const wanted = [name.toLowerCase(), short];
  for (const [key, value] of Object.entries(headers)) {
    if (wanted.includes(key.toLowerCase())) return (Array.isArray(value) ? value[0] : value) ?? '';
  }
  return '';
}

/** Decode a webhook body without verifying it (tests or already-verified bodies). */
export function parseWebhook<D = Record<string, unknown>>(rawBody: string | Uint8Array): WebhookEvent<D> {
  let event: WebhookEvent<D>;
  try {
    event = JSON.parse(typeof rawBody === 'string' ? rawBody : new TextDecoder().decode(rawBody));
  } catch (cause) {
    throw new WebhookVerificationError('payload', 'Invezgo webhook: body is not valid JSON', cause);
  }
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    throw new WebhookVerificationError('payload', 'Invezgo webhook: body is not a JSON object');
  }
  event.event = `${event.domain}.${event.type}`;
  return event;
}

/**
 * Verify the `X-Invezgo-Signature` of a webhook delivery and decode it.
 *
 * `rawBody` must be the exact bytes/string received, before any JSON parsing.
 * Throws {@link WebhookVerificationError} with `reason` `timestamp`, `signature` or `payload`.
 */
export async function verifyWebhook<D = Record<string, unknown>>(
  rawBody: string | Uint8Array,
  headers: WebhookHeaders,
  secret: string,
  options: VerifyWebhookOptions = {},
): Promise<WebhookEvent<D>> {
  if (typeof secret !== 'string' || !secret) throw new TypeError('Invezgo webhook: `secret` is required');
  const timestamp = header(headers, 'X-Invezgo-Timestamp', 'timestamp');
  const signature = header(headers, 'X-Invezgo-Signature', 'signature');
  const now = options.now ?? Date.now() / 1000;
  if (!/^\d+$/.test(timestamp) || Math.abs(now - Number(timestamp)) > (options.tolerance ?? 300)) {
    throw new WebhookVerificationError('timestamp', 'Invezgo webhook: timestamp is missing, invalid or outside the tolerance');
  }

  const hex = /^sha256=([0-9a-f]{64})$/.exec(signature)?.[1];
  const body = typeof rawBody === 'string' ? encoder.encode(rawBody) : rawBody;
  const prefix = encoder.encode(`${timestamp}.`);
  const message = new Uint8Array(prefix.length + body.length);
  message.set(prefix);
  message.set(body, prefix.length);
  const key = await globalThis.crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  // subtle.verify compares the MAC in constant time.
  const valid = !!hex && (await globalThis.crypto.subtle.verify('HMAC', key, Uint8Array.from(hex.match(/../g)!, (h) => parseInt(h, 16)), message));
  if (!valid) throw new WebhookVerificationError('signature', 'Invezgo webhook: signature mismatch');

  return parseWebhook<D>(body);
}
