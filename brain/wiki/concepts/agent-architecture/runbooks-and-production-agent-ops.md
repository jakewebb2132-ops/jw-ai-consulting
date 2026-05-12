# Runbooks & Production Agent Operations
**Source**: [[2026-05-11-linkedin-articles-inspiration]] (Rohit Ghumare @ghumare64)
**Last updated**: 2026-05-11

## Core insight

> "Production agents will not become reliable because we write better prompts. They will become reliable when we give them the same operational scaffolding we gave humans: runbooks, permissions, logs, rollback, and verification."

The mental model shift: **treat agents like production workers, not chatbots.**

## The operational scaffolding stack

| Human worker gets | Agent equivalent |
|------------------|-----------------|
| Runbook / SOP | Structured skill definition (SKILL.md format) |
| Permissions | Tool access controls, scoped API keys |
| Logs | Append-only action logs per run |
| Rollback | Git commit before mutating state; dry-run mode |
| Verification | Output assertions, unit tests on agent output |

## Why prompting alone fails

Prompting is negotiation. You can't negotiate your way to reliability at scale. A complex prompt that works 90% of the time will fail 10% — and in production, that's catastrophic.

Operational scaffolding doesn't make the agent smarter — it makes failures **recoverable and observable**.

## Connection to Jake's work

- Every skill in `~/brain/skills/` should have: defined inputs, expected outputs, a verification step, and a rollback path
- This is the argument for why clients need Jake's consulting: they want agent reliability but are building prompts, not systems

**Cross-references**: [[agentic-reasoning-survey]], [[intelligent-ai-delegation]], [[ai-organizational-readiness]]
