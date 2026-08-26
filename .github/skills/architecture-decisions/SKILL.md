---
name: architecture-decisions
description: Use for React architecture decisions, ADRs, state ownership, dependency boundaries, and choosing between Zustand, TanStack React Query, Context, and local state.
argument-hint: Describe the feature or architectural decision.
---

# Architecture Decisions

Use this skill when a ticket changes boundaries, state ownership, data fetching, or reusable component contracts.

## Procedure

1. Inspect the owning feature, route, service, and existing tests.
2. State the decision and rejected alternatives.
3. Classify each piece of state:
   - Remote data, cache, mutations, and invalidation: TanStack React Query.
   - Shared mutable client state across features: Zustand.
   - Ephemeral state local to one component: `useState` or a local reducer.
   - Stable dependency or provider configuration: Context.
4. Define the smallest public API and dependency direction.
5. Record an ADR in `docs/adr/` when the decision affects multiple features or future work.
6. Ask the user to confirm the decision before implementation when tradeoffs are material.

## Output

Return decision, context, alternatives rejected, affected boundaries, migration risk, and the user confirmation needed.
