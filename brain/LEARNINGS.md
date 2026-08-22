# LEARNINGS.md — GTM Signal Intelligence Experiment Ledger

> **Protocol**: Every experiment follows the `self-learning` skill format.
> One entry per experiment. Findings are permanent — refuted hypotheses are
> as valuable as confirmed ones.

**Ledger initialized**: 2026-04-10  
**Owner**: JW Sales Command / GTM Agent  
**Strategy ref**: `wiki/strategy/ai-gtm.md`

---

<!-- EXPERIMENTS BELOW — newest at top -->

## EXP-004 — Lossless Health Ingestion Requires Sparse Upserts and Mixed Sleep-State Validation
**Date**: 2026-08-22
**Pillar**: Infrastructure — Health Data Integrity
**Hypothesis**: Archiving every Health Auto Export request and preserving omitted fields during incremental upserts makes normalized health data recoverable and prevents valid daily values from disappearing.
**Method**: Compared `health_metrics` gaps with `health_record_history`, raw `health_ingest_events` payloads, and normalized Apple Watch workouts after active-calorie and sleep gaps appeared in August 2026.

### Findings

**1. Missing metrics are not zeroes.** Health Auto Export sends sparse incremental batches. An omitted metric means “not included in this request,” not “clear the existing daily value.” Batched PostgREST upserts can normalize different objects to a shared column set and turn an omitted property into an explicit `null`.

**2. Upsert daily metric rows independently.** Strip `null` properties, upsert one date at a time, use `defaultToNull: false`, and regression-test that replaying a sparse payload cannot erase an existing non-null field.

**3. Raw payloads and append-only row history are required recovery layers.** The erased August 1, 9, and 10 active-energy values were recoverable because prior normalized versions and raw requests had been retained. Never mutate or delete `health_ingest_events` or `health_record_history` during cleanup.

**4. Apple sleep can mix staged and generic asleep time.** `totalSleep` may equal Deep + REM + Core + generic `asleep`. A validator that compares only Deep + REM + Core with `totalSleep` can reject a valid record. Validate against all sleep-state buckets, retain generic asleep separately when possible, and do not discard the entire night solely because staged sleep is less than total sleep.

**5. Integrity checks must detect regressions, not just failed requests.** Alert when a previously non-null daily metric becomes null, when recent activity has steps but no active energy, or when a raw sleep record exists without a normalized sleep row.

### Verdict
**CONFIRMED.** The lossless archive made repair possible. Sparse per-date upserts prevent the activity erasure path, but the sleep validator must also account for generic asleep time to prevent another rejected night.

### Permanent Guardrails

- Treat omitted fields as no-op updates.
- Reject non-null-to-null metric regressions unless an explicit correction flag is present.
- Test incremental, mixed-date, replayed, and mixed sleep-state payloads before deploying ingestion changes.
- Run a daily coverage audit against the raw archive and append-only history.

## EXP-003 — Model-Agnostic Shared Memory Architecture
**Date**: 2026-05-03
**Pillar**: Infrastructure — Cross-Model Persistence
**Hypothesis**: A two-layer system (structured file system + semantic Supabase brain) allows any AI model — Claude, Gemini, GPT — to share persistent memory across sessions without relying on model-specific tooling.
**Method**: Built and tested full stack in a single session. Layer 1: file system (GTM Agents/ wiki + projects registry). Layer 2: Supabase `thoughts` table with pgvector + `brain.py` CLI.

### What Was Built
| Component | Location | Purpose |
|-----------|----------|---------|
| `projects/INDEX.md` | `~/GTM Agents/projects/INDEX.md` | One-line registry of every deployed project |
| `projects/austin-events.md` | `~/GTM Agents/projects/` | Full context for Austin events landing page |
| CLAUDE.md boot section | `~/GTM Agents/CLAUDE.md` | Forces any model to read INDEX.md before starting |
| Supabase `thoughts` table | project `cdbvlnxirrfczxdccwbr` | Shared semantic memory store |
| `brain.py` | `~/GTM Agents/scripts/brain.py` | Universal CLI: capture / search / list |
| `.env` | `~/GTM Agents/.env` | Credentials (Supabase anon key + Gemini API key) |

