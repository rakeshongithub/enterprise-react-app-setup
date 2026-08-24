/**
 * MSW Mock Scenarios
 * 
 * Predefined scenarios for different testing/development situations.
 * Scenarios allow you to quickly switch between different mock behaviors.
 */

import type { MockEndpointConfig } from './mock.config';
import { mockData } from './mock.config';

/**
 * Scenario: All endpoints return success responses
 */
export const successScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/users',
    enabled: true,
    response: mockData.users,
    delay: 300,
    description: 'Success: Get all users',
  },
  {
    method: 'GET',
    path: '/users/:id',
    enabled: true,
    response: (params) => {
      const userId = params?.id as string;
      return mockData.users.find((u) => u.id === userId);
    },
    delay: 200,
    description: 'Success: Get user by ID',
  },
];

/**
 * Scenario: Simulate slow network (high latency)
 */
export const slowNetworkScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/users',
    enabled: true,
    response: mockData.users,
    delay: 3000, // 3 second delay
    description: 'Slow network: Get all users',
  },
  {
    method: 'GET',
    path: '/users/:id',
    enabled: true,
    response: (params) => {
      const userId = params?.id as string;
      return mockData.users.find((u) => u.id === userId);
    },
    delay: 2500,
    description: 'Slow network: Get user by ID',
  },
];

/**
 * Scenario: Simulate error responses
 */
export const errorScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/users',
    enabled: true,
    response: { error: 'Internal Server Error', message: 'Database connection failed' },
    status: 500,
    delay: 300,
    description: 'Error: Server error on get users',
  },
  {
    method: 'GET',
    path: '/users/:id',
    enabled: true,
    response: { error: 'Not Found', message: 'User does not exist' },
    status: 404,
    delay: 200,
    description: 'Error: User not found',
  },
  {
    method: 'POST',
    path: '/users',
    enabled: true,
    response: { error: 'Bad Request', message: 'Invalid user data' },
    status: 400,
    delay: 300,
    description: 'Error: Validation error on create user',
  },
];

/**
 * Scenario: Empty data responses
 */
export const emptyDataScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/users',
    enabled: true,
    response: [],
    delay: 300,
    description: 'Empty: No users found',
  },
];

/**
 * Scenario: Authentication errors
 */
export const authErrorScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/users',
    enabled: true,
    response: { error: 'Unauthorized', message: 'Authentication token missing or invalid' },
    status: 401,
    delay: 200,
    description: 'Auth error: Unauthorized access',
  },
  {
    method: 'POST',
    path: '/users',
    enabled: true,
    response: { error: 'Forbidden', message: 'Insufficient permissions' },
    status: 403,
    delay: 200,
    description: 'Auth error: Forbidden action',
  },
];

/**
 * Scenario: Pagination example
 */
export const paginationScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/users',
    enabled: true,
    response: (params) => {
      const page = Number(params?.page) || 1;
      const limit = Number(params?.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: mockData.users.slice(startIndex, endIndex),
        pagination: {
          page,
          limit,
          total: mockData.users.length,
          totalPages: Math.ceil(mockData.users.length / limit),
        },
      };
    },
    delay: 300,
    description: 'Pagination: Get paginated users',
  },
];

/**
 * Export all scenarios
 */
export const scenarios = {
  success: successScenario,
  slowNetwork: slowNetworkScenario,
  error: errorScenario,
  emptyData: emptyDataScenario,
  authError: authErrorScenario,
  pagination: paginationScenario,
};

/**
 * Type for available scenario names
 */
export type ScenarioName = keyof typeof scenarios;
