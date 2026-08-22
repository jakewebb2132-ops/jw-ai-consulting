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

**Ingest**: New source → LLM reads → summary page → update index + relevant pages + log → **write a change brief** (what changed, what got linked, what was flagged, what to look at). One source touches 10-15 pages typically. Ingest one at a time; stay involved. The brief is what keeps the human inside the loop instead of wondering what the model did while they were gone.

**Query**: Question → read index → read relevant pages → synthesize with citations. Good answers get filed back as wiki pages — explorations compound too.

**Lint**: Periodic health check. Find: contradictions, stale claims, orphan pages, missing cross-references, data gaps.

## Why it beats RAG

Humans abandon wikis because maintenance burden > value. LLMs don't get bored. Cost of maintenance ≈ zero. The bookkeeping that kills human-maintained wikis is exactly what LLMs are good at.

## Honest limitations

_Added 2026-08-22 from a LinkedIn popularization of the pattern._

- **Compilation amplifies bad sources.** In RAG, one bad document surfaces once and is easy to remove. In a compiled wiki, a bad source has been integrated into ~15 pages before you notice. Garbage in ≠ garbage retrieved; it's garbage compiled. This raises the bar on source curation — gate quality *at ingest*, not after.
- **Density threshold ~50-100 sources.** Non-obvious links only start appearing once the graph is dense enough. Below that, a good search engine does most of the same job and the first weeks feel slow. The compounding is real but back-loaded.
- **The loop needs persistence.** The scheduled daily-compilation task (file new inputs, flag stale >2wk, check contradictions, write a brief) requires filesystem access + scheduled tasks — Claude Desktop paid tier or an equivalent runner, not a free-tier chat.

## Intellectual lineage

Vannevar Bush's Memex (1945) — private, curated knowledge with associative trails. Bush's unsolved problem was: who does the maintenance? The LLM solves it.

## Related
- [[claude-managed-agents]] — infrastructure for running agents that could maintain this
- [[autoagent]] — meta-agent that self-optimizes; same compounding-knowledge philosophy
