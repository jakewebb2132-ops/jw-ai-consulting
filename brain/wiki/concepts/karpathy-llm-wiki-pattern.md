# Karpathy LLM Wiki Pattern
**Source**: [[karpathy-llm-wiki-pattern]] (Andrej Karpathy, Apr 2026)  
**Authority**: PRIMARY — #1 source of truth for LLM knowledge system design  
**Last updated**: 2026-04-18

## Core insight

RAG retrieves from scratch every query. The Karpathy pattern compiles knowledge once and keeps it current — the wiki is a **persistent, compounding artifact**, not a retrieval index.

The shift: the LLM is the programmer, the wiki is the codebase, Obsidian is the IDE. You curate and ask; the LLM writes and maintains.

## Three-layer architecture

| Layer | Who owns it | Purpose |
|-------|-------------|---------|
| `raw/` | Human (read-only) | Immutable source documents |
| `wiki/` | LLM | Compiled, interlinked knowledge |
| `CLAUDE.md` | Co-evolved | Schema — conventions and workflows |

## Three operations

**Ingest**: New source → LLM reads → summary page → update index + relevant pages + log. One source touches 10-15 pages typically. Ingest one at a time; stay involved.

**Query**: Question → read index → read relevant pages → synthesize with citations. Good answers get filed back as wiki pages — explorations compound too.

**Lint**: Periodic health check. Find: contradictions, stale claims, orphan pages, missing cross-references, data gaps.

## Why it beats RAG

Humans abandon wikis because maintenance burden > value. LLMs don't get bored. Cost of maintenance ≈ zero. The bookkeeping that kills human-maintained wikis is exactly what LLMs are good at.

## Intellectual lineage

Vannevar Bush's Memex (1945) — private, curated knowledge with associative trails. Bush's unsolved problem was: who does the maintenance? The LLM solves it.

## Related
- [[claude-managed-agents]] — infrastructure for running agents that could maintain this
- [[autoagent]] — meta-agent that self-optimizes; same compounding-knowledge philosophy
