interface Entry {
  body: string;
  size: number;
  expiresAt: number;
}

const encoder = new TextEncoder();

/**
 * In-memory (L1) LRU cache of raw response bodies.
 *
 * A `Map` keeps insertion order, so re-inserting a key on every hit makes the first key the
 * least recently used. Bounded by entry count and total UTF-8 bytes; expired entries are
 * dropped lazily on access or when evicted — no timers.
 */
export class LruCache {
  private readonly map = new Map<string, Entry>();
  private totalBytes = 0;

  constructor(
    readonly maxEntries: number,
    readonly maxBytes: number,
    private readonly now: () => number = () => performance.now(),
  ) {}

  /** Number of entries currently stored (including not-yet-evicted expired ones). */
  get size(): number {
    return this.map.size;
  }

  /** Total bytes of all stored bodies. */
  get bytes(): number {
    return this.totalBytes;
  }

  get(key: string): string | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    this.map.delete(key);
    if (entry.expiresAt <= this.now()) {
      this.totalBytes -= entry.size;
      return undefined;
    }
    this.map.set(key, entry);
    return entry.body;
  }

  /** Store `body` for `ttlMs`. Bodies larger than `maxBytes` are not cached. */
  set(key: string, body: string, ttlMs: number): void {
    const size = encoder.encode(body).length;
    this.delete(key);
    if (ttlMs <= 0 || size > this.maxBytes || this.maxEntries <= 0) return;
    this.map.set(key, { body, size, expiresAt: this.now() + ttlMs });
    this.totalBytes += size;
    for (const [oldest, entry] of this.map) {
      if (this.map.size <= this.maxEntries && this.totalBytes <= this.maxBytes) break;
      this.map.delete(oldest);
      this.totalBytes -= entry.size;
    }
  }

  delete(key: string): void {
    const entry = this.map.get(key);
    if (entry) {
      this.map.delete(key);
      this.totalBytes -= entry.size;
    }
  }

  /** Delete every entry whose key matches `predicate`. */
  deleteWhere(predicate: (key: string) => boolean): void {
    for (const key of [...this.map.keys()]) if (predicate(key)) this.delete(key);
  }

  clear(): void {
    this.map.clear();
    this.totalBytes = 0;
  }
}
