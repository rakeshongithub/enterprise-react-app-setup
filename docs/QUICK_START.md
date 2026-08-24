# MSW Quick Start Guide

## 🚀 Getting Started

Mock Service Worker (MSW) is already set up with a **professional configuration-based architecture**! Here's how to use it:

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Your React Component                       │
│                      │                                  │
│                      ▼                                  │
│              API Service Layer                          │
│                      │                                  │
│                      ▼                                  │
│                 HTTP Request                            │
└──────────────────────┼──────────────────────────────────┘
                       │
                       ▼
       ┌───────────────────────────────────┐
       │   Mock Service Worker (MSW)       │
       │   (Development Only)              │
       │                                   │
       │   Handler exists?                 │
       │   ┌─────┴─────┐                   │
       │   │           │                   │
       │   ▼           ▼                   │
       │  YES         NO                   │
       │   │           │                   │
       └───┼───────────┼───────────────────┘
           │           │
           ▼           ▼
    ┌──────────┐  ┌──────────────┐
    │   Mock   │  │  Real API    │
    │   Data   │  │  (Passthru)  │
    └─────┬────┘  └──────┬───────┘
          │              │
          └──────┬───────┘
                 ▼
         ┌──────────────┐
         │   Response   │
         │   to React   │
         └──────────────┘

✅ With Handler    → Returns mock data
❌ Without Handler → Uses real backend API
```

## 📝 Mock a New API Endpoint

### Step 1: Add Mock Data

Open `src/mocks/mock.config.ts` and add your mock data:

```typescript
export const mockData = {
  users: [...],
  yourData: [  // ← Add your data here
    { id: '1', name: 'Example' },
  ],
};
```

### Step 2: Add Endpoint Configuration

Add the endpoint to the `mockEndpoints` array:

```typescript
export const mockEndpoints: MockEndpointConfig[] = [
  {
    method: "GET",
    path: "/api/your-endpoint",
    enabled: true, // ← Set to true to mock
    response: mockData.yourData,
    delay: 300, // Optional: simulate network delay
    description: "Get your data",
  },
];
```

### Step 3: That's It!

Run `npm run dev` and your endpoint is now mocked. ✨

## ✅ Use Real API Instead

When your backend API is ready:

1. **Set `enabled: false`** in `src/mocks/mock.config.ts`
2. **Done!** The request now goes to the real API

```typescript
{
  method: 'GET',
  path: '/api/your-endpoint',
  enabled: false,  // ← Changed to false
  response: mockData.yourData,
  description: 'Get your data - using real API',
}
```

No code changes needed in your components!

## 🔄 Example: Transitioning from Mock to Real

### Scenario: 5 APIs, 3 Ready, 2 Need Mocking

```typescript
// src/mocks/mock.config.ts
export const mockEndpoints: MockEndpointConfig[] = [
  // ❌ MOCKED: Products API (backend not ready)
  {
    method: "GET",
    path: "/api/products",
    enabled: true, // ← Mocked
    response: mockData.products,
    description: "Get all products",
  },

  // ❌ MOCKED: Inventory API (backend not ready)
  {
    method: "GET",
    path: "/api/inventory",
    enabled: true, // ← Mocked
    response: mockData.inventory,
    description: "Get inventory",
  },

  // ✅ REAL API: Users (disabled = uses real backend)
  {
    method: "GET",
    path: "/api/users",
    enabled: false, // ← Uses real API
    response: mockData.users,
    description: "Get all users",
  },

  // ✅ REAL API: Orders (disabled = uses real backend)
  {
    method: "GET",
    path: "/api/orders",
    enabled: false, // ← Uses real API
    response: mockData.orders,
    description: "Get all orders",
  },

  // ✅ REAL API: Payments (disabled = uses real backend)
  {
    method: "POST",
    path: "/api/payments",
    enabled: false, // ← Uses real API
    response: {},
    description: "Process payment",
  },
];
```

### When Products API is Ready:

```typescript
// Just set enabled to false:
export const mockEndpoints: MockEndpointConfig[] = [
  {
    method: "GET",
    path: "/api/products",
    enabled: false, // ← Changed to false - now using real API!
    response: mockData.products,
    description: "Get all products - using real API",
  },

  {
    method: "GET",
    path: "/api/inventory",
    enabled: true, // ← Still mocked
    response: mockData.inventory,
    description: "Get inventory",
  },
];
```

## 🛠️ Common Patterns

### Simple GET Request

```typescript
{
  method: 'GET',
  path: '/api/users',
  enabled: true,
  response: mockData.users,  // Static data
  description: 'Get all users',
}
```

### POST Request with Dynamic Response

```typescript
{
  method: 'POST',
  path: '/api/users',
  enabled: true,
  response: (params) => {
    const newUser = params?.body;  // Request body already parsed
    return { id: '3', ...newUser };
  },
  status: 201,
  description: 'Create new user',
}
```

### Dynamic Routes with Parameters

```typescript
{
  method: 'GET',
  path: '/api/users/:id',
  enabled: true,
  response: (params) => {
    const userId = params?.id;  // Route parameter
    const user = mockData.users.find(u => u.id === userId);
    return user || { error: 'Not Found', status: 404 };
  },
  description: 'Get user by ID',
}
```

### Error Response

```typescript
{
  method: 'DELETE',
  path: '/api/users/:id',
  enabled: true,
  response: { error: 'Not found' },
  status: 404,
  description: 'Delete user (simulates error)',
}
```

### With Network Delay

```typescript
{
  method: 'GET',
  path: '/api/slow-endpoint',
  enabled: true,
  response: mockData.data,
  delay: 2000,  // 2 second delay
  description: 'Simulate slow network',
}
```

## 🎭 Scenarios

Use predefined scenarios for testing:

```typescript
import { scenarios } from "./mocks/scenarios";
import { createHandlers } from "./mocks/handlerFactory";
import { updateHandlers } from "./mocks/browser";

