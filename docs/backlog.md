# Enterprise React Application Backlog

> **Purpose**: Complete tracking for enterprise-react application architecture and implementation patterns  
> **Tech Stack**: React 19, TypeScript 6, Vite 8, React Router 7, Okta Auth, Axios  
> **Status**: ✅ Core Implementation Complete  
> **Last Updated**: 2026-08-24

---

## 🎯 Technology Stack

### Core Framework

| Technology     | Version | Purpose                      |
| -------------- | ------- | ---------------------------- |
| **React**      | 19.2.8  | UI library (SPA)             |
| **Vite**       | 8.2.0   | Build tool + dev server      |
| **TypeScript** | 6.0.2   | Type safety                  |

### Routing & Navigation

| Technology           | Version | Purpose                          |
| -------------------- | ------- | -------------------------------- |
| **React Router DOM** | 7.11.0  | Client-side routing              |

### State Management

| Technology        | Version | Purpose                          |
| ----------------- | ------- | -------------------------------- |
| **React Context** | 19.2.8  | Global state management          |

### UI & Styling

| Technology                         | Version | Purpose                               |
| ---------------------------------- | ------- | ------------------------------------- |
| **Tailwind CSS**                   | 3.6.0   | Utility-first styling                 |
| **tailwind-merge**                 | 3.6.0   | Class merging utility                 |
| **clsx**                           | 2.1.1   | Conditional class names               |

### Forms & Validation

| Technology | Version | Purpose                  |
| ---------- | ------- | ------------------------ |
| **Zod**    | 4.4.3   | Schema validation        |

### Authentication & Security

| Technology           | Version | Purpose                  |
| -------------------- | ------- | ------------------------ |
| **Okta Auth JS**     | 8.0.1   | Authentication provider  |
| **Okta React**       | 6.11.0  | React integration        |
| **Keycloak JS**      | 26.2.4  | Alternative auth option  |

### API & HTTP

| Technology | Version | Purpose            |
| ---------- | ------- | ------------------ |
| **Axios**  | 1.19.0  | HTTP client        |

### Testing

| Technology                | Version | Purpose            |
| ------------------------- | ------- | ------------------ |
| **Vitest**                | 4.1.10  | Unit testing       |
| **React Testing Library** | 16.3.2  | Component testing  |

### Code Quality

| Technology         | Version | Purpose         |
| ------------------ | ------- | --------------- |
| **ESLint**         | 10.8.0  | Linting         |
| **Prettier**       | 3.9.6   | Code formatting |
| **Husky**          | 9.1.7   | Git hooks       |
| **lint-staged**    | 17.3.0  | Pre-commit lint |

---

## 📊 Architecture Overview

### Application Structure

```
enterprise-react/
├── src/
│   ├── app/                    # Application bootstrap and configuration
│   │   ├── bootstrap.ts        # App initialization logic
│   │   ├── registerModules.ts  # Module registration system
│   │   └── router.tsx          # Router configuration
│   ├── auth/                   # Authentication system
│   │   ├── core/              # Core auth logic
│   │   │   ├── AuthContext.tsx
│   │   │   ├── AuthManager.ts
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── AuthService.ts
│   │   │   ├── types.ts
│   │   │   └── useAuth.ts
│   │   └── adapters/          # Auth provider adapters
│   │       ├── AuthAdapter.ts
│   │       └── OktaAdapter.ts
│   ├── router/                # Routing system
│   │   ├── core/             # Core routing logic
│   │   ├── navigation/       # Navigation utilities
│   │   ├── RouteRegistry.ts  # Route registration
│   │   ├── RouteProvider.tsx # Route provider
│   │   ├── RouteManager.tsx  # Route manager
│   │   ├── ProtectedRoute.tsx
│   │   ├── PageWrapper.tsx
│   │   ├── LoadingBoundary.tsx
│   │   └── types.ts
│   ├── api/                  # API layer
│   │   ├── HttpClient.ts
│   │   ├── ApiClient.ts
│   │   ├── BaseApiService.ts
│   │   ├── errors.ts
│   │   └── types.ts
│   ├── modules/              # Feature modules
│   │   ├── home/
│   │   ├── dashboard/
│   │   ├── roles/
│   │   ├── users/
│   │   ├── userDetails/
│   │   └── login-cb/
│   ├── layouts/              # Layout components
│   │   ├── DefaultLayout.tsx
│   │   └── BlankLayout.tsx
│   ├── services/             # Business services
│   │   └── UserService.ts
│   ├── components/           # Shared components
│   └── pages/                # Standalone pages
└── public/                   # Static assets
```

