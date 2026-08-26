---
name: release-readiness
description: Use for final delivery, release checks, pull request preparation, Conventional Commits, changelog impact, and conservative validation of React changes.
argument-hint: Describe the completed change and intended delivery.
---

# Release Readiness

## Procedure

1. Read the ticket, implementation summary, and reviewer findings.
2. Inspect the diff for scope creep, secrets, generated files, breaking API changes, and missing tests.
3. Run `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm run test:coverage`.
4. Report exact results, coverage, known risks, and any command that could not run.
5. Prepare a Conventional Commit and pull request summary, but ask the user before committing, pushing, tagging, or releasing.

Delivery is a report and approval gate. Do not silently alter unrelated files or bypass a failing check.
