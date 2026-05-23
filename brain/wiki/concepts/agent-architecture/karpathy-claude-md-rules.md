# Karpathy CLAUDE.md Rules
**Source**: [[2026-05-22-karpathy-claude-md]]  
**Authority**: PRIMARY — Ruleset for reducing LLM agent coding errors  
**Last updated**: 2026-05-22

## Core Insight

AI coding agents (like Claude Code) start every session with zero context. By supplying a structured `CLAUDE.md` in the project root, we prevent context re-explanation, unauthorized refactoring, and lost architectural decisions, shifting agent coding accuracy from **65% to 94%**.

## Three-part Framework

The CLAUDE.md file is organized into three distinct behavioral layers:

### 1. Defaults (Context & Communication)
Reduces the cognitive load and repetitive prompting overhead by defining:
- **Kill the filler**: Respond directly with answers; no preambles, warmups, or repeat statements.
- **Match length to task**: Concise for simple queries, detailed for complex architectures.
- **Show options**: Present 2-3 approaches before implementing significant work.
- **Acknowledge uncertainty**: Explicitly state gaps or assumptions before they propagate to code.
- **Lock Voice & Profile**: Adjust response depth to the developer's experience level and match writing preferences.

### 2. Behavior (Safety & Scope boundaries)
Guards codebase integrity and eliminates unauthorized refactoring costs:
- **Surgical scope**: Restrict edits strictly to requested functions and files. No unsolicited styling, formatting, or renaming.
- **Destructive confirmation**: Stop and list affected components before deletion, overwrites, or dependency changes.
- **Production hard stops**: Explicit confirmation required for pushes, deploys, migrations, and irreversible commands.
- **Post-task summary**: Conclude every task with a standardized change manifest:
  - Files modified (one-line summary each)
  - Files touched
  - Files intentionally ignored
  - Next steps / follow-up

### 3. Memory & Stack Lock
Locks down architectural boundaries and failure modes:
- **`MEMORY.md` Decision Log**: Log and read what was decided, why, and what was rejected. Prevents suggestions that contradict long-term architectural decisions.
- **`ERRORS.md` Failure Log**: Log attempts that failed (> 2 tries) to avoid repeating incorrect paths.
- **Stack Lock**: Standardize languages, frameworks, package managers, testing libraries, and database layers to prevent the agent from suggesting off-stack packages.

## Alignment with Local Setup

- **Defaults**: Jake's `SOUL.md` handles the "Vibe" and "Hard Rules" (no filler, no hedging, match length).
- **Behavior**: Jake's `CLAUDE.md` establishes Surgical changes and Simplicity first, but can be updated to include strict confirmation prompts for production actions and post-task file manifests.
- **Memory & Stack**: Jake's setup implements `LEARNINGS.md` (resembles `ERRORS.md` ledger) and the Supabase semantic layer (`brain.py`), which exceeds standard file-based memory by enabling cross-session database lookups.

## Related
- [[karpathy-llm-wiki-pattern]] — the database and ingest architecture used to organize this brain
- [[runbooks-and-production-agent-ops]] — the production runtime patterns for robust agents
