# Project Copilot Instructions

This is a React + TypeScript application. Work in small, reviewable changes and preserve existing public APIs unless the ticket requires a change.

## Architecture

- Prefer functional components and composition over inheritance.
- Apply SOLID and DRY without introducing abstractions that do not remove real duplication.
- Use Zustand for shared client state, TanStack React Query for server state, caching, mutations, and invalidation, and local `useState` for ephemeral component state.
- Use Context only for stable cross-cutting dependencies or providers, not as a replacement for either state library.
- Keep feature code close to its route and domain; expose only deliberate public module APIs.
- Use strict TypeScript. Do not use `any`; prefer generics, discriminated unions, utility types, and `unknown` with narrowing.
- Build reusable UI with atomic design where it improves consistency, without forcing trivial components into needless layers.

## Quality

- Meet WCAG 2.1 AA: semantic HTML, keyboard operation, visible focus, accessible names, correct labels, sensible heading order, and sufficient contrast.
- Add or update focused unit/component tests for behavior and failure states. The project target is at least 80% coverage.
- Before handoff, run `npm run typecheck`, `npm run lint`, `npm run format:check`, and the relevant test command.
- Use Conventional Commits. Never commit secrets, generated output, or `.env` files.

## Workflow

The custom agents define responsibilities and handoffs. Planner is read-only, Reviewer is skeptical, and Delivery is conservative. Agents should load the relevant skill and report evidence rather than duplicate workflow guidance.
