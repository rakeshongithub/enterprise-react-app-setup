# Mock Service Worker (MSW) Setup Guide

## Overview

This project uses [Mock Service Worker (MSW)](https://mswjs.io/) with a **professional configuration-based architecture** to mock API endpoints during development. MSW allows you to:

- **Centralized Configuration**: All mocks defined in `mock.config.ts` for easy management
- **Selectively mock APIs**: Only mock the endpoints that aren't ready yet
- **Pass through real APIs**: Unmocked endpoints automatically use the real backend
- **Development-only**: Mocking is automatically disabled in production
- **Realistic testing**: MSW intercepts requests at the network level, making mocks behave like real APIs
- **Type-Safe**: Full TypeScript support with interfaces
- **Scenarios**: Predefined scenarios for different testing situations

## Architecture

### Folder Structure

```
src/mocks/
├── mock.config.ts      # ← Central configuration (EDIT THIS)
├── handlerFactory.ts   # Handler generator (auto-generates handlers)
├── handlers.ts         # Auto-generated handlers from config
├── scenarios.ts        # Predefined scenarios (error, slow network, etc.)
├── utils.ts            # Utility functions (logging, merging, filtering)
├── browser.ts          # MSW worker setup with scenario switching
├── index.ts            # MSW initialization
└── README.md           # Detailed documentation
```

### Key Files

- **mock.config.ts**: Define all your mocks here - single source of truth
- **handlerFactory.ts**: Automatically generates MSW handlers from config
- **scenarios.ts**: Predefined test scenarios (success, error, slow network)
- **utils.ts**: Helper functions for debugging and configuration management

### Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Application                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Component   │  │  Component   │  │  Component   │         │
│  │   (Users)    │  │  (Products)  │  │   (Orders)   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│                           ▼                                     │
│                  ┌─────────────────┐                            │
│                  │  Service Layer  │                            │
│                  │  (UserService,  │                            │
│                  │ ProductService) │                            │
│                  └────────┬────────┘                            │
│                           │                                     │
│                           ▼                                     │
│                  ┌─────────────────┐                            │
│                  │   API Client    │                            │
│                  │  (HttpClient)   │                            │
│                  └────────┬────────┘                            │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ HTTP Request
                            ▼
        ┌───────────────────────────────────────────┐
        │     Mock Service Worker (MSW)             │
        │      (Development Only)                   │
        │                                           │
        │  ┌─────────────────────────────────────┐ │
        │  │  Check: Handler exists for this     │ │
        │  │  endpoint in handlers.ts?           │ │
        │  └──────────────┬──────────────────────┘ │
        │                 │                         │
        │        ┌────────┴────────┐                │
        │        │                 │                │
        │        ▼                 ▼                │
        │   ┌─────────┐      ┌──────────┐          │
        │   │   YES   │      │    NO    │          │
        │   │ (Mocked)│      │(Passthru)│          │
        │   └────┬────┘      └────┬─────┘          │
        └────────┼─────────────────┼────────────────┘
                 │                 │
                 │                 │
        ┌────────▼────────┐        │
        │  Return Mock    │        │
        │  Data from      │        │
        │  Handler        │        │
        └────────┬────────┘        │
                 │                 │
                 │                 ▼
                 │        ┌─────────────────┐
                 │        │  Forward to     │
                 │        │  Real Backend   │
                 │        │  API Server     │
                 │        └────────┬────────┘
                 │                 │
                 │                 ▼
                 │        ┌─────────────────┐
                 │        │  Real API       │
                 │        │  Response       │
                 │        └────────┬────────┘
                 │                 │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Response sent  │
                 │  back to React  │
                 │  Component      │
                 └─────────────────┘


📋 Example Flow:

1️⃣  GET /api/users (has handler) → MSW returns mock data
2️⃣  GET /api/products (no handler) → MSW passes through → Real API
3️⃣  GET /api/orders (no handler) → MSW passes through → Real API


🔧 Environment Behavior:

┌──────────────┬─────────────────────────────────────────────┐
│ Environment  │ MSW Behavior                                │
├──────────────┼─────────────────────────────────────────────┤
│ Development  │ ✅ Active - Intercepts requests             │
│              │    • Mocked: Returns handler data           │
│              │    • Unmocked: Passes through to real API   │
├──────────────┼─────────────────────────────────────────────┤
│ Production   │ ❌ Disabled - All requests go to real API   │
│ Staging      │    • No service worker registered           │
│ Test         │    • No mock code in bundle                 │
└──────────────┴─────────────────────────────────────────────┘
```

## How It Works

### 1. Configuration-Based Architecture

Define all mocks in a centralized configuration file:

```typescript
// src/mocks/mock.config.ts
export const mockEndpoints: MockEndpointConfig[] = [
  {
    method: "GET",
    path: "/api/users",
    enabled: true, // ← Toggle mock on/off
    response: mockData.users, // ← Mock data
    delay: 300, // ← Simulate network delay
    description: "Get all users",
  },
  {
    method: "GET",
    path: "/api/products",
    enabled: false, // ← Disabled = uses real API
    response: mockData.products,
    description: "Get all products",
  },
];
```

### 2. Handler Factory

Handlers are automatically generated from configuration:

```typescript
// src/mocks/handlerFactory.ts
export function createHandlers(config: MockEndpointConfig[]) {
  return config
    .filter((endpoint) => endpoint.enabled)
    .map((endpoint) => {
      // Auto-generate MSW handler based on config
      return http[endpoint.method.toLowerCase()](
        endpoint.path,
        async ({ request, params }) => {
          // Handle delays, responses, errors automatically
        },
      );
    });
}
```

### 3. Conditional Initialization

MSW is only enabled in development mode:

```typescript
// src/mocks/index.ts
export async function enableMocking() {
  if (import.meta.env.MODE !== "development") {
    return; // No-op in production
  }

  const { worker } = await import("./browser");
  return worker.start({
    onUnhandledRequest: "bypass", // Pass through unmocked requests
  });
}
```

### 4. Environment-Based API URL

Both the real API client and MSW handlers use the same `VITE_API_BASE_URL`:

```typescript
// .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MSW=true

// src/api/ApiClient.ts (real API)
const url = `${import.meta.env.VITE_API_BASE_URL}${endpoint}`;

// src/mocks/mock.config.ts (MSW)
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Usage Guide

### Adding a New Mock

To mock a new API endpoint, add a configuration to `src/mocks/mock.config.ts`:

```typescript
// 1. Add mock data
export const mockData = {
  users: [...],
  products: [  // ← Add your mock data here
    { id: '1', name: 'Product 1', price: 29.99 },
    { id: '2', name: 'Product 2', price: 49.99 },
  ],
};

// 2. Add endpoint configuration
export const mockEndpoints: MockEndpointConfig[] = [
  // Simple GET request
  {
    method: 'GET',
    path: '/api/products',
    enabled: true,
    response: mockData.products,
    delay: 300,
    description: 'Get all products',
  },

  // POST request with dynamic response
  {
    method: 'POST',
    path: '/api/products',
    enabled: true,
    response: (params) => {
      const newProduct = params?.body;
      return { id: '3', ...newProduct };
    },
    status: 201,
    delay: 400,
    description: 'Create new product',
  },

  // Dynamic route parameters
  {
    method: 'GET',
    path: '/api/products/:id',
    enabled: true,
    response: (params) => {
      const product = mockData.products.find(p => p.id === params?.id);
      return product || { error: 'Not Found', status: 404 };
    },
    description: 'Get product by ID',
  },

  // Error response
  {
    method: 'DELETE',
    path: '/api/products/:id',
    enabled: true,
    response: { error: 'Product not found' },
    status: 404,
    description: 'Delete product (simulates error)',
  },
];
```

### Removing a Mock (Using Real API)

When the real API endpoint is ready, simply set `enabled: false`:

```typescript
export const mockEndpoints: MockEndpointConfig[] = [
  {
    method: "GET",
    path: "/api/users",
    enabled: false, // ← Set to false - now uses real API
    response: mockData.users,
    description: "Get all users",
  },
  {
    method: "GET",
    path: "/api/products",
    enabled: true, // ← Still mocked
    response: mockData.products,
    description: "Get all products",
  },
];
```

### Example: Mixed Real and Mock APIs

Scenario: You have 5 APIs, 3 are ready, 2 need mocking:

```typescript
// src/mocks/mock.config.ts
export const mockEndpoints: MockEndpointConfig[] = [
  // MOCKED: Product endpoints (not ready yet)
  {
    method: "GET",
    path: "/api/products",
    enabled: true, // ← Mocked
    response: mockData.products,
    description: "Get all products",
  },
  {
    method: "GET",
    path: "/api/products/:id",
    enabled: true, // ← Mocked
    response: (params) => mockData.products.find((p) => p.id === params?.id),
    description: "Get product by ID",
  },

  // REAL API: User, Order, and Payment endpoints (ready)
  {
    method: "GET",
    path: "/api/users",
    enabled: false, // ← Uses real API
    response: mockData.users,
    description: "Get all users",
  },
  {
    method: "GET",
    path: "/api/orders",
    enabled: false, // ← Uses real API
    response: mockData.orders,
    description: "Get all orders",
  },
  {
    method: "POST",
    path: "/api/payments",
    enabled: false, // ← Uses real API
    response: {},
    description: "Process payment",
  },
];
```

## Development Workflow

### Starting Development

```bash
npm run dev
```

MSW will automatically start and log mocked requests to the console:

```
[MSW] Mocking enabled.
[MSW] GET /api/users 200 OK (mocked)
[MSW] GET /api/orders 200 OK (passthrough)
```

### Console Logging

MSW logs all intercepted requests in development:

- **Mocked requests**: Show `(mocked)` - data comes from handlers
- **Passthrough requests**: Show `(passthrough)` - data comes from real API

### Debugging

If a request isn't being mocked as expected:

1. **Check the handler URL**: Ensure it matches exactly (including base URL)
2. **Check the HTTP method**: `http.get()` won't match POST requests
3. **Check the console**: MSW logs all intercepted requests
4. **Verify environment**: MSW only runs when `MODE === 'development'`

## Production Behavior

In production builds:

```bash
npm run build
```

- MSW is **completely disabled** (no service worker registered)
- All API calls go to the real backend
- No mock code is included in the production bundle (tree-shaken)

## Advanced Features

### Scenarios

Use predefined scenarios for different testing situations:

```typescript
import { scenarios } from "./mocks/scenarios";
import { createHandlers } from "./mocks/handlerFactory";
import { updateHandlers } from "./mocks/browser";

// Test with slow network
const slowHandlers = createHandlers(scenarios.slowNetwork);
updateHandlers(slowHandlers);

// Test with errors
const errorHandlers = createHandlers(scenarios.error);
updateHandlers(errorHandlers);

// Test with empty data
const emptyHandlers = createHandlers(scenarios.emptyData);
updateHandlers(emptyHandlers);
```

**Available Scenarios:**

- `success`: All endpoints return successful responses
- `slowNetwork`: High latency simulation (2-3 second delays)
- `error`: Server errors (500, 404, 400)
- `emptyData`: Empty response arrays
- `authError`: Authentication/authorization errors (401, 403)
- `pagination`: Paginated response example

### Delayed Responses (Simulate Network Latency)

```typescript
// In mock.config.ts
{
  method: 'GET',
  path: '/api/slow-endpoint',
  enabled: true,
  response: { data: 'Slow response' },
  delay: 2000,  // ← 2 second delay
  description: 'Simulate slow network',
}
```

### Request Validation

```typescript
// In mock.config.ts
{
  method: 'POST',
  path: '/api/users',
  enabled: true,
  response: (params) => {
    const body = params?.body;

    // Validate request
    if (!body?.email || !body?.firstName) {
      return {
        error: 'Missing required fields',
        status: 422,
      };
    }

    return { id: '123', ...body };
  },
  status: 201,
  description: 'Create user with validation',
}
```

### Stateful Mocks (In-Memory Database)

```typescript
// In mock.config.ts
let users = [{ id: "1", name: "John" }];

export const mockEndpoints: MockEndpointConfig[] = [
  {
    method: "GET",
    path: "/api/users",
    enabled: true,
    response: () => users, // ← Returns current state
    description: "Get all users",
  },
  {
    method: "POST",
    path: "/api/users",
    enabled: true,
    response: (params) => {
      const newUser = params?.body;
      const userWithId = { id: String(users.length + 1), ...newUser };
      users.push(userWithId); // ← Mutates state
      return userWithId;
    },
    status: 201,
    description: "Create new user",
  },
  {
    method: "DELETE",
    path: "/api/users/:id",
    enabled: true,
    response: (params) => {
      users = users.filter((u) => u.id !== params?.id); // ← Mutates state
      return null;
    },
    status: 204,
    description: "Delete user",
  },
];
```

### Custom Scenarios

Create your own scenarios for specific test cases:

```typescript
// In scenarios.ts or your test file
export const myCustomScenario: MockEndpointConfig[] = [
  {
    method: "GET",
    path: "/api/users",
    enabled: true,
    response: [], // Empty state
    description: "Test empty user list",
  },
  {
    method: "GET",
    path: "/api/products",
    enabled: true,
    response: { error: "Service Unavailable" },
    status: 503,
    description: "Test service unavailable",
  },
];
```

### Utility Functions

```typescript
import {
  logMockSummary,
  mergeMockConfigs,
  getEnabledMocks,
  getMocksByMethod,
} from "./mocks/utils";

// Log configuration summary
logMockSummary(mockEndpoints);

// Merge configurations
const combined = mergeMockConfigs(mockEndpoints, scenarios.slowNetwork);

// Filter mocks
const enabled = getEnabledMocks(mockEndpoints);
const getMocks = getMocksByMethod(mockEndpoints, "GET");
```

## Best Practices

### 1. Centralize Mock Data

Keep all mock data in the `mockData` object:

```typescript
// src/mocks/mock.config.ts
import type { User, Product } from "../types";

export const mockData = {
  users: [
    { id: "1", firstName: "John", lastName: "Doe" },
    { id: "2", firstName: "Jane", lastName: "Smith" },
  ] as User[],
  products: [{ id: "1", name: "Product 1", price: 29.99 }] as Product[],
};
```

### 2. Add Descriptions

Document every endpoint configuration:

```typescript
{
  method: 'GET',
  path: '/api/users',
  enabled: true,
  response: mockData.users,
  description: 'Get all users with pagination support',  // ← Add this
}
```

### 3. Use Realistic Delays

Simulate real network conditions:

```typescript
{
  delay: 300,  // Fast endpoint
  delay: 1000, // Slow endpoint
  delay: 3000, // Very slow (for testing loading states)
}
```

### 4. Match Real API Behavior

- Use correct HTTP status codes (200, 201, 404, 422, 500)
- Return the same response structure as the real API
- Implement pagination, filtering, and sorting if the real API does

```typescript
{
  method: 'POST',
  path: '/api/users',
  enabled: true,
  response: (params) => {
    const body = params?.body;
    if (!body?.email) {
      return { error: 'Email required', status: 422 };
    }
    return { id: generateId(), ...body };
  },
  status: 201,
  description: 'Create user with validation',
}
```

### 5. Organize by Feature

Group related endpoints together:

```typescript
export const mockEndpoints: MockEndpointConfig[] = [
  // User endpoints
  { method: 'GET', path: '/api/users', ... },
  { method: 'POST', path: '/api/users', ... },
  { method: 'GET', path: '/api/users/:id', ... },

  // Product endpoints
  { method: 'GET', path: '/api/products', ... },
  { method: 'POST', path: '/api/products', ... },
];
```

### 6. Use Scenarios for Testing

Leverage predefined scenarios:

```typescript
// Test error handling
const errorHandlers = createHandlers(scenarios.error);
updateHandlers(errorHandlers);

// Test loading states
const slowHandlers = createHandlers(scenarios.slowNetwork);
updateHandlers(slowHandlers);
```

### 7. Log Configuration Summary

Use utility functions for debugging:

```typescript
import { logMockSummary } from "./mocks/utils";

logMockSummary(mockEndpoints);
// Output:
// 🎭 MSW Mock Configuration Summary
// Total endpoints: 5
// Enabled: 3
// Disabled: 2
```

## Troubleshooting

### MSW Not Starting

**Issue**: No MSW logs in console

**Solutions**:

- Verify `import.meta.env.MODE === 'development'`
- Check that `enableMocking()` is called in `main.tsx`
- Ensure service worker file exists in `public/mockServiceWorker.js`

### Requests Not Being Mocked

**Issue**: Request goes to real API instead of mock

**Solutions**:

- Verify handler URL matches exactly (including base URL)
- Check HTTP method matches (`GET`, `POST`, etc.)
- Ensure handler is added to the `handlers` array
- Check console for MSW logs

### Service Worker Registration Failed

**Issue**: Browser console shows service worker error

**Solutions**:

- Run `npx msw init public/ --save` to regenerate worker file
- Ensure `public/mockServiceWorker.js` is not in `.gitignore`
- Clear browser cache and reload

### Type Errors with MSW

**Issue**: TypeScript errors in handlers

**Solutions**:

- Update `@types/node` to latest version
- Ensure `msw` is latest version (2.x)
- Check that `request.json()` is awaited

## Migration to Real APIs

When transitioning from mocks to real APIs:

1. **Verify API contract**: Ensure real API matches mock response structure
2. **Disable mock**: Set `enabled: false` in `mock.config.ts`
3. **Test thoroughly**: Verify the real API works as expected
4. **Update description**: Add note that real API is being used
5. **Clean up mock data**: Remove unused mock data when all endpoints are migrated

```typescript
// Before: Mocked
{
  method: 'GET',
  path: '/api/users',
  enabled: true,
  response: mockData.users,
  description: 'Get all users',
}

// After: Using real API
{
  method: 'GET',
  path: '/api/users',
  enabled: false,  // ← Changed to false
  response: mockData.users,
  description: 'Get all users - using real API',  // ← Updated
}
```

## Resources

- [MSW Official Documentation](https://mswjs.io/docs/)
- [MSW Examples](https://github.com/mswjs/examples)
- [MSW Browser Integration](https://mswjs.io/docs/integrations/browser)
- [MSW API Reference](https://mswjs.io/docs/api/)

## Configuration Reference

### MockEndpointConfig Interface

```typescript
interface MockEndpointConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string; // e.g., '/api/users' or '/api/users/:id'
  enabled: boolean; // true = mock, false = real API
  response?: unknown | Function; // Static data or function
  status?: number; // HTTP status code (default: 200)
  delay?: number; // Response delay in ms
  headers?: Record<string, string>; // Custom headers
  description?: string; // Documentation
}
```

### Response Function Parameters

```typescript
response: (params) => {
  // params.id - Route parameter (e.g., :id)
  // params.body - Request body (already parsed)
  // params.query - Query parameters
  return {/* response data */};
};
```

## Summary

✅ **Professional MSW Configuration Ready**

- Edit `src/mocks/mock.config.ts` to add/modify mocks
- Use `enabled: true/false` to toggle between mock and real API
- Leverage scenarios for different testing situations
- All configurations are centralized and type-safe
- Runtime scenario switching supported
- Utility functions available for debugging

Happy mocking! 🎭
