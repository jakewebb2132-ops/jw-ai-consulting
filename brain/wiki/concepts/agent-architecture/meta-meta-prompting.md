# Meta-Meta-Prompting: Compounding AI Systems
**Source**: [[2026-05-11-linkedin-articles-inspiration]] (Garry Tan @garrytan — GStack/GBrain)
**Last updated**: 2026-05-11

## Core insight

The "secret" to making AI agents work is not writing better prompts — it's building **compounding orchestration systems** where a higher-level layer handles planning, verification, and rollbacks.

**Meta-prompting**: a system prompt that generates prompts.  
**Meta-meta-prompting**: an orchestration layer that generates, evaluates, and revises meta-prompts based on outcomes.

## The GStack / GBrain architecture (Garry Tan)

- **GStack**: The infrastructure layer — tools, APIs, environment config
- **GBrain**: The orchestration layer — higher-order planning, verification loops, rollback logic

The key is that GBrain doesn't just execute tasks — it evaluates whether the task was done *correctly* and revises the approach before the human sees the output.

## Why this beats single-prompt engineering

Single complex prompt: fragile, non-composable, fails silently.  
Compounding system: each layer can be tested, versioned, and improved independently.

The orchestration layer handles:
1. Task decomposition
2. Verification (did the subtask succeed?)
3. Rollback (if not, retry with modified approach)
4. Synthesis (combine subtask outputs into final result)

## Connection to Jake's brain architecture

Jake's `~/brain/skills/` system is already proto-meta-meta-prompting: skills define structured input/output contracts that an orchestration layer (Claude Code / Gemini) can compose. The next evolution is adding a **verification step** and **outcome scoring** to each skill.

**Cross-references**: [[runbooks-and-production-agent-ops]], [[agentic-reasoning-survey]], [[intelligent-ai-delegation]]
