# Log
_Append-only. Newest at top. Parse with: `grep "^## \[" log.md`_

## [2026-10-28] ingest | Notion LinkedIn Ingest — X/Twitter cluster (quality-gated, no new pages)
**Raw file**: `raw/2026-10-28-105701-linkedin-ingest.md`
**Pages touched**: none newly created this run — `concepts/knowledge-systems/invalid-url-or-empty-content.md`, `concepts/ai-gtm/ai-strategy-gtm-insights-overview.md`, `tools/analyzing-trending-ai-repositories-and-tools.md` were already written and indexed by the automated "cloud ingest" process before this run, with no log entry — same gap pattern as the 2026-10-11 entry below.
**Verified**: page content matches the raw source word-for-word; `wiki/index.md` entries for all three are accurate and already present — no index changes needed.
**Gated**: all three source items are low-signal. Entry 1 (@fleyta88) is a literal extraction failure ("Invalid URL Or Empty Content Provided") filed as if it were a knowledge page. Entries 2 (@elayadesigns) and 3 (@trending_repos) read as generic AI-strategy/repo-trend filler with zero concrete specifics (no named tools, frameworks, or numbers) — looks like the same silent extraction failure as entry 1, except the summarizer produced plausible-sounding boilerplate instead of flagging it. Did not expand or add cross-references to these pages — doing so would just deepen an existing stub cluster (`handling-unavailable-external-content`, `unavailable-twitter-post-knowledge-capture`, `analyzing-x-post-content-url` are the same failure mode, filed separately).
**Lint**: left the `ai-strategy-gtm-insights-overview.md` cross-reference to a bare "ai-gtm" as-is (no such page exists, only the `concepts/ai-gtm/` directory) rather than fixing it, since the page itself is a gating candidate — flagged in the compile brief instead.

## [2026-10-26] lint | Planview SPM × POM research — evidence and positioning completion
**Raw file**: `raw/2026-10-25-planview-spm-pom-research.md` (re-read; already compiled 2026-10-25)
**Pages updated**: `wiki/platforms/planview.md`, `wiki/concepts/portfolio-operating-models/strategic-portfolio-management.md`
**Why**: Nightly compile flagged this raw file as new/changed. The 2026-10-25 interactive session had already created all four pages and logged the ingest, but a line-by-line check against the raw source turned up stats and positioning copy that never made it into the pages.
**Key takeaways**: Added the missing Economist Impact stat (84% want better data-driven decisions), three "strategy execution leadership" stats (79% visibility, 1.6× revenue target, 8× AI adoption), the SPM evidence section now names its two source reports instead of one unlabeled block. Added the "9 out of 10 strategies fail in execution" section headline, the full 5-line solution-voice list, and the recurring framing language ("connected work," "closing the visibility gap," cascade line) to `planview.md`'s Positioning section.
**Flagged**: No contradictions. No new pages, no index.md change needed — this was a completeness pass on existing pages, not a new ingest.

## [2026-10-11] ingest | Notion LinkedIn Ingest — Scaling AI GTM Strategy (partial, quality-gated)
**Raw file**: `raw/2026-10-11-111019-linkedin-ingest.md`
**Pages touched**: `concepts/ai-gtm/scaling-ai-gtm-strategy.md` (lint only — cross-references were plain text, converted to `[[wiki-links]]`); `wiki/index.md` (description corrected to match actual page content — a separate automated "cloud ingest" process had already written this page pre-run but with a mismatched index summary and no log entry)
**Key takeaway**: Source contains two near-identical X/Twitter posts on AI GTM positioning (align messaging to business value, avoid jargon, build repeatable motions) from low-authority/unverified accounts (@suraj_sharma14, @N01ennn). Generic, no new signal beyond what's already compiled.
**Gated**: Did NOT create a page for the first entry (@suraj_sharma14, tweet 2108165523699589203) — it duplicates the existing `[[suraj-sharma-ai-post-insights]]` page (same account, same generic insight, different tweet) almost verbatim. Compiling it would be the 9th near-identical stub in the AI GTM section with no new information. Flagged in compile brief for Jake to review the cluster.

## [2026-08-27] ingest | Notion LinkedIn Ingest — Anthropic ELI5 Skill + ThreeUI (backfill)
**Raw file**: `raw/2026-08-22-linkedin-ingest.md`
**Pages created**: `tools/anthropic-internal-eli5-skill.md`, `tools/threeui-open-source-threejs-library.md` (both existed already, dated 2026-08-22, but were never logged — backfilling now, same gap as the 2026-08-19 Boom Automations entry below)
**Key takeaways**: Anthropic's internal `/eli5` skill (community plugin `eli5@claude-community`) generates HTML artifacts to explain complex topics with minimal text — visual, low-verbosity artifact generation as a pattern for exec-ready GTM explainers. Meng To's ThreeUI: 160+ open-source Three.js components/landing pages designed for direct agent consumption (prompt + source paired) — useful for rapid GTM landing page prototyping.
**Lint**: fixed cross-reference syntax on both pages (plain text → `[[wiki-links]]`) and added missing back-references from [[content-engine-context-packets]], [[institutional-knowledge-tax]], and [[meta-meta-prompting]].

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
## [2026-09-22] research | AI-Assisted Legacy SQL to PostgreSQL Migration
**Page created**: `wiki/concepts/ai-gtm/ai-assisted-legacy-sql-to-postgresql-migration.md`
**Key takeaway**: Credible production evidence includes Arborgold's 10+ year SQL Server estate with 2,500 stored procedures migrated to Aurora PostgreSQL in about 220 versus 2,600 estimated hours, an Infosys Swiss bank program spanning 1,000+ databases, a private-Llama SQL Server migration for an Alaska public housing organization, and Datadog's test-driven production storage redesign. The defensible position is AI-assisted discovery and translation backed by deterministic validation, not autonomous migration.

