---
name: react-quality
description: Use when implementing or reviewing React components, hooks, routes, forms, or stateful UI that must meet strict TypeScript, atomic design, WCAG 2.1 AA, and 80% coverage expectations.
argument-hint: Describe the React slice to implement or review.
---

# React Quality

## Procedure

1. Identify the smallest reusable component or feature boundary.
2. Define props with strict types; use composition and slots over inheritance.
3. Choose state ownership using the architecture-decisions skill.
4. Implement semantic HTML, accessible names, keyboard support, focus behavior, status/error announcements, and WCAG 2.1 AA contrast expectations.
5. Test user-visible behavior with Vitest and Testing Library, including loading, empty, error, and interaction states.
6. Run `npm run typecheck`, `npm run lint`, `npm run format:check`, and the focused test command.

## Review Checklist

- No `any`, avoidable casts, or hidden network calls in render.
- Query keys, invalidation, and error states are explicit.
- Zustand selectors avoid unrelated rerenders.
- Components remain composable and feature boundaries stay clear.
- Tests assert behavior and include keyboard and failure paths where applicable.
