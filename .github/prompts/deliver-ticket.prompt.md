---
name: Deliver Ticket
description: Run conservative final checks and prepare an approval-gated delivery summary for a React ticket.
argument-hint: Provide the ticket, implementation summary, and review findings.
agent: Delivery Agent
---

Load release-readiness. Validate the completed ticket, report exact command results and coverage, check scope and secrets, and prepare a Conventional Commit proposal. Ask for explicit user approval before commit, push, merge, tag, or release.

Delivery context:
{{input}}
