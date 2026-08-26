---
name: React and TypeScript files
description: Apply React composition, strict TypeScript, state ownership, and WCAG 2.1 AA rules when editing application code.
applyTo: 'src/**/*.{ts,tsx}'
---

Use functional components and composition. Keep server state in TanStack React Query, shared client state in Zustand, and short-lived UI state local to the component. Avoid Context for mutable application state unless an existing provider contract requires it.

Use explicit types and `unknown` narrowing. Do not introduce `any`, non-null assertions, or type casts to silence errors without documenting the boundary in the handoff. Preserve accessible names, keyboard behavior, focus management, semantic structure, and error announcements when changing UI.
