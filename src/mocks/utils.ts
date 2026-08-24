/**
 * MSW Utility Functions
 * 
 * Helper functions for working with MSW mocks.
 */

import type { MockEndpointConfig } from './mock.config';
import { scenarios, type ScenarioName } from './scenarios';

/**
 * Get mock configuration for a specific scenario
 */
export function getScenarioConfig(scenarioName: ScenarioName): MockEndpointConfig[] {
  return scenarios[scenarioName] || [];
}

/**
 * Merge multiple mock configurations
 * Later configurations override earlier ones for the same endpoint
 */
export function mergeMockConfigs(
  ...configs: MockEndpointConfig[][]
): MockEndpointConfig[] {
  const merged = new Map<string, MockEndpointConfig>();

  configs.forEach((configArray) => {
    configArray.forEach((config) => {
      const key = `${config.method}:${config.path}`;
      merged.set(key, config);
    });
  });

  return Array.from(merged.values());
}

/**
 * Filter mock configurations by enabled status
 */
export function getEnabledMocks(configs: MockEndpointConfig[]): MockEndpointConfig[] {
  return configs.filter((config) => config.enabled);
}

/**
 * Filter mock configurations by HTTP method
 */
export function getMocksByMethod(
  configs: MockEndpointConfig[],
  method: MockEndpointConfig['method']
): MockEndpointConfig[] {
  return configs.filter((config) => config.method === method);
}

/**
 * Get a summary of all mock configurations
 */
export function getMockSummary(configs: MockEndpointConfig[]) {
  const enabled = configs.filter((c) => c.enabled);
  const disabled = configs.filter((c) => !c.enabled);

  return {
    total: configs.length,
    enabled: enabled.length,
    disabled: disabled.length,
    byMethod: {
      GET: configs.filter((c) => c.method === 'GET').length,
      POST: configs.filter((c) => c.method === 'POST').length,
      PUT: configs.filter((c) => c.method === 'PUT').length,
      DELETE: configs.filter((c) => c.method === 'DELETE').length,
      PATCH: configs.filter((c) => c.method === 'PATCH').length,
    },
    endpoints: configs.map((c) => ({
      method: c.method,
      path: c.path,
      enabled: c.enabled,
      description: c.description,
    })),
  };
}

/**
 * Print mock configuration summary to console
 */
export function logMockSummary(configs: MockEndpointConfig[]): void {
  const summary = getMockSummary(configs);

  console.group('🎭 MSW Mock Configuration Summary');
  console.log(`Total endpoints: ${summary.total}`);
  console.log(`Enabled: ${summary.enabled}`);
  console.log(`Disabled: ${summary.disabled}`);
  console.log('\nBy Method:');
  Object.entries(summary.byMethod).forEach(([method, count]) => {
    if (count > 0) {
      console.log(`  ${method}: ${count}`);
    }
  });
  console.log('\nEndpoints:');
  summary.endpoints.forEach((endpoint) => {
    const status = endpoint.enabled ? '✅' : '❌';
    console.log(`  ${status} ${endpoint.method} ${endpoint.path}`);
    if (endpoint.description) {
      console.log(`     ${endpoint.description}`);
    }
  });
  console.groupEnd();
}

/**
 * Create a mock configuration with overrides
 */
export function createMockConfig(
  base: MockEndpointConfig,
  overrides: Partial<MockEndpointConfig>
): MockEndpointConfig {
  return {
    ...base,
    ...overrides,
  };
}

/**
 * Toggle mock enabled status
 */
export function toggleMock(
  configs: MockEndpointConfig[],
  method: string,
  path: string
): MockEndpointConfig[] {
  return configs.map((config) => {
    if (config.method === method && config.path === path) {
      return { ...config, enabled: !config.enabled };
    }
    return config;
  });
}
