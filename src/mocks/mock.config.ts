/**
 * MSW Mock Configuration
 *
 * This configuration file defines which API routes should be mocked and their behavior.
 * It provides a centralized, declarative way to manage mock endpoints.
 */

import type { HttpHandler } from "msw";
import type { User } from "../services/UserService";

/**
 * Mock response configuration for an endpoint
 */
export interface MockEndpointConfig {
  /** HTTP method (GET, POST, PUT, DELETE, PATCH) */
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

  /** API endpoint path (e.g., '/users', '/users/:id') */
  path: string;

  /** Whether this endpoint should be mocked (true) or use real API (false) */
  enabled: boolean;

  /** Mock response data or a function that returns response data */
  response?: unknown | ((params?: Record<string, unknown>) => unknown);

  /** HTTP status code for the mock response (default: 200) */
  status?: number;

  /** Response delay in milliseconds (simulates network latency) */
  delay?: number;

  /** Custom response headers */
  headers?: Record<string, string>;

  /** Description of what this mock does (for documentation) */
  description?: string;
}

/**
 * Mock data store
 * Centralized location for all mock data used across endpoints
 */
export const mockData = {
  users: [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
    },
    {
      id: "3",
      firstName: "Bob",
      lastName: "Johnson",
    },
  ] as User[],

  // Add more mock data collections here
  // products: [...],
  // orders: [...],
};

/**
 * Mock endpoint configurations
 *
 * To mock an endpoint:
 * 1. Add a new configuration object with method, path, and response
 * 2. Set enabled: true
 * 3. Define the mock response data
 *
 * To use real API:
 * - Set enabled: false, or
 * - Remove the configuration entirely
 */
export const mockEndpoints: MockEndpointConfig[] = [
  {
    method: "GET",
    path: "/users",
    enabled: true,
    response: mockData.users,
    delay: 500, // Simulate 500ms network delay
    description: "Get all users",
  },
  {
    method: "GET",
    path: "/users/:id",
    enabled: true,
    response: (params) => {
      const userId = params?.id as string;
      const user = mockData.users.find((u) => u.id === userId);

      if (!user) {
        return {
          error: "User not found",
          status: 404,
        };
      }

      return user;
    },
    delay: 300,
    description: "Get user by ID",
  },
  {
    method: "POST",
    path: "/users",
    enabled: true,
    response: (params) => {
      const newUser = params?.body as User;
      const userWithId = {
        ...newUser,
        id: String(mockData.users.length + 1),
      };
      mockData.users.push(userWithId);
      return userWithId;
    },
    status: 201,
    delay: 400,
    description: "Create new user",
  },
  {
    method: "PUT",
    path: "/users/:id",
    enabled: true,
    response: (params) => {
      const userId = params?.id as string;
      const updates = params?.body as Partial<User>;
      const userIndex = mockData.users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return {
          error: "User not found",
          status: 404,
        };
      }

      mockData.users[userIndex] = {
        ...mockData.users[userIndex],
        ...updates,
      };

      return mockData.users[userIndex];
    },
    delay: 400,
    description: "Update user by ID",
  },
  {
    method: "DELETE",
    path: "/users/:id",
    enabled: true,
    response: (params) => {
      const userId = params?.id as string;
      const userIndex = mockData.users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return {
          error: "User not found",
          status: 404,
        };
      }

      mockData.users.splice(userIndex, 1);
      return { success: true };
    },
    status: 204,
    delay: 300,
    description: "Delete user by ID",
  },

  // Example: Disabled endpoint (will use real API)
  // {
  //   method: 'GET',
  //   path: '/products',
  //   enabled: false,
  //   description: 'Get all products - uses real API',
  // },
];

/**
 * Environment-specific mock configurations
 * Allows different mock behaviors per environment
 */
export const mockConfig = {
  /** Global enable/disable for all mocks */
  enabled: import.meta.env.VITE_ENABLE_MSW === "true",

  /** API base URL */
  baseUrl: import.meta.env.VITE_API_BASE_URL || "",

  /** Default delay for all mocked requests (ms) */
  defaultDelay: 300,

  /** Log mocked requests to console */
  logRequests: true,

  /** Behavior for unhandled requests: 'bypass' | 'warn' | 'error' */
  onUnhandledRequest: "bypass" as const,
};
