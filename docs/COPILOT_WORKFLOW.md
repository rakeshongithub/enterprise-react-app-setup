# Copilot Workflow Guide

This project uses VS Code Copilot customizations in `.github/`. The setup separates reusable guidance from role-specific work.

## Quick Start

For a normal ticket, use this sequence:

1. Run `/plan-ticket` and provide the ticket and acceptance criteria.
2. Review the plan and answer the Planner's open questions.
3. Confirm explicitly before invoking the Ticket Implementer.
4. Confirm explicitly before invoking the Ticket Reviewer.
5. Confirm explicitly before invoking the Delivery Agent.
6. Approve any commit, push, merge, tag, or release action separately and explicitly.

The Planner and Reviewer are read-only. Every handoff asks for confirmation before the next agent begins its work. The Delivery Agent is additionally approval-gated and does not perform delivery actions without separate confirmation.

## The Building Blocks

| Part         | Purpose                                             | How it is used                                                                                                 |
| ------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Instructions | Always-on project rules                             | Copilot automatically applies `.github/copilot-instructions.md` and matching files in `.github/instructions/`. |
| Skills       | Reusable domain procedures                          | Copilot loads them when relevant, or you can invoke them with `/`.                                             |
| Prompts      | Reusable, focused task templates                    | Invoke `/plan-ticket`, `/review-ticket`, or `/deliver-ticket`.                                                 |
| Agents       | Distinct roles with different tools and permissions | Select `Ticket Planner`, `Ticket Implementer`, `Ticket Reviewer`, or `Delivery Agent`.                         |
| Hooks        | Deterministic lifecycle checks                      | The project hook asks for approval before destructive commands such as force-push, hard reset, or `rm -rf`.    |

## Instructions

Instructions provide the baseline for every task. They define the project conventions:

- Functional React components and composition over inheritance
- SOLID and DRY design
- Strict TypeScript without avoidable `any`
- TanStack React Query for server state
- Zustand for shared client state
- Local state for ephemeral component state
- Atomic design where it improves reuse
- WCAG 2.1 AA accessibility
- Focused tests and an 80% coverage target

Relevant files:

- [Project instructions](../.github/copilot-instructions.md)
- [React and TypeScript instructions](../.github/instructions/react-files.instructions.md)
- [Testing instructions](../.github/instructions/test-files.instructions.md)

You usually do not need to mention these instructions in a prompt. They are automatically available based on the file being changed.

## Skills

Skills contain procedures that should be reused across multiple tasks:

- [Architecture decisions](../.github/skills/architecture-decisions/SKILL.md): choose state ownership and record significant ADRs.
- [React quality](../.github/skills/react-quality/SKILL.md): implement or review components, hooks, routes, forms, and tests.
- [Release readiness](../.github/skills/release-readiness/SKILL.md): perform final checks and prepare a conservative delivery summary.

Use skills when the task matches their description. Agents orchestrate these skills; they should not copy the same detailed rules into every agent.

## Agents

### Ticket Planner

Use first for a ticket. It may read and search, but cannot edit, install packages, or commit. It returns scope, architecture decisions, acceptance criteria, tests, risks, and open questions.

The plan is not considered approved until you confirm it. The Implementer must ask for confirmation again when the Planner handoff is selected.

### Ticket Implementer

Use only after the plan is approved. It edits the smallest relevant slice, adds focused tests, and runs validation. It hands the result to the Reviewer.

If implementation reveals a material architecture decision that was not in the plan, it stops and asks you.

### Ticket Reviewer

Use after implementation. It cannot edit files. It looks for bugs, regressions, accessibility failures, incorrect state ownership, type escapes, security issues, and missing tests.

Review findings come first and are ordered by severity. A clean review means no known blocking findings; it does not remove the need for final validation.

### Delivery Agent

Use last. It runs the final checks, checks scope and secrets, reports coverage and risks, and prepares a Conventional Commit proposal.

It does not commit, push, merge, tag, or release without your explicit approval.

## Prompts

Use these slash commands from Copilot Chat:

- `/plan-ticket`: create a read-only implementation plan.
- `/review-ticket`: review a change skeptically.
- `/deliver-ticket`: run final validation and prepare the delivery handoff.

Include the ticket, acceptance criteria, relevant constraints, and any previous handoff in the prompt input.

## Hooks

Hooks run automatically through [project-hooks.json](../.github/hooks/project-hooks.json). The `PreToolUse` hook checks commands before they run and asks for confirmation when a command may discard work or rewrite shared history.

Full validation belongs in the Delivery Agent procedure rather than a global `Stop` hook. This allows writable agents to repair lint, typecheck, test, and build failures, while Delivery still runs the complete validation before handoff. Never put secrets in hook configuration or scripts.

Use `.husky/` for Git commit enforcement. Use `.github/hooks/` for Copilot lifecycle behavior.

## Validation Commands

The expected quality commands are:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test:coverage
```

For a focused change, also run the narrowest relevant Vitest command. Report commands that fail or cannot run; do not hide failures by weakening the configuration.

## Handoff Template

Every handoff should state:

- What changed and why
- Files changed
- State ownership decision
- Tests added or updated
- Commands run and their results
- Coverage result
- Known risks or unresolved questions
- The approval needed for the next stage
