/**
 * MSW Request Handlers
 *
 * This file generates MSW handlers from the centralized mock configuration.
 * All mock endpoint definitions are now managed in mock.config.ts.
 *
 * Benefits of this approach:
 * - Centralized configuration for all mocks
 * - Easy to enable/disable specific endpoints
 * - Type-safe mock definitions
 * - Reusable mock data
 * - Declarative and maintainable
 */

import type { HttpHandler } from "msw";
import { mockEndpoints } from "./mock.config";
import { createHandlers } from "./handlerFactory";

/**
 * Generate handlers from configuration
 *
 * To add new mocks:
 * 1. Open mock.config.ts
 * 2. Add a new MockEndpointConfig object to the mockEndpoints array
 * 3. Set enabled: true and define the response
 *
 * To disable a mock (use real API):
 * - Set enabled: false in mock.config.ts
 */
export const handlers: HttpHandler[] = createHandlers(mockEndpoints);
