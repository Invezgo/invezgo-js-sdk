import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyWebhook, parseWebhook, isWebhookEvent, WebhookVerificationError, InvezgoError } from '../dist/index.mjs';

const SECRET = 'whsec_test';
const NOW = 1762425300;
const body = JSON.stringify({ id: 'd1', domain: 'update', type: 'summary', created_at: NOW, data: { date: '2026-11-06', path: ['/analysis/summary/stock/BBCA'] } });
const sign = (ts, raw, secret = SECRET) => 'sha256=' + crypto.createHmac('sha256', secret).update(`${ts}.${raw}`).digest('hex');
const headers = (ts = String(NOW), raw = body) => ({ 'x-invezgo-timestamp': ts, 'x-invezgo-signature': sign(ts, raw), 'x-invezgo-event': 'update.summary' });

const rejects = (promise, reason) =>
  assert.rejects(promise, (err) => err instanceof WebhookVerificationError && !(err instanceof InvezgoError) && err.reason === reason);

test('webhook: valid signature (string and bytes) decodes the event', async () => {
  const event = await verifyWebhook(body, headers(), SECRET, { now: NOW });
  assert.equal(event.id, 'd1');
  assert.equal(event.event, 'update.summary');
  assert.ok(isWebhookEvent(event, 'update.summary'));
  assert.deepEqual(event.data.path, ['/analysis/summary/stock/BBCA']);
  const fromBytes = await verifyWebhook(Buffer.from(body), headers(), SECRET, { now: NOW + 299 });
  assert.equal(fromBytes.domain, 'update');
});

test('webhook: headers are case-insensitive (record, Headers, short keys)', async () => {
  const h = headers();
  await verifyWebhook(body, { 'X-Invezgo-Timestamp': h['x-invezgo-timestamp'], 'X-INVEZGO-SIGNATURE': h['x-invezgo-signature'] }, SECRET, { now: NOW });
  await verifyWebhook(body, new Headers({ 'X-Invezgo-Timestamp': h['x-invezgo-timestamp'], 'X-Invezgo-Signature': h['x-invezgo-signature'] }), SECRET, { now: NOW });
  await verifyWebhook(body, { timestamp: h['x-invezgo-timestamp'], signature: h['x-invezgo-signature'] }, SECRET, { now: NOW });
});

test('webhook: bad signature', async () => {
  await rejects(verifyWebhook(body, { ...headers(), 'x-invezgo-signature': sign(NOW, body, 'other') }, SECRET, { now: NOW }), 'signature');
  await rejects(verifyWebhook(body + ' ', headers(), SECRET, { now: NOW }), 'signature');
  await rejects(verifyWebhook(body, { ...headers(), 'x-invezgo-signature': 'sha256=zz' }, SECRET, { now: NOW }), 'signature');
  await rejects(verifyWebhook(body, { 'x-invezgo-timestamp': String(NOW) }, SECRET, { now: NOW }), 'signature');
});

test('webhook: stale, future and non-digit timestamps', async () => {
  await rejects(verifyWebhook(body, headers(), SECRET, { now: NOW + 301 }), 'timestamp');
  await rejects(verifyWebhook(body, headers(), SECRET, { now: NOW - 301 }), 'timestamp');
  await rejects(verifyWebhook(body, headers(), SECRET, { now: NOW + 20, tolerance: 10 }), 'timestamp');
  await rejects(verifyWebhook(body, headers('-1762425300'), SECRET, { now: NOW }), 'timestamp');
  await rejects(verifyWebhook(body, headers('1762425300.5'), SECRET, { now: NOW }), 'timestamp');
  await rejects(verifyWebhook(body, {}, SECRET, { now: NOW }), 'timestamp');
});

test('webhook: bad JSON after a valid signature', async () => {
  await rejects(verifyWebhook('not json', headers(String(NOW), 'not json'), SECRET, { now: NOW }), 'payload');
  assert.throws(() => parseWebhook('[1]'), (err) => err.reason === 'payload');
});

test('webhook: parseWebhook keeps unknown events', () => {
  const event = parseWebhook('{"id":"x","domain":"future","type":"thing","created_at":1,"data":{"a":1}}');
  assert.equal(event.event, 'future.thing');
  assert.deepEqual(event.data, { a: 1 });
});
