import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import crypto from 'node:crypto';
import { Invezgo, InvezgoRealtime, AuthenticationError, ValidationError, VERSION } from '../dist/index.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (fn, ms = 3000) => {
  for (const end = Date.now() + ms; Date.now() < end; await sleep(10)) if (fn()) return;
  assert.fail('timed out waiting for condition');
};

/** Minimal in-process WebSocket server (unfragmented text frames + close only). */
function frame(opcode, payload) {
  const len = payload.length;
  const head = len < 126 ? Buffer.from([0x80 | opcode, len]) : Buffer.from([0x80 | opcode, 126, len >> 8, len & 255]);
  return Buffer.concat([head, payload]);
}
function wrap(socket, req) {
  const conn = {
    headers: req.headers,
    received: [],
    send: (obj) => socket.write(frame(1, Buffer.from(JSON.stringify(obj)))),
    close: (code, reason = '') => {
      const p = Buffer.alloc(2 + Buffer.byteLength(reason));
      p.writeUInt16BE(code);
      p.write(reason, 2);
      socket.end(frame(8, p));
    },
  };
  let buf = Buffer.alloc(0);
  socket.on('data', (chunk) => {
    buf = Buffer.concat([buf, chunk]);
    for (;;) {
      if (buf.length < 2) return;
      const opcode = buf[0] & 15;
      let len = buf[1] & 127;
      let off = 2;
      if (len === 126) [len, off] = [buf.readUInt16BE(2), 4];
      if (buf.length < off + 4 + len) return;
      const mask = buf.subarray(off, off + 4);
      const data = Buffer.from(buf.subarray(off + 4, off + 4 + len)).map((b, i) => b ^ mask[i % 4]);
      buf = buf.subarray(off + 4 + len);
      if (opcode === 1) conn.received.push(JSON.parse(data.toString()));
      if (opcode === 8) socket.end();
    }
  });
  socket.on('error', () => {});
  return conn;
}

let server;
let baseUrl;
let wsUrl;
let conns = [];
/** (req) => HTTP status to reject the handshake with, or undefined to accept. */
let reject;
/** Called with each accepted connection. */
let onConn;