---

## 🏗️ Implementation Approach

### 1. Routing System

#### Architecture Pattern: **Centralized Route Registry**

**Key Components:**

- **RouteRegistry**: Singleton pattern for route management
- **RouteDefinition**: Type-safe route configuration
- **ManagedRoute**: Internal route representation with lazy loading
- **defineRoute**: Helper function for route definition

**Implementation Details:**

```typescript
// Route Definition Structure
interface RouteDefinition {
  id: string;                    // Unique route identifier
  path: string;                  // URL path pattern
  component: ImportComponent;    // Lazy-loaded component
  meta?: RouteMeta;             // Route metadata
}

// Route Metadata
interface RouteMeta {
  title?: string;               // Page title
  breadcrumb?: string | Function; // Breadcrumb label
  layout?: ComponentType;       // Layout component
  requiresAuth?: boolean;       // Authentication requirement
  permissions?: string[];       // Required permissions
  roles?: string[];            // Required roles
  featureFlag?: string;        // Feature flag
  nav?: NavigationMeta;        // Navigation metadata
}
```

**Features:**

- ✅ Lazy loading with React.lazy()
- ✅ Duplicate route detection
- ✅ Type-safe route definitions
- ✅ Metadata-driven configuration
- ✅ Hierarchical navigation support

**Module Registration Pattern:**

```typescript
// Each module exports its routes
export default [
  defineRoute({
    id: 'module-route-id',
    path: '/module-path',
    component: () => import('./ModulePage'),
    meta: {
      title: 'Module Title',
      breadcrumb: 'Module',
      layout: DefaultLayout,
      requiresAuth: true,
      nav: {
        label: 'Module',
        order: 1,
        hierarchy: ['Category', 'Subcategory']
      }
    }
  })
];

// Routes are registered at app startup
routeRegistry.register([
  ...homeRoutes,
  ...dashboardRoutes,
  ...rolesRoutes,
  // ... other module routes
]);
```

---

### 2. Layout System

#### Architecture Pattern: **Metadata-Driven Layout Selection**

**Key Components:**

- **PageWrapper**: Layout orchestrator
- **DefaultLayout**: Standard application layout with header
- **BlankLayout**: Minimal layout for auth pages

**Implementation Details:**

```typescript
// PageWrapper determines layout based on route metadata
const Layout = meta?.layout ?? BlankLayout;

let page = (
  <LoadingBoundary>
    <Layout>
      <Component />
    </Layout>
  </LoadingBoundary>
);

if (meta?.requiresAuth) {
  page = <ProtectedRoute>{page}</ProtectedRoute>;
}
```

**Features:**

- ✅ Declarative layout assignment via route metadata
- ✅ Default layout fallback (BlankLayout)
- ✅ Suspense-based loading boundaries
- ✅ Conditional route protection

**Layout Composition:**

- **DefaultLayout**: Header + Main content area
- **BlankLayout**: Pass-through wrapper for full-page experiences

---

### 3. Navigation System

#### Architecture Pattern: **Tree-Based Navigation with Breadcrumbs**

**Key Components:**

- **NavigationProvider**: Navigation state provider
- **RouteTreeBuilder**: Builds hierarchical navigation tree
- **BreadcrumbBuilder**: Generates breadcrumb trails
- **Navigation Hooks**: useNavigation, useCurrentRoute, useBreadcrumbs

