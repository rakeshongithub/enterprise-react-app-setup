---
name: Tests and quality
description: Apply focused testing, coverage, lint, formatting, and typecheck expectations when editing tests or quality configuration.
applyTo: '**/*.{test,spec}.{ts,tsx},**/{vitest,eslint,prettier}*'
---

Prefer behavior-focused tests with Testing Library and Vitest. Cover happy paths, loading, empty, error, permission, keyboard, and boundary states relevant to the change. Keep tests deterministic and avoid implementation-detail assertions.

The minimum project target is 80% coverage. Every handoff must report the exact commands run and any uncovered or blocked checks.