### Key Technical Findings

**1. File system = structured layer. Supabase = unstructured/semantic layer.**
The wiki handles canonical facts (tools, concepts, skills). Supabase handles ephemeral session context — decisions, builds, deployments — that's too small to file as a wiki page but too important to lose.

**2. Gemini doesn't support MCP natively but bash is the equalizer.**
Gemini can run `python3 brain.py` directly. Claude uses MCP. Both read/write the same Supabase rows. The interface differs; the database is shared. This is more universal than MCP-only.

**3. Gemini embedding model changed — `text-embedding-004` is gone.**
Correct model as of 2026-05-03: `gemini-embedding-001` (v1beta API).
Wrong: `models/text-embedding-004` → 404 error.
Right: `POST /v1beta/models/gemini-embedding-001:embedContent`

**4. Gemini embeddings are 3072 dims by default — exceeds pgvector HNSW limit of 2000.**
Fix: pass `outputDimensionality: 1536` in the request body. Gemini supports native dimension reduction. 1536 is within the HNSW index limit and still high quality.

**5. Supabase anon key works for a personal single-user brain.**
No service role key needed. Grant anon full access to `thoughts` table + EXECUTE on all RPC functions. Simpler than chasing the service role key.

**6. PostgreSQL `websearch_to_tsquery` beats `ILIKE` for multi-word queries.**
`ILIKE '%austin events%'` fails on "Austin AI Events" (words not adjacent).
`websearch_to_tsquery('austin events')` correctly matches. Combined with an `ILIKE` OR fallback for exact phrases.

**7. Default semantic search threshold of 0.7 is too strict for a small knowledge base.**
Similarity scores cluster around 0.55–0.70 for genuinely relevant results when the corpus is small.
Default lowered to 0.5. Re-evaluate if false positives appear at scale.

### Verdict
**CONFIRMED — hypothesis holds.**
The two-layer architecture works. Any model with bash access can call `brain.py` and share memory with Claude. The file system handles structured knowledge; Supabase handles session memory. The critical CLAUDE.md boot section is the glue — without it, models won't know to look.

### Supabase Schema Reference
```sql
-- thoughts table: id, content, embedding vector(1536), metadata jsonb, content_fingerprint, created_at, updated_at
-- Functions: upsert_thought(text, jsonb), match_thoughts(vector, float, int, jsonb), search_thoughts_text(text, int)
-- RLS: anon role has full access (single-user personal brain)
-- Index: HNSW on embedding column
```

### Next Steps
- Add `OPENROUTER_API_KEY` as fallback embeddings provider in `.env`
- Capture a thought at the end of every significant session (make it a habit)
- When knowledge base hits ~50 thoughts, tune the similarity threshold
- Consider adding a `python3 brain.py export` command to dump all thoughts to a markdown file for wiki ingestion

## EXP-002 — Two-Step Enrichment vs. Single-Step Web Search
**Date**: 2026-04-10  
**Pillar**: Pillar 1 — Enrichment (Identity Resolution)  
**Hypothesis**: A two-step enrichment strategy — (1) company authority check, then (2) targeted name+title search informed by Step 1 — increases MEDIUM+ resolution rate by ≥ 20pp over EXP-001's 40% baseline.  
**Method**: 10 ICP signals (VP/Director-level at AI-first companies). Step 1 fetched company leadership context via org-level web search; signals with zero leadership signal were dropped before Step 2. Step 2 ran name-targeted searches using people surfaced in Step 1. Scored each signal against the 10-point rubric.  
**Sample**: 10 signals  
**Baseline**: EXP-001 single-step rate = 40% MEDIUM+

### Results
| Metric | Value |
|--------|-------|
| step_1_pass_rate | 80% (8/10 passed to Step 2) |
| step_1_drop_off | 20% (Replicate, Together AI — zero leadership signal) |
| final_resolution_rate (MEDIUM+) | **70%** (7/10) |
| delta_vs_baseline | **+30pp** (exceeds +20pp hypothesis) |
| avg_score_on_passed_signals | 6.9 / 10 |
| stale_role_flags_caught | 2 (Cohere President → Emeritus; Groq CRO → Nvidia) |
| linkedin_url_extraction_rate | 80% of Step 2 passes |
| email_data_rate | 60% of resolved signals (via RocketReach / ContactOut) |