**Implementation Details:**

```typescript
// Navigation Item Structure
interface NavigationItem {
  id: string;
  label: string;
  path?: string;
  icon?: ReactNode;
  order: number;
  level: number;
  isGroup: boolean;          // Group vs page node
  parentId?: string;         // Parent reference
  children: NavigationItem[];
  route?: RouteInfo;         // Lightweight route info
}

// Navigation State
interface NavigationState {
  tree: NavigationItem[];                      // Root navigation tree
  lookup: Map<string, NavigationItem>;         // ID-based lookup
  routeLookup: Map<string, NavigationItem>;    // Path-based lookup
}
```

**Features:**

- ✅ Hierarchical navigation tree from route metadata
- ✅ Automatic grouping based on hierarchy array
- ✅ Order-based sorting
- ✅ Breadcrumb generation from current route
- ✅ Efficient lookups via Map structures

**Navigation Building Process:**

1. Filter routes with `nav.visible !== false`
2. Process hierarchy to create group nodes
3. Create page nodes with route information
4. Sort by order property
5. Build lookup maps for efficient access

---

### 4. Authentication System

#### Architecture Pattern: **Adapter Pattern with Manager**

**Key Components:**

- **AuthManager**: Core authentication orchestrator
- **AuthAdapter**: Interface for auth providers
- **OktaAdapter**: Okta-specific implementation
- **AuthProvider**: React context provider
- **AuthService**: Singleton service accessor

**Implementation Details:**

```typescript
// Auth State Structure
interface AuthState {
  authenticated: boolean;
  user?: AuthUser;
  session?: AuthSession;
}

interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
}
```

**Features:**

- ✅ Provider-agnostic authentication via adapter pattern
- ✅ Automatic token refresh with scheduled timers
- ✅ Observer pattern for state updates
- ✅ Singleton service for global access
- ✅ PKCE flow support (Okta)
- ✅ Original URI preservation for post-login redirect

**Authentication Flow:**

1. **Bootstrap**: Initialize AuthManager with adapter
2. **Login**: Redirect to auth provider
3. **Callback**: Handle redirect, extract tokens
4. **Session**: Store session data, schedule refresh
5. **Refresh**: Automatic token renewal before expiry
6. **Logout**: Clear session, redirect to logout URL

**Token Refresh Strategy:**

```typescript
// Schedule refresh 1 minute before token expiry
const refreshAt = expiresAt * 1000 - Date.now() - 60000;
window.setTimeout(() => this.refreshToken(), refreshAt);
```

---

### 5. API Layer

#### Architecture Pattern: **Layered HTTP Client with Error Handling**

**Key Components:**

- **HttpClient**: Low-level fetch wrapper with error mapping
- **ApiClient**: High-level client with auth integration
- **BaseApiService**: Abstract base class for domain services

**Implementation Details:**

```typescript
// API Request Options
interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
}

// Error Hierarchy
ApiError (base)
├── UnauthorizedError (401)
├── ForbiddenError (403)
├── NotFoundError (404)
├── ValidationError (422)
└── ServerError (5xx)
```

**Features:**

- ✅ Automatic token injection from AuthService
- ✅ Token refresh on 401 with retry
- ✅ URL building with query parameters
- ✅ Typed error responses
- ✅ JSON serialization/deserialization
- ✅ Base service class for CRUD operations

**API Client Flow:**

1. Get auth state from AuthService
2. Build headers with Content-Type and Authorization
3. Build URL with base path and query params
4. Execute request via HttpClient
5. On 401: Attempt token refresh and retry
6. On success: Return typed response
7. On error: Throw typed error

**Service Implementation Pattern:**

