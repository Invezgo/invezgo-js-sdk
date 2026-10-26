import { InvezgoResources } from './generated/resources';
import { Transport, type InvezgoConfig } from './http';

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

  constructor(config: InvezgoConfig) {
    const transport = new Transport(config);
    super(transport);
    this.#transport = transport;
  }

  /** Drop every cached response. */
  clearCache(): void {
    this.#transport.clearCache();
  }
}

export { Invezgo as InvezgoClient };
