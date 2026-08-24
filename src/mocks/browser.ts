import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * MSW browser worker instance
 *
 * This worker intercepts network requests in the browser and routes them
 * to the handlers generated from mock.config.ts.
 *
 * Features:
 * - Handlers are generated from centralized configuration
 * - Only enabled endpoints are mocked
 * - Disabled endpoints pass through to real API
 * - Support for scenarios and dynamic configuration
 */
export const worker = setupWorker(...handlers);

/**
 * Update handlers at runtime (for scenario switching)
 */
export function updateHandlers(newHandlers: typeof handlers) {
  worker.resetHandlers(...newHandlers);
}
