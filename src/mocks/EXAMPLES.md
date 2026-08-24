# MSW Configuration Examples

Practical examples for common MSW use cases.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Advanced Examples](#advanced-examples)
- [Real-World Scenarios](#real-world-scenarios)
- [Testing Patterns](#testing-patterns)

## Basic Examples

### Simple GET Request

```typescript
{
  method: 'GET',
  path: '/api/users',
  enabled: true,
  response: [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
  ],
  delay: 300,
  description: 'Get all users',
}
```

### GET with Path Parameters

```typescript
{
  method: 'GET',
  path: '/api/users/:id',
  enabled: true,
  response: (params) => {
    const userId = params?.id as string;
    const user = mockData.users.find(u => u.id === userId);
    
    if (!user) {
      return { error: 'User not found', status: 404 };
    }
    
    return user;
  },
  description: 'Get user by ID',
}
```

### POST Request

```typescript
{
  method: 'POST',
  path: '/api/users',
  enabled: true,
  response: (params) => {
    const newUser = params?.body as User;
    const userWithId = {
      ...newUser,
      id: String(mockData.users.length + 1),
      createdAt: new Date().toISOString(),
    };
    mockData.users.push(userWithId);
    return userWithId;
  },
  status: 201,
  description: 'Create new user',
}
```

### PUT Request (Update)

```typescript
{
  method: 'PUT',
  path: '/api/users/:id',
  enabled: true,
  response: (params) => {
    const userId = params?.id as string;
    const updates = params?.body as Partial<User>;
    const userIndex = mockData.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { error: 'User not found', status: 404 };
    }
    
    mockData.users[userIndex] = {
      ...mockData.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return mockData.users[userIndex];
  },
  description: 'Update user by ID',
}
```

### DELETE Request

```typescript
{
  method: 'DELETE',
  path: '/api/users/:id',
  enabled: true,
  response: (params) => {
    const userId = params?.id as string;
    const userIndex = mockData.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { error: 'User not found', status: 404 };
    }
    
    mockData.users.splice(userIndex, 1);
    return { success: true };
  },
  status: 204,
  description: 'Delete user by ID',
}
```

## Advanced Examples

### Pagination

```typescript
{
  method: 'GET',
  path: '/api/users',
  enabled: true,
  response: (params) => {
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedUsers = mockData.users.slice(startIndex, endIndex);
    
    return {
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: mockData.users.length,
        totalPages: Math.ceil(mockData.users.length / limit),
        hasNext: endIndex < mockData.users.length,
        hasPrev: page > 1,
      },
    };
  },
  description: 'Get paginated users',
}
```

### Search and Filtering

```typescript
{
  method: 'GET',
  path: '/api/users',
  enabled: true,
  response: (params) => {
    const search = params?.search as string;
    const role = params?.role as string;
    
    let filtered = [...mockData.users];
    
    // Search by name
    if (search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by role
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }
    
    return filtered;
  },
  description: 'Search and filter users',
}
```

### Sorting

```typescript
{
  method: 'GET',
  path: '/api/users',
  enabled: true,
  response: (params) => {
    const sortBy = params?.sortBy as string || 'name';
    const order = params?.order as string || 'asc';
    
    const sorted = [...mockData.users].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  },
  description: 'Get sorted users',
}
```

### Authentication

```typescript
{
  method: 'POST',
  path: '/api/auth/login',
  enabled: true,
  response: (params) => {
    const { email, password } = params?.body as { email: string; password: string };
    
    // Validate credentials
    if (email === 'user@example.com' && password === 'password123') {
      return {
        user: {
          id: '1',
          email,
          name: 'John Doe',
        },
        token: 'mock-jwt-token-12345',
        expiresIn: 3600,
      };
    }
    
    return {
      error: 'Invalid credentials',
      status: 401,
    };
  },
  description: 'User login',
}
```

### File Upload Simulation

```typescript
{
  method: 'POST',
  path: '/api/upload',
  enabled: true,
  response: (params) => {
    const { filename, size } = params?.body as { filename: string; size: number };
    
    return {
      id: 'file-' + Date.now(),
      filename,
      size,
      url: `https://cdn.example.com/files/${filename}`,
      uploadedAt: new Date().toISOString(),
    };
  },
  delay: 1500, // Simulate upload time
  status: 201,
  description: 'Upload file',
}
```

### Rate Limiting

```typescript
let requestCount = 0;
let resetTime = Date.now() + 60000; // Reset after 1 minute

