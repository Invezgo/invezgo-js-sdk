/**
 * Invezgo SDK for JavaScript and TypeScript.
 *
 * Official SDK for accessing Invezgo API.
 *
 * @packageDocumentation
 */

export { Invezgo } from './invezgo';
export { InvezgoError } from './client';
export * from './types';

// Re-export endpoint DTOs for convenience.
export * from './endpoints/alerts';
export * from './endpoints/watchlists';
export * from './endpoints/journals';
export * from './endpoints/membership';
export * from './endpoints/trades';
export * from './endpoints/screener';
export * from './endpoints/recommendation';

import { Invezgo } from './invezgo';

export default Invezgo;