// Test with errors
const errorHandlers = createHandlers(scenarios.error);
updateHandlers(errorHandlers);

// Test with slow network
const slowHandlers = createHandlers(scenarios.slowNetwork);
updateHandlers(slowHandlers);
```

**Available Scenarios:**

- `success`: All endpoints return successful responses
- `slowNetwork`: High latency (2-3 second delays)
- `error`: Server errors (500, 404, 400)
- `emptyData`: Empty response arrays
- `authError`: Auth errors (401, 403)
- `pagination`: Paginated responses

## 👁️ Debugging

Check your browser console when running `npm run dev`:

```
[MSW] Mocking enabled.
[MSW] GET /api/users 200 OK (mocked)      ← Using mock data
[MSW] GET /api/orders 200 OK (passthrough) ← Using real API
```

### Log Configuration Summary

```typescript
import { logMockSummary } from "./mocks/utils";
import { mockEndpoints } from "./mocks/mock.config";

logMockSummary(mockEndpoints);
```

Output:

```
🎭 MSW Mock Configuration Summary
Total endpoints: 5
Enabled: 3
Disabled: 2

By Method:
  GET: 3
  POST: 2

Endpoints:
  ✅ GET /api/users
     Get all users
  ✅ POST /api/users
     Create new user
  ❌ GET /api/products
     Get all products - uses real API
```

## 🎭 Production Behavior

- **Development**: MSW intercepts requests based on handlers
- **Production**: MSW is completely disabled, all requests go to real APIs

No configuration needed - it's automatic! 🎉

## 📚 Need More Details?

See [MSW_SETUP.md](./MSW_SETUP.md) for:

- Complete configuration reference
- Advanced features (scenarios, validation, stateful mocks)
- Troubleshooting guide
- Best practices
- Utility functions

---

**TL;DR**: Edit `src/mocks/mock.config.ts` to add/modify mocks. Use `enabled: true/false` to toggle between mock and real API. MSW handles the rest! 🚀