{
  method: 'GET',
  path: '/api/limited',
  enabled: true,
  response: () => {
    // Reset counter if time expired
    if (Date.now() > resetTime) {
      requestCount = 0;
      resetTime = Date.now() + 60000;
    }
    
    requestCount++;
    
    // Rate limit: 10 requests per minute
    if (requestCount > 10) {
      return {
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        status: 429,
      };
    }
    
    return {
      data: 'Success',
      remaining: 10 - requestCount,
    };
  },
  headers: {
    'X-RateLimit-Limit': '10',
    'X-RateLimit-Remaining': String(10 - requestCount),
  },
  description: 'Rate limited endpoint',
}
```

## Real-World Scenarios

### E-commerce Product Listing

```typescript
{
  method: 'GET',
  path: '/api/products',
  enabled: true,
  response: (params) => {
    const category = params?.category as string;
    const minPrice = Number(params?.minPrice) || 0;
    const maxPrice = Number(params?.maxPrice) || Infinity;
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 20;
    
    let products = [...mockData.products];
    
    // Filter by category
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    // Filter by price range
    products = products.filter(p => 
      p.price >= minPrice && p.price <= maxPrice
    );
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      total: products.length,
      page,
      limit,
      totalPages: Math.ceil(products.length / limit),
    };
  },
  delay: 400,
  description: 'Get filtered and paginated products',
}
```

### Shopping Cart

```typescript
const cart: Record<string, CartItem[]> = {};

{
  method: 'POST',
  path: '/api/cart/items',
  enabled: true,
  response: (params) => {
    const { userId, productId, quantity } = params?.body as {
      userId: string;
      productId: string;
      quantity: number;
    };
    
    if (!cart[userId]) {
      cart[userId] = [];
    }
    
    const existingItem = cart[userId].find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart[userId].push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }
    
    return {
      cart: cart[userId],
      total: cart[userId].reduce((sum, item) => sum + item.quantity, 0),
    };
  },
  status: 201,
  description: 'Add item to cart',
}
```

### Notifications

```typescript
{
  method: 'GET',
  path: '/api/notifications',
  enabled: true,
  response: (params) => {
    const unreadOnly = params?.unreadOnly === 'true';
    
    let notifications = [...mockData.notifications];
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }
    
    return {
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
    };
  },
  description: 'Get user notifications',
}
```

## Testing Patterns

### Success Scenario

```typescript
export const successScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/api/users',
    enabled: true,
    response: mockData.users,
    delay: 200,
    description: 'Success: Get all users',
  },
];
```

### Error Scenario

```typescript
export const errorScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/api/users',
    enabled: true,
    response: { error: 'Internal Server Error' },
    status: 500,
    delay: 300,
    description: 'Error: Server error',
  },
];
```

### Loading State Scenario

```typescript
export const slowNetworkScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/api/users',
    enabled: true,
    response: mockData.users,
    delay: 5000, // 5 seconds
    description: 'Slow: Test loading states',
  },
];
```

### Empty State Scenario

```typescript
export const emptyDataScenario: MockEndpointConfig[] = [
  {
    method: 'GET',
    path: '/api/users',
    enabled: true,
    response: [],
    delay: 300,
    description: 'Empty: No users found',
  },
];
```

### Validation Error Scenario

```typescript
export const validationErrorScenario: MockEndpointConfig[] = [
  {
    method: 'POST',
    path: '/api/users',
    enabled: true,
    response: {
      error: 'Validation failed',
      details: {
        email: 'Email is required',
        password: 'Password must be at least 8 characters',
      },
    },
    status: 422,
    description: 'Validation: Invalid user data',
  },
];
```

## Tips

### 1. Use TypeScript for Type Safety

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

{
  response: (params): User => {
    // TypeScript ensures return type matches
    return mockData.users[0];
  },
}
```

### 2. Simulate Realistic Delays

```typescript
// Fast endpoint
{ delay: 100 }

// Normal endpoint
{ delay: 300 }

// Slow endpoint
{ delay: 1000 }

// Very slow (for testing loading states)
{ delay: 3000 }
```

### 3. Handle Edge Cases

```typescript
{
  response: (params) => {
    // Missing parameter
    if (!params?.id) {
      return { error: 'ID required', status: 400 };
    }
    
    // Not found
    const item = mockData.items.find(i => i.id === params.id);
    if (!item) {
      return { error: 'Not found', status: 404 };
    }
    
    // Success
    return item;
  },
}
```

### 4. Document Your Mocks

```typescript
{
  description: 'Get user profile - returns 404 if user not found, 401 if unauthorized',
}
```

### 5. Use Scenarios for Testing

```typescript
// In your test
import { scenarios } from './mocks/scenarios';
import { createHandlers } from './mocks/handlerFactory';

// Test error handling
const errorHandlers = createHandlers(scenarios.error);
updateHandlers(errorHandlers);

// Run your test
// ...
```

## Resources

- [README.md](./README.md) - Complete documentation
- [scenarios.ts](./scenarios.ts) - Predefined scenarios
- [mock.config.ts](./mock.config.ts) - Configuration file
