**Source**: [[2026-05-22-compound-orchestrator]]
**Last updated**: 2026-05-22

# Compound Orchestrator

A reusable project harness for agentic coding that makes each agent-assisted task leave behind better planning contracts, clearer ownership, stronger reviews, fresher documentation, and durable learning. Built by Ken Huang.

**Core thesis:** The model matters, but the harness is part of the intelligence. Agent work becomes a cumulative project system rather than a sequence of disconnected chats.

---

## The Bottleneck Has Shifted

Output generation is no longer the bottleneck. Coordination is. Failure modes in multi-agent projects:
- One agent edits a file another agent relied on
- Design decisions exist only in chat threads (lost between sessions)
- Tests cover happy paths only because edge cases were never promoted into the spec
- Reviewer comments are written but authoring agent never revises
- README drifts → next agent starts from stale context

See also: [[institutional-knowledge-tax]] for the cost of this pattern at org scale.

---

## Six Planning Contracts

HTML artifacts as **visible contracts** (browser-readable, reviewable by humans or agents). Not private scratchpads.

| File | Contains |
|------|----------|
| `prd.html` | Problem, scope, success criteria, non-goals, business intent |
| `users.html` | Roles, workflows, user journeys, permissions, outcomes, handoffs |
| `architecture.html` | System boundaries, dependencies, failure modes, diagrams |
| `planning.html` | Phases, ownership, sequencing, risks, delivery strategy |
| `spec.html` | States, inputs, outputs, validation rules, errors, acceptance criteria |
| `test-cases.html` | Happy paths, edge cases, error cases, performance, acceptance coverage |

**Dependency chain:** PRD + users + architecture + planning → spec → test-cases

---

## Parallelize Drafting, Serialize Acceptance

The strongest pattern:
- **Parallel:** PRD agent, users/workflow agent, architecture agent, planning agent, risk scout
- **Serialized:** spec agent (only after drafts reconciled), test-case agent (only after spec stable)

Don't parallelize everything. Integration and acceptance must be serialized to catch conflicts.

---

## Two-Round Cross Review

A review is only valuable if it changes the work.

1. Reviewing tool comments
2. Authoring tool revises
3. Reviewer checks again
4. Author closes remaining comments
5. Final acceptance recorded

Avoids shallow one-pass review and endless review loops.

---

## README Freshness as a Gate

README is the first context future agents read. If it lies, the next task starts with bad priors.

Rule: remove stale info, preserve what's still true, add new content, reorganize for current state. This is a gate, not optional cleanup.

---

## Relationship to Jake's Brain Setup

Jake's brain already implements several Compound Orchestrator patterns:
- `wiki/` = durable knowledge (analogous to compound learning folders)
- `log/daily/` = session memory (analogous to decision preservation)
- `ERRORS.md` = failure log (analogous to compound learning)
- `SOUL.md` + `RULES.md` = project operating model
- `/ship` + `/review` + `/qa` gstack skills = two-round review gate
- `CONTEXT.md` = README freshness (single source of truth, every session reads it)

**Gap:** Jake doesn't have formalized planning contracts (prd/spec/test-cases as artifacts). The `/plan-*` skills cover this partially but don't produce persistent HTML artifacts.

See also: [[karpathy-claude-md-rules]], [[meta-meta-prompting]], [[intelligent-ai-delegation]]