```typescript
class UserService extends BaseApiService {
  getUsers() {
    return this.get<User[]>('/users');
  }
  
  getUser(id: string) {
    return this.get<User>(`/users/${id}`);
  }
  
  searchUsers(search: string, page: number) {
    return this.get<User[]>('/users', {
      params: { search, page }
    });
  }
  
  createUser(user: User) {
    return this.post<User>('/users', user);
  }
  
  updateUser(id: string, user: User) {
    return this.put<User>(`/users/${id}`, user);
  }
  
  deleteUser(id: string) {
    return this.delete<void>(`/users/${id}`);
  }
}
```

---

### 6. Module System

#### Architecture Pattern: **Feature-Based Module Organization**

**Module Structure:**

```
modules/
├── home/
│   ├── HomePage.tsx
│   └── routes.ts
├── dashboard/
│   ├── DashboardPage.tsx
│   └── routes.ts
├── roles/
│   ├── RolesPage.tsx
│   └── route.ts
├── users/
│   ├── UsersPage.tsx
│   └── route.ts
├── userDetails/
│   ├── UserDetails.tsx
│   └── route.ts
└── login-cb/
    ├── LoginCallbackPage.tsx
    └── route.ts
```

**Module Registration:**

- Each module exports route definitions
- Routes registered at app startup via `registerModules()`
- Self-contained feature modules with co-located routes

**Module Route Pattern:**

```typescript
// modules/dashboard/routes.ts
import DefaultLayout from '../../layouts/DefaultLayout';
import { defineRoute } from '../../router';

const dashboardRoutes = [
  defineRoute({
    id: 'dashboard',
    path: '/dashboard',
    component: () => import('./DashboardPage'),
    meta: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      layout: DefaultLayout,
      requiresAuth: true,
      permissions: ['dashboard:view'],
      nav: {
        label: 'Dashboard',
        order: 1,
        hierarchy: ['General']
      }
    }
  })
];

export default dashboardRoutes;
```

---

### 7. Type System

#### Architecture Pattern: **Centralized Type Definitions**

**Type Organization:**

- **Router Types** (`router/types.ts`): Route, navigation, metadata types
- **Auth Types** (`auth/core/types.ts`): Auth state, user, session types
- **API Types** (`api/types.ts`): Request options, response types
- **Navigation Types** (`router/navigation/types.ts`): Navigation item types

**Key Type Patterns:**

```typescript
// Lazy component import type
type ImportComponent = () => Promise<{ default: ComponentType<any> }>

// Metadata-driven configuration
interface RouteMeta {
  title?: string;
  breadcrumb?: string | ((params: Record<string, string>) => string);
  layout?: ComponentType<any>;
  requiresAuth?: boolean;
  permissions?: string[];
  roles?: string[];
  featureFlag?: string;
  nav?: NavigationMeta;
}

// Hierarchical navigation
interface NavigationMeta {
  label: string;
  icon?: ReactNode;
  order?: number;
  hierarchy?: string[];  // e.g., ['Administration', 'Identity']
  visible?: boolean;
}
```

**Features:**

- ✅ Strict TypeScript mode
- ✅ Type-safe route definitions
- ✅ Generic type support for API responses
- ✅ Discriminated unions for error types
- ✅ Utility types for common patterns

---

### 8. Hooks System

#### Custom Hooks Implemented:

**Authentication:**

- `useAuth()`: Access auth state and methods

**Navigation:**

- `useNavigation()`: Access navigation tree and lookups
- `useCurrentRoute()`: Get current route information
- `useBreadcrumbs()`: Generate breadcrumb trail for current route

**Hook Implementation Pattern:**

```typescript
// useAuth hook
export default function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  const { state, manager } = context;
  
  return {
    isAuthenticated: state.authenticated,
    user: state.user,
    session: state.session,
    login: () => manager.login(),
    logout: () => manager.logout()
  };
}

// useBreadcrumbs hook
export default function useBreadcrumbs() {
  const current = useCurrentRoute();
  const { lookup } = useNavigation();
  
  return useMemo(() => {
    return new BreadcrumbBuilder().build(current, lookup);
  }, [current, lookup]);
}
```

