# Professional MSW Configuration

## Overview

This is a professional, production-ready MSW (Mock Service Worker) implementation with configuration-based architecture. It provides a centralized, declarative way to manage mock API endpoints.

## Architecture

```
src/mocks/
├── mock.config.ts      # Central configuration for all mocks
├── handlerFactory.ts   # Factory for generating MSW handlers
├── handlers.ts         # Generated handlers from config
├── scenarios.ts        # Predefined mock scenarios
├── utils.ts            # Utility functions
├── browser.ts          # MSW worker setup
├── index.ts            # MSW initialization
└── README.md           # This file
```

## Key Features

✅ **Configuration-based**: All mocks defined in `mock.config.ts`  
✅ **Type-safe**: Full TypeScript support with interfaces  
✅ **Scenarios**: Predefined scenarios for different testing situations  
✅ **Reusable**: Centralized mock data store  
✅ **Flexible**: Easy enable/disable per endpoint  
✅ **Maintainable**: Clear separation of concerns  
✅ **Developer-friendly**: Excellent logging and debugging  

## Quick Start

### 1. Define Mock Endpoints

Open `mock.config.ts` and add your endpoint configuration:

```typescript
export const mockEndpoints: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/api/products',
    enabled: true,
    response: mockData.products,
    delay: 300,
    description: 'Get all products',
  },
];
```

### 2. Add Mock Data

Add your mock data to the `mockData` object in `mock.config.ts`:

```typescript
export const mockData = {
  products: [
    { id: 1, name: 'Product 1', price: 29.99 },
    { id: 2, name: 'Product 2', price: 39.99 },
  ],
};
```

### 3. Enable/Disable Mocks

Toggle individual endpoints:

```typescript
{
  method: 'GET',
  path: '/api/products',
  enabled: false, // ← Set to false to use real API
  // ...
}
```

## Configuration Options

### MockEndpointConfig

```typescript
interface MockEndpointConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;                    // e.g., '/users' or '/users/:id'
  enabled: boolean;                // true = mock, false = real API
  response?: unknown | Function;   // Static data or function
  status?: number;                 // HTTP status code (default: 200)
  delay?: number;                  // Response delay in ms
  headers?: Record<string, string>; // Custom headers
  description?: string;            // Documentation
}
```

### Dynamic Responses

Use functions for dynamic responses:

```typescript
{
  method: 'GET',
  path: '/users/:id',
  enabled: true,
  response: (params) => {
    const userId = params?.id;
    return mockData.users.find(u => u.id === userId);
  },
}
```

### Error Responses

Return error status codes:

```typescript
{
  method: 'GET',
  path: '/users/:id',
  enabled: true,
  response: { error: 'Not Found' },
  status: 404,
}
```

## Scenarios

Use predefined scenarios for different testing situations:

```typescript
import { scenarios } from './mocks';
import { createHandlers } from './mocks/handlerFactory';

// Use error scenario
const errorHandlers = createHandlers(scenarios.error);

// Use slow network scenario
const slowHandlers = createHandlers(scenarios.slowNetwork);
```

### Available Scenarios

- **success**: All endpoints return successful responses
- **slowNetwork**: High latency simulation (2-3 second delays)
- **error**: Server errors (500, 404, 400)
- **emptyData**: Empty response arrays
- **authError**: Authentication/authorization errors (401, 403)
- **pagination**: Paginated response example

## Runtime Configuration

### Switch Scenarios at Runtime

```typescript
import { updateHandlers } from './mocks/browser';
import { createHandlers } from './mocks/handlerFactory';
import { scenarios } from './mocks/scenarios';

// Switch to error scenario
const errorHandlers = createHandlers(scenarios.error);
updateHandlers(errorHandlers);
```

### Merge Configurations

```typescript
import { mergeMockConfigs } from './mocks/utils';
import { mockEndpoints } from './mocks/mock.config';
import { scenarios } from './mocks/scenarios';

// Combine base config with slow network for specific endpoints
const combined = mergeMockConfigs(mockEndpoints, scenarios.slowNetwork);
```

## Utilities

### Log Mock Summary

```typescript
import { logMockSummary } from './mocks/utils';
import { mockEndpoints } from './mocks/mock.config';

logMockSummary(mockEndpoints);
// Outputs:
// 🎭 MSW Mock Configuration Summary
// Total endpoints: 5
// Enabled: 3
// Disabled: 2
// ...
```