## [2026-10-25] ingest | Planview SPM × POM research and brand extraction
**Raw file**: `raw/2026-10-25-planview-spm-pom-research.md`
**Pages created**: `wiki/platforms/planview.md`, `wiki/concepts/portfolio-operating-models/strategic-portfolio-management.md`, `wiki/concepts/portfolio-operating-models/product-operating-model.md`, `wiki/concepts/portfolio-operating-models/flow-framework.md`
**Pages updated**: `wiki/index.md`, `projects/INDEX.md`, `projects/spm-pom-strategy-to-value.md`
**Why**: Jake started as an AI Solutions Architect for SPM products at Planview. Built the Strategy-to-Value Operating System visual (`visuals/strategy-to-value-operating-system.html`) on this research.
**Key takeaways**: (1) SPM chooses and funds the bets, POM organizes durable ownership to realize them — POM does not replace SPM, and conflating them is the most common customer misread. (2) The evidence base is strong and citable: Economist Impact commissioned by Planview (600 execs, 7 countries) and the Planview Project to Product State of the Industry (8,000 value streams). Elite orgs are 2x more likely to run a POM; only 12% have fully shifted. (3) Brand tokens had to be read off live computed styles — Brandfetch reported the wrong palette, and the site's `--wp--preset--*` properties are WordPress defaults, not brand.
**Flagged**: No contradictions with existing wiki content. Overlaps `projects/fedex-planview-ai-research.md`, which grades vendor-reported Planview customer outcomes (Santander, Co-operators) as A-vendor-reported rather than independent — keep that grading in mind before citing those numbers to a customer.

## [2026-10-25] research | Planview ProjectPlace to Portfolios integration
**Pages updated**: `wiki/platforms/planview.md`, `projects/spm-pom-strategy-to-value.md`
**Why**: roughly half of Jake's clients run ProjectPlace and ask how to integrate it into Portfolios. Built into the Strategy-to-Value visual as a Product fit panel.
**Key takeaway**: cards sync one way, ProjectPlace to Portfolios, as actions. The trap is the global `Use ProjectPlace` switch: cards closed while it is off never backfill, so a quiet outage permanently corrupts actuals unless every affected card is touched again.
**Flagged**: `success.planview.com` is behind CloudFront and returns 403, so field-level mapping and sync frequency are unverified and are marked as such in both the wiki and the visual. Do not upgrade them to assertions without reading the Success Center article. Planview® Viz was removed from the visual at Jake's request; it remains in the wiki product-surface list as a factual catalog entry.

## [2026-10-29] ingest | ProjectPlace ↔ Portfolios connector, Success Center (authenticated)
**Raw file**: `raw/2026-10-29-projectplace-portfolios-connector-success-center.md`
**Pages updated**: `wiki/platforms/planview.md` (integration section rewritten), `wiki/index.md`, `projects/spm-pom-strategy-to-value.md`, `visuals/strategy-to-value-operating-system.html` (`PRODUCTS[0].integration`)
**Why**: four claims in the visual's Product fit panel were inferred, not sourced, because `success.planview.com` 403'd to a headless browser on 2026-10-25. A headed browser with an authenticated session reached it. All four are now answered from the authoritative articles.
**Key takeaways**: (1) The organising fact we were missing entirely — **the plan has exactly one owning system at a time**, ProjectPlace or Portfolios, never both, and it is locked for editing in the other. Our two-arrow model was directionally right but hid the switch that actually governs the behaviour. (2) Card time reaches Portfolios as **Actual Effort on the action item** and explicitly **does not appear in the Portfolios timesheet** — the double-count risk is a reconciliation problem between two stores, not a sync collision, which is a far more useful thing to tell a PMO. (3) Card progress rolls up at two levels at once: one action item per card with status mapped from the board column, plus aggregate `PP Card Percent Complete` and `PP Open/Closed Card Count` on the parent activity.
**Flagged**: this **supersedes** the 2026-10-25 community-sourced integration section, which was not wrong but was thin. One claim from that pass was neither confirmed nor contradicted by these articles and is now explicitly marked as still community-sourced: the global `Use ProjectPlace` switch and the cards-closed-while-off backfill failure. Do not let a future edit promote it to a sourced claim. Also note the lesson for future research: the CloudFront 403 is a headless-detection artifact, not an access control — a headed browser plus login reads it fine.

## [2026-10-29] build | Strategy-to-value model as a dependency graph
**Artifact**: `visuals/strategy-to-value-dag.html`
**Pages updated**: `projects/spm-pom-strategy-to-value.md`, `projects/INDEX.md`
**Why**: the existing visual draws the model as a chain, which implies the work is a relay. Expanding each of the ten stages into the three nodes it owes (decision, artifact, gate) and computing the layout from the edge list produces 30 nodes, 37 edges and 8 layers, and exposes structure the chain hides.
**Key takeaways**: (1) Layer 1 holds two nodes — portfolio choices and value streams are parallel, both depending only on intent. (2) Stage 07 is a join of product strategy and durable teams, not a handoff. (3) Evidence returns on three clocks, not one. (4) Architecturally, going pure-SVG with no HTML overlay makes the aspect-ratio drift bug from the serpentine file structurally impossible to reintroduce.
**Flagged**: the two files are complements, not replacements. The chain walks a room through the story; the graph is for arguing about dependencies. Neither supersedes the other.