before(async () => {
  server = http.createServer();
  server.on('upgrade', (req, socket) => {
    const status = reject(req);
    if (status) {
      socket.end(`HTTP/1.1 ${status} Rejected\r\nContent-Length: 0\r\n\r\n`);
      return;
    }
    const accept = crypto.createHash('sha1').update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
    socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
    const conn = wrap(socket, req);
    conns.push(conn);
    onConn(conn);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  wsUrl = `ws://127.0.0.1:${server.address().port}/ws`;
});

after(() => {
  server.closeAllConnections?.();
  server.close();
});

beforeEach(() => {
  conns = [];
  reject = () => undefined;
  onConn = (c) => setTimeout(() => c.send({ type: 'connected' }), 50);
});

test('realtime: auth headers, queued subscriptions replayed on connected, message decoding', async () => {
  const rt = new Invezgo({ apiKey: 'KEY', baseUrl: baseUrl + '/' }).realtime({ reconnect: false });
  const events = {};
  for (const name of ['connected', 'subscribed', 'trades', 'orderbook', 'pong', 'lagged', 'message']) {
    rt.on(name, (m) => (events[name] ??= []).push(m));
  }
  rt.subscribeTrades(['bbca', 'tlkm'], { minLot: 500 });
  rt.subscribeOrderbook(['bbca']);
  assert.throws(() => rt.ping());

  await until(() => conns[0]?.received.length === 2);
  const c = conns[0];
  assert.equal(c.headers.authorization, 'Bearer KEY');
  assert.equal(c.headers['user-agent'], `invezgo-js-sdk/${VERSION}`);
  assert.deepEqual(c.received, [
    { op: 'subscribe', channel: 'trades', codes: ['BBCA', 'TLKM'], min_lot: 500 },
    { op: 'subscribe', channel: 'orderbook', codes: ['BBCA'] },
  ]);

  rt.subscribeTrades(['isat'], { minValue: 0 });
  rt.unsubscribe('orderbook');
  rt.ping();
  await until(() => c.received.length === 5);
  assert.deepEqual(c.received.slice(2), [
    { op: 'subscribe', channel: 'trades', codes: ['ISAT'], min_value: 0 },
    { op: 'unsubscribe', channel: 'orderbook' },
    { op: 'ping' },
  ]);

  const trades = { type: 'trades', ts: 1793240653184, data: [{ id: '202610290000255958', time: '092413', code: 'ISAT', price: 1465.5, lot: 9, value: 1318500, change: -105, side: 'buy' }] };
  const book = { type: 'orderbook', code: 'BBCA', side: 'bid', levels: [{ price: 9875, lot: 10 }], seq: null };
  c.send({ type: 'subscribed', channel: 'trades', codes: '*', min_lot: 0, min_value: 0 });
  c.send(trades);
  c.send(book);
  c.send({ type: 'pong' });
  c.send({ type: 'lagged', missed: 120 });
  c.send({ type: 'brand-new', x: 1 });
  await until(() => events.message?.length === 7);
  assert.equal(events.connected.length, 1);
  assert.equal(events.subscribed[0].codes, '*');
  assert.deepEqual(events.trades[0], trades);
  assert.equal(typeof events.trades[0].data[0].id, 'string');
  assert.deepEqual(events.orderbook[0], book);
  assert.equal(events.pong.length, 1);
  assert.equal(events.lagged[0].missed, 120);
  assert.deepEqual(events.message.at(-1), { type: 'brand-new', x: 1 });
  rt.close();
});

test('realtime: reconnect replays the subscription state', async () => {
  const rt = new InvezgoRealtime({ apiKey: 'KEY', url: wsUrl });
  const reconnects = [];
  const closes = [];
  rt.on('reconnect', (r) => reconnects.push(r));
  rt.on('close', (c) => closes.push(c.code));
  rt.subscribeTrades(undefined, { minLot: 100 });
  rt.subscribeOrderbook(['BBCA', 'tlkm']);
  rt.unsubscribe('orderbook', ['TLKM']);
  rt.subscribeStock(['bbca']);
  rt.subscribeIndex(['composite', 'LQ45']);
  rt.unsubscribe('index', ['LQ45']);
  await until(() => conns[0]?.received.length === 4);
  conns[0].close(1011, 'restart');

  await until(() => conns[1]?.received.length === 4);
  assert.deepEqual(reconnects, [{ attempt: 1, delay: 1 }]);
  assert.deepEqual(closes, [1011]);
  assert.deepEqual(conns[1].received, [
    { op: 'subscribe', channel: 'trades', min_lot: 100 },
    { op: 'subscribe', channel: 'orderbook', codes: ['BBCA'] },
    { op: 'subscribe', channel: 'stock', codes: ['BBCA'] },
    { op: 'subscribe', channel: 'index', codes: ['COMPOSITE'] },
  ]);
  rt.close();
  await sleep(50);
  assert.equal(conns.length, 2);
});

test('realtime: close code 4400 stops reconnecting', async () => {
  onConn = (c) => {
    c.send({ type: 'connected' });
    setTimeout(() => {
      c.send({ type: 'error', message: 'unknown op' });
      c.close(4400, 'invalid message');
    }, 50);
  };
  const rt = new InvezgoRealtime({ apiKey: 'KEY', url: wsUrl });
  const errors = [];
  const closes = [];
  rt.on('error', (e) => errors.push(e));
  rt.on('close', (c) => closes.push(c));
  rt.on('reconnect', () => assert.fail('must not reconnect'));
  await until(() => closes.length === 1);
  assert.equal(closes[0].code, 4400);
  assert.ok(errors[0] instanceof ValidationError);
  assert.equal(errors[0].message, 'unknown op');
  await sleep(1300);
  assert.equal(conns.length, 1);
});

test('realtime: handshake 401 raises AuthenticationError without reconnecting', async () => {
  let attempts = 0;
  reject = () => (attempts++, 401);
  const rt = new InvezgoRealtime({ apiKey: 'BAD', url: wsUrl });
  const errors = [];
  rt.on('error', (e) => errors.push(e));
  rt.on('reconnect', () => assert.fail('must not reconnect'));
  await until(() => errors.length === 1);
  assert.ok(errors[0] instanceof AuthenticationError);
  assert.equal(errors[0].status, 401);
  const seen = attempts;
  await sleep(1300);
  assert.equal(attempts, seen);
});

test('realtime: client-side guards', () => {
  const rt = new InvezgoRealtime({ apiKey: 'KEY', url: wsUrl, reconnect: false });
  assert.throws(() => rt.subscribeOrderbook([]), TypeError);
  assert.throws(() => rt.subscribeOrderbook(Array.from({ length: 21 }, (_, i) => `C${i}`)), RangeError);
  assert.throws(() => rt.subscribeTrades(Array.from({ length: 201 }, (_, i) => `C${i}`)), RangeError);
  assert.throws(() => rt.subscribeStock([]), TypeError);
  assert.throws(() => rt.subscribeStock(Array.from({ length: 51 }, (_, i) => `C${i}`)), RangeError);
  assert.throws(() => rt.subscribeIndex(Array.from({ length: 101 }, (_, i) => `C${i}`)), RangeError);
  assert.throws(() => new InvezgoRealtime({ apiKey: '' }), TypeError);
  rt.close();
});
