import { InvezgoResources } from './generated/resources';
import { DEFAULT_BASE_URL, Transport, type InvezgoConfig } from './http';
import { InvezgoRealtime, type RealtimeOptions } from './realtime';

/**
 * Invezgo API client.
 *
 * ```ts
 * const client = new Invezgo({ apiKey: process.env.INVEZGO_API_KEY! });
 * const stocks = await client.analysis.getStockList();
 * ```
 */
export class Invezgo extends InvezgoResources {
  readonly #transport: Transport;
  readonly #config: InvezgoConfig;

  constructor(config: InvezgoConfig) {
    const transport = new Transport(config);
    super(transport);
    this.#transport = transport;
    this.#config = config;
  }

  /** Drop every cached response. */
  clearCache(): void {
    this.#transport.clearCache();
  }

  /** Open the real-time WebSocket stream with this client's `apiKey`; the URL is derived from `baseUrl` (`https` → `wss`, + `/ws`). */
  realtime(options: Omit<RealtimeOptions, 'apiKey' | 'url'> = {}): InvezgoRealtime {
    const url = `${(this.#config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '').replace(/^http/, 'ws')}/ws`;
    return new InvezgoRealtime({ ...options, apiKey: this.#config.apiKey, url });
  }
}

export { Invezgo as InvezgoClient };
