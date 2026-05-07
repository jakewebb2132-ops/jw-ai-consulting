# Log
_Append-only. Newest at top. Parse with: `grep "^## \[" log.md`_

## [2026-05-06] ingest | LinkedIn Articles & Inspiration (Jake's Notion page)
**Raw file**: `raw/2026-05-06-linkedin-articles-inspiration.md`
**Pages created**: `wiki/concepts/ai-organizational-readiness.md`, `wiki/concepts/ai-organizational-autonomy-levels.md`, `wiki/concepts/intelligent-ai-delegation.md`, `wiki/concepts/kv-cache-machine-memory.md`, `wiki/concepts/content-at-scale-pipeline.md`, `wiki/concepts/geo-ai-overview-manipulation.md`
**Key takeaways**: Miessler's AI readiness = Jake's core sales thesis academically framed. KV cache eviction (recency≠importance) is the foundational agent memory insight. Content-at-scale pipeline directly applicable to JW AI Consulting LinkedIn. GEO press release hack useful for early startup brand control.

## [2026-05-03] Austin Events | Manual on-demand refresh executed. Data updated, pushed to GitHub, and deployed to Vercel.

## [2026-05-03] infrastructure | Model-agnostic shared memory system
**Files created**: `projects/INDEX.md`, `projects/austin-events.md`, `scripts/brain.py`, `.env`
**Supabase**: `thoughts` table live on project `cdbvlnxirrfczxdccwbr` with pgvector (1536-dim), HNSW index, full-text + semantic search
**Key learning**: Gemini embedding model is `gemini-embedding-001` (v1beta), request `outputDimensionality: 1536` to stay within HNSW 2000-dim limit
**See**: `LEARNINGS.md` EXP-003 for full findings

## [2026-05-03] project | Austin AI Events landing page
**Project file**: `projects/austin-events.md`  
**Disk location**: `~/Sites/austin-events`  
**Deployed**: Vercel (`austin-events` project)  
**Key detail**: Weekly landing page for Austin AI events. Data written by scheduled agent every Sunday 5 PM from 15+ sources including Ethan @ ABR newsletter. Stack: Vite + Tailwind + React.

## [2026-04-18] ingest | Karpathy LLM Wiki Pattern
**Raw file**: `raw/karpathy-llm-wiki-pattern.md`  
**Pages created/updated**: `wiki/concepts/karpathy-llm-wiki-pattern.md`, `wiki/index.md`, `CLAUDE.md` (wiki schema added)  
**Key takeaway**: Karpathy designated #1 source of truth for LLM system design. Schema established in CLAUDE.md. Wiki structure initialized.

## [2026-04-18] ingest | AI Weekly Newsletter (Aakash Gupta, Apr 8 2026)
**Raw file**: `raw/2026-04-18-ai-weekly-newsletter.md`  
**Pages created**: `wiki/platforms/claude-managed-agents.md`, `wiki/platforms/claude-m365-connector.md`, `wiki/platforms/claude-mythos.md`, `wiki/models/gemma-4.md`, `wiki/tools/autoagent.md`  
**Key takeaways**: Claude Managed Agents obsoletes orchestration middleware layer. AutoAgent applicable to enrichment pipeline self-optimization. M365 connector undercuts Copilot.
