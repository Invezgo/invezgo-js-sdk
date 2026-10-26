/** Fields shared by every error thrown by the SDK. */
export interface InvezgoErrorInit {
  status: number;
  message: string;
  error?: string;
  requestId?: string;
  path?: string;
  body?: unknown;
  cause?: unknown;
}

/**
 * Base class of every SDK error. Use `instanceof` on the subclasses to branch.
 *
 * - `status` — HTTP status code (`0` for network/timeout errors)
 * - `message` — human readable message from the API
 * - `error` — HTTP status text from the API body (e.g. `Unauthorized`)
 * - `requestId` — quote this to Invezgo support
 * - `body` — decoded JSON error body (or raw text)
 */
export class InvezgoError extends Error {
  readonly status: number;
  readonly error?: string;
  readonly requestId?: string;
  readonly path?: string;
  readonly body?: unknown;

  constructor(init: InvezgoErrorInit) {
    super(init.message, init.cause === undefined ? undefined : { cause: init.cause });
    this.name = new.target.name;
    this.status = init.status;
    this.error = init.error;
    this.requestId = init.requestId;
    this.path = init.path;
    this.body = init.body;
  }
}

/** 400 / 422 — invalid parameters or body (see `message`). */
export class ValidationError extends InvezgoError {}

/** 401 — API key missing, invalid or expired. */
export class AuthenticationError extends InvezgoError {}

/** 402 — your subscription plan does not include this endpoint. */
export class PaymentRequiredError extends InvezgoError {}

/** 404 — resource not found. */
export class NotFoundError extends InvezgoError {}

/** >= 500 — server side error; usually safe to retry later. */
export class ServerError extends InvezgoError {}

/** 429 — every configured API key is rate limited or out of monthly quota. */
export class RateLimitError extends InvezgoError {
  /** Seconds until the earliest key becomes usable again. */
  readonly retryAfter: number;
  /** `X-RateLimit-Limit` of the last 429 response (requests per minute). */
  readonly limit?: number;
  /** `X-RateLimit-Remaining` of the last 429 response. */
  readonly remaining?: number;
  /** `X-RateLimit-Reset` of the last 429 response (Unix seconds). */
  readonly reset?: number;
  /** `true` when the monthly quota (not the per-minute limit) is exhausted. */
  readonly quotaExceeded: boolean;

  constructor(
    init: InvezgoErrorInit & { retryAfter: number; limit?: number; remaining?: number; reset?: number; quotaExceeded: boolean },
  ) {
    super(init);
    this.retryAfter = init.retryAfter;
    this.limit = init.limit;
    this.remaining = init.remaining;
    this.reset = init.reset;
    this.quotaExceeded = init.quotaExceeded;
  }
}

/** Network failure: DNS, connection refused, TLS, aborted socket… (`status` = 0). */
export class ConnectionError extends InvezgoError {}

/** The request exceeded the configured `timeout` (`status` = 0). */
export class TimeoutError extends ConnectionError {}

/** Map an HTTP status to the matching error class. */
export function errorClassFor(status: number): new (init: InvezgoErrorInit) => InvezgoError {
  if (status === 400 || status === 422) return ValidationError;
  if (status === 401) return AuthenticationError;
  if (status === 402) return PaymentRequiredError;
  if (status === 404) return NotFoundError;
  if (status >= 500) return ServerError;
  return InvezgoError;
}
