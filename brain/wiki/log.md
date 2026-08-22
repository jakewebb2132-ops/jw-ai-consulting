# Log
_Append-only. Newest at top. Parse with: `grep "^## \[" log.md`_

## [2026-08-22] ingest | Boom Automations AI Operating System Framework (Luke Pierce)
**Raw file**: `raw/2026-08-19-linkedin-ingest.md`
**Pages created**: `concepts/agent-architecture/boom-automations-ai-operating-system.md` (page existed already, dated 2026-08-19, but was never logged — backfilling the log entry now)
**Key takeaways**: Workflow mapping and process consolidation (absorb/keep/kill) before tool selection. One write path per entity, documented before building. Phased agent deployment with intake first. Route cheap tasks to cheap models, reserve frontier models for reasoning (>80% token savings).
**Lint**: fixed cross-reference syntax on the page (was plain text, not `[[wiki-links]]`) and added missing back-references from [[ai-organizational-readiness]], [[runbooks-and-production-agent-ops]], and [[institutional-knowledge-tax]].

## [2026-05-22] ingest | Compound Orchestrator (Ken Huang)
**Raw file**: `raw/2026-05-22-compound-orchestrator.md`
**Pages created**: `concepts/agent-architecture/compound-orchestrator.md`
**Key takeaways**: Agentic coding bottleneck is now coordination, not output. Six HTML planning contracts (prd→spec→test-cases) as visible artifacts. Parallelize drafting, serialize acceptance. Two-round review with mandatory author revision. README freshness as a hard gate. Maps well to Jake's existing brain setup; gap is persistent HTML planning artifacts.

## [2026-05-22] ingest | Notion LinkedIn Articles Ingest (16 articles)
**Raw file**: `raw/2026-05-22-linkedin-ingest.md`
**Pages created**: 15 pages across agent-architecture, knowledge-systems, content-strategy, ai-gtm, platforms, models, and tools.
**Key takeaways**: High-quality summaries generated with Gemini for LinkedIn posts and articles covering agent architecture, knowledge retention, content engines, AI optimization, and video production (Higgsfield). All articles successfully pushed to Supabase semantic memory.

## [2026-05-22] ingest | Karpathy CLAUDE.md Rules (GitHub Trending #1)
**Raw file**: `raw/2026-05-22-karpathy-claude-md.md`
**Pages created**: `wiki/concepts/agent-architecture/karpathy-claude-md-rules.md`
**Key takeaways**: Karpathy's 4 core rules improve agent coding accuracy from 65% to 94%. Strict boundaries on scope, changes, and destruction prevent unauthorized code changes. Local brain setup maps well to these (SOUL.md vibe, CLAUDE.md surgically locked scope, LEARNINGS.md errors, and Supabase memory), but CLAUDE.md can be updated with more explicit safety controls and post-task manifests.

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

## [2026-08-22] ingest | LinkedIn: "Build the compiler, not the library" (Karpathy LLM Wiki popularization)
Re-packaging of the existing Karpathy pattern. Net-new: honest limitations (bad-source amplification, ~50-100 source density threshold, slow first weeks) + change-brief as a required ingest output + source-quality gating at ingest. Folded into [[karpathy-llm-wiki-pattern]] concept page and the CLAUDE.md ingest workflow. No raw file created — content is derivative of the primary Karpathy source already in raw/.
