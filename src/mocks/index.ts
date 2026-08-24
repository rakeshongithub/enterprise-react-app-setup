/**
 * MSW (Mock Service Worker) initialization
 *
 * This module conditionally starts MSW only in development mode.
 * In production or other environments, this is a no-op.
 *
 * Usage:
 * - Import and call enableMocking() before rendering your React app
 * - MSW will only be enabled when VITE_ENABLE_MSW is 'true'
 * - Mock configurations are defined in mock.config.ts
 * - Use scenarios for different testing situations
 * - Endpoints without handlers will pass through to real APIs
 */

import { mockConfig } from "./mock.config";
import { logMockSummary } from "./utils";
import { mockEndpoints } from "./mock.config";

export async function enableMocking() {
  // Only enable mocking when explicitly configured
  if (!mockConfig.enabled || import.meta.env.MODE !== "development") {
    return;
  }

  const { worker } = await import("./browser");

  // Log mock configuration summary
  if (mockConfig.logRequests) {
    logMockSummary(mockEndpoints);
  }

  // Start the service worker
  return worker.start({
    onUnhandledRequest: mockConfig.onUnhandledRequest,
    quiet: !mockConfig.logRequests,
  });
}

// Export mock utilities for advanced usage
export { mockConfig, mockEndpoints } from "./mock.config";
export { scenarios, type ScenarioName } from "./scenarios";
export * from "./utils";
