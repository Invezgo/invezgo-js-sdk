/**
 * Official Invezgo API SDK for JavaScript and TypeScript.
 *
 * @packageDocumentation
 */

export { Invezgo, InvezgoClient } from './client';
export { VERSION, DEFAULT_BASE_URL } from './http';
export type { InvezgoConfig, CacheOptions, RequestOptions } from './http';
export {
  InvezgoError,
  ValidationError,
  AuthenticationError,
  PaymentRequiredError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ConnectionError,
  TimeoutError,
} from './errors';
export type { InvezgoErrorInit } from './errors';
export { verifyWebhook, parseWebhook, isWebhookEvent, WebhookVerificationError } from './webhook';
export type {
  WebhookEvent,
  WebhookEventMap,
  WebhookHeaders,
  VerifyWebhookOptions,
  WebhookVerificationReason,
  WebhookUpdateData,
  WebhookAlertStock,
  WebhookAlertTriggeredData,
  WebhookAlertDisabledData,
  WebhookTestPingData,
  WebhookQuotaData,
} from './webhook';
export { InvezgoRealtime, DEFAULT_REALTIME_URL } from './realtime';
export type {
  RealtimeOptions,
  RealtimeEvents,
  RealtimeMessage,
  RealtimeTrade,
  TradesFilter,
  ConnectedMessage,
  PongMessage,
  SubscribedMessage,
  ErrorMessage,
  LaggedMessage,
  TradesMessage,
  OrderbookMessage,
  StockMessage,
  IndexMessage,
  RealtimeChannel,
  WebSocketLike,
  WebSocketConstructor,
} from './realtime';
export * from './generated/resources';
export * from './generated/types';

import { Invezgo } from './client';
export default Invezgo;