---

### 9. Error Handling

#### Architecture Pattern: **Typed Error Hierarchy**

**Error Classes:**

```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class UnauthorizedError extends ApiError {
  constructor(data?: unknown) {
    super(401, 'Unauthorized', data);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends ApiError {
  constructor(data?: unknown) {
    super(403, 'Forbidden', data);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends ApiError {
  constructor(data?: unknown) {
    super(404, 'Not Found', data);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends ApiError {
  constructor(message: string, data?: unknown) {
    super(422, message, data);
    this.name = 'ValidationError';
  }
}

class ServerError extends ApiError {
  constructor(status: number, data?: unknown) {
    super(status, 'Server Error', data);
    this.name = 'ServerError';
  }
}
```

**Error Handling Strategy:**

- HTTP status codes mapped to specific error types
- Error data preserved for debugging
- Automatic retry on 401 after token refresh
- Type-safe error catching and handling

---

## 📋 Implementation Checklist

### Phase 1: Core Architecture ✅

- [x] Vite + React + TypeScript setup
- [x] Route registry system
- [x] Route definition helpers
- [x] Lazy loading implementation
- [x] Layout system
- [x] Protected routes

### Phase 2: Authentication ✅

- [x] Auth adapter interface
- [x] Okta adapter implementation
- [x] Auth manager with state management
- [x] Auth provider and context
- [x] Auth service singleton
- [x] Token refresh scheduling
- [x] Login/logout flows

### Phase 3: Navigation ✅

- [x] Navigation tree builder
- [x] Breadcrumb builder
- [x] Navigation provider
- [x] Navigation hooks
- [x] Current route detection
- [x] Hierarchical navigation support

### Phase 4: API Layer ✅

- [x] HTTP client with fetch
- [x] API client with auth integration
- [x] Base API service class
- [x] Error type hierarchy
- [x] Request/response typing
- [x] URL building utilities

### Phase 5: Modules ✅

- [x] Home module
- [x] Dashboard module
- [x] Roles module
- [x] Users module
- [x] User details module
- [x] Login callback module
- [x] Module registration system

### Phase 6: Services ✅

- [x] User service implementation
- [x] Service base class pattern
- [x] CRUD operation methods

### Phase 7: Components ✅

- [x] Initial loader component
- [x] Loading boundary with Suspense
- [x] Page wrapper component
- [x] Layout components

---

## 🎯 Key Design Patterns

### 1. Adapter Pattern

**Used in**: Authentication system

**Purpose**: Support multiple auth providers (Okta, Keycloak) with single interface

**Implementation**:

```typescript
interface AuthAdapter {
  initialize(): Promise<boolean>;
  login(): Promise<void>;
  logout(): Promise<void>;
  refreshToken(): Promise<boolean>;
  getState(): AuthState;
  handleLoginRedirect(): Promise<void>;
}

class OktaAdapter implements AuthAdapter { /* ... */ }
class KeycloakAdapter implements AuthAdapter { /* ... */ }
```

### 2. Singleton Pattern

**Used in**: RouteRegistry, AuthService

**Purpose**: Single source of truth for routes and auth

**Implementation**:

```typescript
class RouteRegistry {
  private routes: ManagedRoute[] = [];
  // ... methods
}

export const routeRegistry = new RouteRegistry();

// AuthService
class AuthService {
  private manager?: AuthManager;
  // ... methods
}

export default new AuthService();
```

### 3. Observer Pattern

**Used in**: AuthManager state updates

**Purpose**: Notify components of auth state changes

**Implementation**:

```typescript
class AuthManager {
  private listeners = new Set<Listener>();
  
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}
```

### 4. Factory Pattern

**Used in**: Route creation, error creation

**Purpose**: Consistent object creation

**Implementation**:

```typescript
export function defineRoute(route: RouteDefinition): RouteDefinition {
  return route;
}

// Error factory in HttpClient
switch (response.status) {
  case 401: throw new UnauthorizedError(data);
  case 403: throw new ForbiddenError(data);
  case 404: throw new NotFoundError(data);
  // ...
}
```