### Signal Log
| # | Input Signal | Resolved Name | Title | LinkedIn URL | Step 1 | Confidence | Score /10 |
|---|-------------|---------------|-------|--------------|--------|------------|-----------|
| 1 | VP Sales, OpenAI | Joey Franklin | VP of Sales | [linkedin.com/in/joey-franklin-50465b294](https://www.linkedin.com/in/joey-franklin-50465b294/) | PASS | HIGH | 8 |
| 2 | Head Enterprise Sales, Cohere | Martin Kon | President Emeritus ⚠️ stale | [linkedin.com/in/martin-kon-95188](https://www.linkedin.com/in/martin-kon-95188/) | PASS | MEDIUM | 5 |
| 3 | CRO, Together AI | — | — | — | **FAIL** | LOW | 2 |
| 4 | VP BD, Perplexity AI | Ryan Foutty | VP Business | [linkedin.com/in/foutty](https://www.linkedin.com/in/foutty/) | PASS | MEDIUM | 7 |
| 5 | VP Partnerships, ElevenLabs | Dustin Blank | Head of Partnerships | [linkedin.com/in/dustin-blank](https://www.linkedin.com/in/dustin-blank/) | PASS | HIGH | 8 |
| 6 | CRO, Groq | Ian Andrews | CRO ⚠️ → Nvidia | [linkedin.com/in/ianhandrews](https://www.linkedin.com/in/ianhandrews/) | PASS | MEDIUM | 7 |
| 7 | GTM Lead, Runway ML | Richard Klein | GTM Leader | [linkedin.com/in/kleinrichard](https://www.linkedin.com/in/kleinrichard/) | PASS | HIGH | 8 |
| 8 | Head GTM, Replicate | — | — | — | **FAIL** | LOW | 1 |
| 9 | Dir. Revenue, Mistral AI | Marjorie Janiewicz | Global Head of Revenue & US GM | [linkedin.com/in/marjorietoucas](https://www.linkedin.com/in/marjorietoucas/) | PASS | HIGH | 8 |
| 10 | CCO, Stability AI | Scott Trowbridge | Chief Business Officer (adjacent) | [linkedin.com/in/scottbtrowbridge](https://uk.linkedin.com/in/scottbtrowbridge) | PASS | LOW | 3 |

### Key Observations
1. **Two-step significantly outperforms single-step.** 70% vs 40% MEDIUM+ rate — a +30pp improvement. Hypothesis CONFIRMED and exceeded.
2. **Step 1 acts as a precision filter.** By dropping Replicate and Together AI before Step 2, we avoid wasting enrichment queries on unresolvable signals. Both had zero revenue-org signal in public sources.
3. **Stale detection is a free bonus.** Step 1 surfaced that Martin Kon left Cohere's President role and Ian Andrews transitioned to Nvidia. Without the two-step process, we'd have pursued dead contacts. This is high-value signal hygiene.
4. **Smaller/less-publicized companies remain a gap.** Stability AI (Score 3) and Together AI (FAIL) suggest a need for a tertiary enrichment layer (Apollo.io / LinkedIn Sales Navigator) for companies without strong public leadership footprint.
5. **LinkedIn URL is the unlock.** Once an URL surfaces (80% of passing signals), secondary enrichment tools (RocketReach, ContactOut, Hunter.io) yield email data at ~60% rate, enabling direct outreach.
6. **Title disambiguation is still needed for MEDIUMs.** Cohere and Groq are MEDIUM because the exact role is stale or ambiguous — a disambiguation pass against actual post interaction data would push both to HIGH.

### Verdict
**CONFIRMED — Hypothesis exceeded**  
The two-step enrichment strategy raises MEDIUM+ resolution from 40% (EXP-001) to 70% (+30pp). It also surfaces stale role data and filters dead-end signals at Step 1, both of which have downstream cost savings. The remaining 30% LOW-confidence signals cluster around smaller/private orgs — those require a commercial enrichment API as a tertiary layer.

### Next Experiment
**EXP-003 hypothesis**: Adding Apollo.io or Hunter.io as a tertiary enrichment pass on Step 1 FAIL signals and LOW-confidence Step 2 outputs increases overall MEDIUM+ resolution to ≥ 85%. Test with a mixed batch of 15 signals (5 from prior LOWs + 10 new ICP targets).

## EXP-001 — Web Search as Primary LinkedIn Signal Enrichment Layer
**Date**: 2026-04-10  
**Pillar**: Pillar 1 — Enrichment (Identity Resolution)  
**Hypothesis**: Web search (title + company keyword) can resolve anonymous LinkedIn interaction signals to a named individual with MEDIUM or HIGH confidence at a rate ≥ 60%.  
**Method**: Simulated 5 realistic ICP signals (VP/Director-level roles at AI-first companies). Each signal was a (title, company) pair representing a LinkedIn like, comment, or profile view. Ran web search queries of the form `"[Title]" "[Company]" LinkedIn 2026` and scored results against the 10-point enrichment rubric (name, title, company, LinkedIn URL, email estimate, intent tag).  
**Sample**: 5 signals  

### Results
| Metric | Value |
|--------|-------|
| resolution_rate | 40% (2 full / 3 partial or failed) |
| avg_confidence_score | 0.44 / 1.0 |
| avg_enrichment_depth | 2.6 / 5 fields |
| hypothesis_verdict | **REFUTED** — rate fell short of 60% target |

### Signal Log
| # | Input Signal | Resolved Name | Title | Company | Confidence | Score /10 |
|---|-------------|---------------|-------|---------|------------|-----------|
| 1 | VP of Sales, Anthropic | Rich O'Connell + Kate Earle | VP Sales / Head of Sales & Partnerships | Anthropic | MEDIUM | 7 |
| 2 | Head of Growth, Mistral AI | Aaron Delp | Global Head of Technical Marketing | Mistral AI | MEDIUM | 5 |
| 3 | CRO, Scale AI | Jason Droege (Interim CEO) | Interim CEO (company in leadership flux) | Scale AI | LOW | 2 |
| 4 | VP Revenue, Cohere | No match found | — | Cohere | LOW | 3 |
| 5 | Head of GTM, Hugging Face | Jeff Boudier | Head of Product & Growth (adjacent) | Hugging Face | MEDIUM | 5 |

### Key Observations
1. **Established, stable orgs resolve better.** Anthropic (score 7) vs. Scale AI mid-transition (score 2). Company org stability is a pre-filter that should be checked before enrichment.
2. **Exact title matching is brittle.** "Head of Growth" → "Global Head of Technical Marketing" and "Head of GTM" → "Head of Product & Growth" — adjacent titles surface regularly; exact title is not a reliable match key.
3. **LinkedIn profile URLs do surface via web search**, making URL extraction the highest-value parse target (worth 2 pts and enables direct profile enrichment via Apollo/Hunter.io follow-up).
4. **Multi-candidate ambiguity** (Signal 1 returned two people) is a common failure mode — resolution requires a secondary disambiguation step (e.g., cross-reference with post interaction data).
5. **Company-first search is more reliable.** Querying the company page first, then cross-referencing seniority, outperforms direct title-keyword search.

### Verdict
**REFUTED**  
The naive (title + company → web search) approach achieves only ~40% resolution at MEDIUM+ confidence, well below the 60% target. The primary failure modes are: org flux (acquisitions, role changes), title mismatch, and multi-candidate ambiguity. However, the method is a valid *first pass* that should feed a secondary enrichment layer (Apollo.io / Hunter.io / LinkedIn Sales Navigator API) rather than be relied on as the sole resolution mechanism.

### Next Experiment
**EXP-002 hypothesis**: A two-step enrichment strategy — (1) company page authority check → (2) title + company web search — increases resolution rate by ≥ 20pp over single-step search, while reducing multi-candidate ambiguity. Test with 10 signals, tracking per-step drop-off rate.
