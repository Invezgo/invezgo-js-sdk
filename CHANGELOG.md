# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-27

Major rewrite generated from the official OpenAPI spec (Invezgo API 1.2, 107 endpoints).

### Added
- Fully typed surface generated from OpenAPI: every model, query params type (`<Name>Params`), request body (`*Request`) and response type, with literal-union enums, nullable fields and TSDoc on every method/field.
- Built-in in-memory LRU cache (enabled by default) keyed by canonical URL, bounded by `maxEntries` (1000) and `maxBytes` (32 MiB); TTL `60s` for regular GETs and `5s` for `[REALTIME]` endpoints; automatic purge of personal data after successful mutations; `client.clearCache()`.
- `additionalApiKeys`: automatic API key rotation on HTTP 429 (per-endpoint block for per-minute limits, whole-key block for monthly quota, honours `Retry-After`).
- Typed errors: `ValidationError`, `AuthenticationError`, `PaymentRequiredError`, `NotFoundError`, `RateLimitError`, `ServerError`, `ConnectionError`, `TimeoutError`.
- New endpoints: `usage.getLogs`, `analysis.getNews`, `analysis.getDisclosure`, `analysis.getUma`, `analysis.getSuspend`, `analysis.getNotation`, and more.
- `options.signal` (AbortSignal) on every method, custom `fetch` in config.
- `docs/API.md` reference and typechecked examples.

### Changed (breaking)
- Requires Node.js >= 18 (native `fetch`).
- Config `baseURL` renamed to `baseUrl`.
- Query parameters are passed as one typed object with the exact API names, e.g. `getTopChange({ date })`.
- Renamed methods (see [Migrating from 1.x](#migrating-from-1x)), e.g. `alerts.add` → `alerts.create`, `posts.getAll` → `posts.list`, `batch.getOrderBookBatch` → `batch.getOrderBook`.
- `InvezgoError.statusCode` → `status`; empty / `null` bodies resolve to `null` instead of `[]`.
- ESM build is now `dist/index.mjs`.

### Migrating from 1.x

| 1.x | 2.0 |
|---|---|
| `new Invezgo({ apiKey, baseURL })` | `new Invezgo({ apiKey, baseUrl })` |
| Query arguments, e.g. `getTopChange('2024-12-30')` | One params object with API field names, e.g. `getTopChange({ date: '2024-12-30' })` |
| `InvezgoError.statusCode` | `InvezgoError.status`, plus typed subclasses |
| Empty / 204 response returned `[]` | Empty or `null` body returns `null` |
| `analysis.getChart` | `analysis.getAdvanceChart` |
| `analysis.getRunningTrade` | `analysis.getStockRunningTrade` |
| `analysis.getShareholderDetailOne` | `analysis.getShareholderOneDetail` |
| `analysis.getBrokerSummaryStock` / `getBrokerSummaryBroker` | `analysis.getSummaryStock` / `getSummaryBroker` |
| `analysis.getBrokerSummaryChartStock` / `getBrokerSummaryChartBroker` | `analysis.getSummaryStockChart` / `getSummaryBrokerChart` |
| `analysis.getStalkerSector` | `analysis.getSectorStalker` |
| `analysis.getInsiderTrading` | `analysis.getInsider` |
| `analysis.getKeyStat` / `getKeyStatChart` | `analysis.getKeystat` / `getKeystatChart` |
| `analysis.getTopRetail` | `analysis.getTopRitel` |
| `analysis.getCorporateActionCalendar` | `analysis.getCalendar` |
| `batch.getOrderBookBatch` / `getIntradayDataBatch` / `getIntradayIndexBatch` | `batch.getOrderBook` / `getIntradayData` / `getIntradayIndex` |
| `alerts.add` | `alerts.create` |
| `posts.getAll` / `getByCategory` / `getStockPosts` / `getStockCategoryPosts` | `posts.list` / `listByCategory` / `listByStock` / `listByStockCategory` |
| `posts.getPostById` / `getLiked` | `posts.get` / `getLikes` |

### Removed
- `profile`, `membership`, `recommendation`, `ai` modules and `journals.extractFromFile` / `journals.updateNote` (not part of the official API spec).

## [1.2.0] - 2026-06-12

### Added
- Missing analysis endpoints: `getMultiTimeChart`, `getShareholderHigh`, `getShareholderClassification`, and `getShareholderClassifyTable`
- New API Usage statistics module (`usage`) with `getApiUsage()` method to monitor request volume and limits
- Added types for newly added endpoints in `src/types.ts`

## [1.1.0] - 2026-03-11

### Changed
- Migrated the SDK surface to match the latest API contract
- Removed undocumented legacy modules for `ai` and `health`
- Updated watchlist, journal, membership, and screener DTOs to the latest request schema
- Expanded `analysis` coverage for index, retail flow, intraday summary, sector stalker, shareholder 1%, and corporate action endpoints

### Added
- Added `alerts` endpoint module
- Added `recommendation` endpoint module
- Added missing watchlist group update/delete support
- Added screener preset update/delete support

## [1.0.0] - 2024-12-30

### Added
- Initial release of Invezgo SDK for JavaScript and TypeScript
- Full TypeScript support with complete type definitions
- CommonJS and ES Modules support
- Comprehensive API coverage:
  - Analysis endpoints (30+ methods)
  - Watchlist management
  - Trading journals
  - Portfolio tracking
  - AI-powered analysis
  - Stock screening
  - Search functionality
  - Profile and social features
  - Membership management
  - Posts and community features
  - Trade tracking
  - Health checks
- Error handling with typed exceptions
- Zero dependencies
- Browser and Node.js support
- Comprehensive documentation and examples

### Features
- Real-time stock data from Indonesia Stock Exchange (BEI)
- Financial statements (Balance Sheet, Income Statement, Cash Flow)
- Broker analysis and bandarmology
- Shareholder analysis and insider trading
- Chart data with technical indicators
- Order book and intraday data
- AI-powered insights

[1.2.0]: https://github.com/Invezgo/invezgo-js-sdk/releases/tag/v1.2.0
[1.1.0]: https://github.com/Invezgo/invezgo-js-sdk/releases/tag/v1.1.0
[1.0.0]: https://github.com/Invezgo/invezgo-js-sdk/releases/tag/v1.0.0