### 5. Builder Pattern

**Used in**: RouteTreeBuilder, BreadcrumbBuilder

**Purpose**: Complex object construction

**Implementation**:

```typescript
class RouteTreeBuilder {
  build(routes: ManagedRoute[]): NavigationState {
    // Build navigation tree from routes
    // Create lookup maps
    // Sort and organize
    return { tree, lookup, routeLookup };
  }
}
```

### 6. Template Method Pattern

**Used in**: BaseApiService

**Purpose**: Define HTTP method templates

**Implementation**:

```typescript
abstract class BaseApiService {
  protected get<T>(url: string, options?: ApiRequestOptions) {
    return api.request<T>(url, { ...options, method: 'GET' });
  }
  
  protected post<T>(url: string, body?: unknown, options?: ApiRequestOptions) {
    return api.request<T>(url, { ...options, method: 'POST', body });
  }
  // ... other methods
}
```

---

## 🚀 AI Agent Prompt

### Comprehensive Implementation Prompt

```markdown
You are implementing a feature in an enterprise React application with the following architecture:

## Tech Stack
- React 19.2.8 with TypeScript 6.0.2
- Vite 8.2.0 for build tooling
- React Router 7.11.0 for routing
- Okta Auth JS 8.0.1 for authentication
- Axios 1.19.0 for HTTP requests
- Zod 4.4.3 for validation
- Tailwind CSS 3.6.0 for styling

## Architecture Patterns

### Routing System
- **Pattern**: Centralized route registry with lazy loading
- **Location**: `src/router/RouteRegistry.ts`
- **Usage**: Define routes using `defineRoute()` helper
- **Structure**:
  ```typescript
  defineRoute({
    id: 'unique-id',
    path: '/path',
    component: () => import('./Component'),
    meta: {
      title: 'Page Title',
      breadcrumb: 'Breadcrumb',
      layout: DefaultLayout,
      requiresAuth: true,
      permissions: ['permission:action'],
      nav: {
        label: 'Nav Label',
        order: 1,
        hierarchy: ['Category', 'Subcategory']
      }
    }
  })
  ```

### Module Organization
- **Pattern**: Feature-based modules
- **Location**: `src/modules/[module-name]/`
- **Structure**: Each module contains:
  - Component file (e.g., `DashboardPage.tsx`)
  - Route definition file (e.g., `routes.ts`)
- **Registration**: Export routes array and register in `src/app/registerModules.ts`

### Authentication
- **Pattern**: Adapter pattern with manager
- **Location**: `src/auth/`
- **Components**:
  - `AuthManager`: Core orchestrator
  - `AuthAdapter`: Provider interface
  - `OktaAdapter`: Okta implementation
  - `AuthService`: Singleton accessor
- **Usage**: Use `useAuth()` hook in components
- **Features**:
  - Automatic token refresh
  - Protected routes via `ProtectedRoute` component
  - Observer pattern for state updates

### API Layer
- **Pattern**: Layered HTTP client
- **Location**: `src/api/`
- **Components**:
  - `HttpClient`: Low-level fetch wrapper
  - `ApiClient`: High-level client with auth
  - `BaseApiService`: Abstract service class
- **Usage**: Extend `BaseApiService` for domain services
- **Features**:
  - Automatic token injection
  - Token refresh on 401
  - Typed error hierarchy
  - Query parameter building

### Navigation
- **Pattern**: Tree-based navigation with breadcrumbs
- **Location**: `src/router/navigation/`
- **Components**:
  - `RouteTreeBuilder`: Builds navigation tree
  - `BreadcrumbBuilder`: Generates breadcrumbs
  - `NavigationProvider`: Context provider
- **Hooks**:
  - `useNavigation()`: Access navigation tree
  - `useCurrentRoute()`: Get current route
  - `useBreadcrumbs()`: Get breadcrumb trail

### Layout System
- **Pattern**: Metadata-driven layout selection
- **Location**: `src/layouts/`
- **Layouts**:
  - `DefaultLayout`: Standard layout with header
  - `BlankLayout`: Minimal layout
- **Usage**: Specify in route meta: `layout: DefaultLayout`

### Type System
- **Pattern**: Centralized type definitions
- **Locations**:
  - `src/router/types.ts`: Route types
  - `src/auth/core/types.ts`: Auth types
  - `src/api/types.ts`: API types
  - `src/router/navigation/types.ts`: Navigation types
- **Convention**: Use interfaces for object shapes, types for unions/utilities

### Error Handling
- **Pattern**: Typed error hierarchy
- **Location**: `src/api/errors.ts`
- **Errors**:
  - `ApiError`: Base error
  - `UnauthorizedError`: 401
  - `ForbiddenError`: 403
  - `NotFoundError`: 404
  - `ValidationError`: 422
  - `ServerError`: 5xx

## Implementation Guidelines

### Creating a New Module
1. Create folder in `src/modules/[module-name]/`
2. Create component file: `[ModuleName]Page.tsx`
3. Create route file: `routes.ts` or `route.ts`
4. Define route using `defineRoute()`
5. Export route array
6. Register in `src/app/registerModules.ts`

### Creating a Service
1. Create file in `src/services/[ServiceName].ts`
2. Extend `BaseApiService`
3. Define methods using `this.get()`, `this.post()`, etc.
4. Export singleton instance
5. Use TypeScript generics for type safety

### Adding Authentication
1. Set `requiresAuth: true` in route meta
2. Optionally add `permissions` or `roles` arrays
3. Use `useAuth()` hook to access auth state
4. Use `manager.login()` and `manager.logout()` for auth actions

### Creating Layouts
1. Create component in `src/layouts/`
2. Accept `children` prop
3. Use `PropsWithChildren` type
4. Reference in route meta: `layout: YourLayout`

### Working with Navigation
1. Add `nav` object to route meta
2. Specify `label`, `order`, and `hierarchy`
3. Use `useNavigation()` to access navigation tree
4. Use `useBreadcrumbs()` for breadcrumb trail

### Error Handling
1. Catch errors from API calls
2. Check error type using `instanceof`
3. Handle specific error types appropriately
4. Display user-friendly error messages

### Type Safety
1. Use strict TypeScript mode
2. Define interfaces for all data structures
3. Use generics for reusable components/functions
4. Avoid `any` type
5. Use utility types: `Partial`, `Pick`, `Omit`, etc.

### Code Organization
1. Co-locate related files (component + routes)
2. Use index files for clean exports
3. Keep components focused and single-purpose
4. Extract reusable logic to hooks
5. Use composition over inheritance

### Styling
1. Use Tailwind CSS utility classes
2. Use `clsx` for conditional classes
3. Use `tailwind-merge` for merging classes
4. Keep inline styles minimal
5. Create reusable component variants

### Testing
1. Use Vitest for unit tests
2. Use React Testing Library for component tests
3. Test user interactions, not implementation
4. Mock API calls and auth state
5. Aim for >80% coverage

## Common Patterns

### Protected Route Pattern
```typescript
defineRoute({
  id: 'protected-page',
  path: '/protected',
  component: () => import('./ProtectedPage'),
  meta: {
    requiresAuth: true,
    permissions: ['resource:action'],
    layout: DefaultLayout
  }
})
```

### Service Pattern
```typescript
class MyService extends BaseApiService {
  getItems() {
    return this.get<Item[]>('/items');
  }
  
