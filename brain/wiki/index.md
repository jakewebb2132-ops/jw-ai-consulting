# Wiki Index
_Updated on every ingest. LLM reads this first when answering queries._

## Platforms
- [claude-managed-agents](platforms/claude-managed-agents.md) — Anthropic's hosted agent fleet; sandboxed execution, state mgmt, $0.08/hr; public beta Apr 2026
- [claude-m365-connector](platforms/claude-m365-connector.md) — Claude reads Outlook/SharePoint/Teams, free tier, undercuts Copilot at $30/user/mo
- [claude-mythos](platforms/claude-mythos.md) — Anthropic's unreleased frontier model; found 27yr OpenBSD vuln, broke sandbox; restricted to Project Glasswing

## Models
- [gemma-4](models/gemma-4.md) — Google's 26B MoE (3.8B active), first truly open commercial license, #3 globally on Arena AI

## Tools & Libraries
- [autoagent](tools/autoagent.md) — open-source meta-agent that self-optimizes your agent overnight; #1 SpreadsheetBench (96.5%)

## Concepts & Patterns

### 🤖 Agent Architecture
- [agentic-reasoning-survey](concepts/agent-architecture/agentic-reasoning-survey.md) — 3-layer framework: Foundational→Self-Evolving→Collective; thought+action for long-horizon tasks (Wei et al.)
- [runbooks-and-production-agent-ops](concepts/agent-architecture/runbooks-and-production-agent-ops.md) — Reliable agents need runbooks/permissions/logs/rollback, not better prompts (@ghumare64)
- [kv-cache-machine-memory](concepts/agent-architecture/kv-cache-machine-memory.md) — SnapKV (92% compression), MSA (100M tokens/2 GPUs), recency≠importance eviction flaw
- [meta-meta-prompting](concepts/agent-architecture/meta-meta-prompting.md) — Orchestration layer (GBrain) handles planning/verification/rollback; compounding > single-prompt (Garry Tan)
- [intelligent-ai-delegation](concepts/agent-architecture/intelligent-ai-delegation.md) — Google DeepMind: contract-first decomposition, adaptive coordination, zk-SNARK monitoring
- [vertical-llm-fine-tuning](concepts/agent-architecture/vertical-llm-fine-tuning.md) — 7B-15B niche models beat frontier models; $300/15 days with Codex orchestrator + DeepSeek data

### 📈 AI GTM & Strategy
- [ai-organizational-readiness](concepts/ai-gtm/ai-organizational-readiness.md) — AI fails when companies can't describe themselves; clarity first, AI second (Miessler)
- [ai-organizational-autonomy-levels](concepts/ai-gtm/ai-organizational-autonomy-levels.md) — 6-level maturity model: Theater → Personal → Team → Infrastructure → OS → Self-Driving
- [ai-moat-institution-not-features](concepts/ai-gtm/ai-moat-institution-not-features.md) — AI commoditizes features; real moat is how company organizes judgment and compounds knowledge
- [institutional-knowledge-tax](concepts/ai-gtm/institutional-knowledge-tax.md) — 20% of team time lost rediscovering decisions; fix with decision log + shared context layer

### ✍️ Content Strategy
- [geo-ai-overview-manipulation](concepts/content-strategy/geo-ai-overview-manipulation.md) — $5 press releases control Google AI Overview narrative for low-competition brand queries
- [content-at-scale-pipeline](concepts/content-strategy/content-at-scale-pipeline.md) — 27-skill Claude Code pipeline; voice profile from spoken transcript anchors authentic content
- [content-engine-context-packets](concepts/content-strategy/content-engine-context-packets.md) — 400-900 token post-specific context packets beat giant windows; add viral postmortem verifier

### 🧠 Knowledge Systems
- [karpathy-llm-wiki-pattern](concepts/knowledge-systems/karpathy-llm-wiki-pattern.md) — #1 source of truth for building LLM knowledge systems; raw→wiki→schema architecture