### Get Mock Summary

```typescript
import { getMockSummary } from './mocks/utils';

const summary = getMockSummary(mockEndpoints);
console.log(summary.enabled); // Number of enabled mocks
```

### Filter Mocks

```typescript
import { getEnabledMocks, getMocksByMethod } from './mocks/utils';

const enabled = getEnabledMocks(mockEndpoints);
const getMocks = getMocksByMethod(mockEndpoints, 'GET');
```

## Environment Variables

### .env.development

```env
VITE_ENABLE_MSW=true
VITE_API_BASE_URL=https://api.example.com
```

### .env.production

```env
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=https://api.example.com
```

## Best Practices

### 1. Organize Mock Data

Keep mock data centralized in `mockData` object:

```typescript
export const mockData = {
  users: [...],
  products: [...],
  orders: [...],
};
```

### 2. Use Descriptive Names

Always add descriptions to your mock configs:

```typescript
{
  description: 'Get user profile with authentication',
  // ...
}
```

### 3. Simulate Real Delays

Add realistic delays to simulate network latency:

```typescript
{
  delay: 300, // 300ms - typical API response time
}
```

### 4. Handle Edge Cases

Create scenarios for error cases:

```typescript
// 404 Not Found
{
  response: { error: 'Not Found' },
  status: 404,
}

// 401 Unauthorized
{
  response: { error: 'Unauthorized' },
  status: 401,
}
```

### 5. Use Scenarios for Testing

Create custom scenarios for specific test cases:

```typescript
export const myTestScenario: MockEndpointConfig[] = [
  // Your test-specific mocks
];
```

## Advanced Usage

### Custom Response Logic

```typescript
{
  method: 'POST',
  path: '/users',
  enabled: true,
  response: (params) => {
    const { body } = params;
    
    // Validation
    if (!body.email) {
      return {
        error: 'Email required',
        status: 400,
      };
    }
    
    // Success
    return {
      id: generateId(),
      ...body,
      createdAt: new Date().toISOString(),
    };
  },
}
```

### Stateful Mocks

```typescript
let requestCount = 0;

{
  method: 'GET',
  path: '/api/data',
  enabled: true,
  response: () => {
    requestCount++;
    return {
      data: 'Response',
      requestNumber: requestCount,
    };
  },
}
```

### Custom Headers

```typescript
{
  method: 'GET',
  path: '/api/data',
  enabled: true,
  response: { data: 'value' },
  headers: {
    'X-Custom-Header': 'value',
    'X-Rate-Limit': '100',
  },
}
```

## Debugging

### Enable Logging

In `mock.config.ts`:

```typescript
export const mockConfig = {
  logRequests: true, // ← Enable request logging
};
```

### Console Output

When enabled, you'll see:

```
[MSW] GET /users { params: {}, url: 'https://api.example.com/users' }
🎭 MSW Mock Configuration Summary
Total endpoints: 5
Enabled: 3
✅ GET /users
✅ POST /users
❌ GET /products
```

## Migration from Basic MSW

If you have existing MSW handlers:

### Before (Basic)

```typescript
export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([...]);
  }),
];
```

### After (Professional)

```typescript
// In mock.config.ts
export const mockEndpoints: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/api/users',
    enabled: true,
    response: [...],
    description: 'Get all users',
  },
];
```

## Troubleshooting

### Mocks Not Working

1. Check `VITE_ENABLE_MSW=true` in `.env.development`
2. Verify `enabled: true` in mock config
3. Check browser console for MSW logs
4. Ensure `npx msw init public/` was run

### Real API Called Instead of Mock

1. Verify endpoint path matches exactly
2. Check HTTP method matches
3. Ensure `enabled: true`
4. Check base URL configuration

### TypeScript Errors

1. Ensure response type matches expected type
2. Add proper type annotations to response functions
3. Update `MockEndpointConfig` interface if needed

## Contributing

When adding new mocks:

1. Add configuration to `mock.config.ts`
2. Add mock data to `mockData` object
3. Add description for documentation
4. Test with both enabled and disabled states
5. Create scenario if needed for testing

## Resources

- [MSW Documentation](https://mswjs.io/)
- [MSW Examples](https://github.com/mswjs/examples)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