  getItem(id: string) {
    return this.get<Item>(`/items/${id}`);
  }
  
  createItem(item: CreateItemDto) {
    return this.post<Item>('/items', item);
  }
  
  updateItem(id: string, item: UpdateItemDto) {
    return this.put<Item>(`/items/${id}`, item);
  }
  
  deleteItem(id: string) {
    return this.delete<void>(`/items/${id}`);
  }
}

export default new MyService();
```

### Hook Pattern
```typescript
export default function useMyHook() {
  const context = useContext(MyContext);
  
  if (!context) {
    throw new Error('useMyHook must be used within MyProvider');
  }
  
  return useMemo(() => ({
    // ... derived values
  }), [/* dependencies */]);
}
```

### Component Pattern
```typescript
import { type PropsWithChildren } from 'react';

interface Props {
  title: string;
  // ... other props
}

export default function MyComponent({ 
  title, 
  children 
}: Readonly<PropsWithChildren<Props>>) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

## When Implementing Features:

1. **Understand the architecture**: Review the patterns above
2. **Follow conventions**: Use existing patterns and structures
3. **Type everything**: Leverage TypeScript for safety
4. **Test thoroughly**: Write tests for new functionality
5. **Document changes**: Update relevant documentation
6. **Keep it simple**: Prefer composition and clarity
7. **Reuse existing code**: Don't reinvent the wheel
8. **Consider performance**: Use lazy loading, memoization
9. **Handle errors**: Implement proper error handling
10. **Maintain consistency**: Follow existing code style
```

---

## 📊 Summary Statistics

### Implementation Coverage

| Category           | Count | Status      |
| ------------------ | ----- | ----------- |
| **Core Systems**   | 8     | ✅ Complete |
| **Modules**        | 7     | ✅ Complete |
| **Services**       | 1     | ✅ Complete |
| **Layouts**        | 2     | ✅ Complete |
| **Hooks**          | 4     | ✅ Complete |
| **Design Patterns**| 6     | ✅ Complete |

### Code Organization

| Directory         | Files | Purpose                      |
| ----------------- | ----- | ---------------------------- |
| `src/app/`        | 3     | Bootstrap and configuration  |
| `src/auth/`       | 9     | Authentication system        |
| `src/router/`     | 14    | Routing and navigation       |
| `src/api/`        | 5     | HTTP client and services     |
| `src/modules/`    | 14    | Feature modules              |
| `src/layouts/`    | 2     | Layout components            |
| `src/services/`   | 1     | Business services            |
| `src/components/` | 1     | Shared components            |
| `src/pages/`      | 2     | Standalone pages             |

### Technology Adoption

| Technology Area      | Status      |
| -------------------- | ----------- |
| **React 19**         | ✅ Adopted  |
| **TypeScript 6**     | ✅ Adopted  |
| **Vite 8**           | ✅ Adopted  |
| **React Router 7**   | ✅ Adopted  |
| **Okta Auth**        | ✅ Adopted  |
| **Axios**            | ✅ Adopted  |
| **Zod**              | ✅ Adopted  |
| **Tailwind CSS**     | ✅ Adopted  |

---

## 🎯 Next Steps

### Recommended Enhancements

1. **State Management**: Add Zustand or Redux for complex state
2. **Form Library**: Integrate React Hook Form with Zod
3. **UI Components**: Add shadcn/ui or similar component library
4. **Data Fetching**: Add TanStack Query for server state
5. **Testing**: Expand test coverage with Vitest and Playwright
6. **Error Boundaries**: Add React error boundaries
7. **Logging**: Add structured logging (e.g., Consola)
8. **Monitoring**: Add error tracking (e.g., Sentry)
9. **Performance**: Add performance monitoring
10. **Accessibility**: Enhance WCAG compliance

### Documentation Needs

1. **API Documentation**: Document all service methods
2. **Component Library**: Create component documentation
3. **Architecture Diagrams**: Visual architecture overview
4. **Developer Guide**: Onboarding documentation
5. **Testing Guide**: Testing best practices
6. **Deployment Guide**: Production deployment steps

---

**Version**: 1.0  
**Last Updated**: 2026-08-24  
**Status**: ✅ Core Implementation Complete  
**Maintained by**: Development Team
