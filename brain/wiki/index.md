# Wiki Index
_Updated on every ingest. LLM reads this first when answering queries._

## Platforms
- [higgsfield-ai-production-risks](platforms/higgsfield-ai-production-risks.md) — Higgsfield Cinema Studio and AI Production Risks
- [higgsfield-cinema-studio-production](platforms/higgsfield-cinema-studio-production.md) — Higgsfield Cinema Studio and AI Production Workflows
- [claude-managed-agents](platforms/claude-managed-agents.md) — Anthropic's hosted agent fleet; sandboxed execution, state mgmt, $0.08/hr; public beta Apr 2026
- [claude-m365-connector](platforms/claude-m365-connector.md) — Claude reads Outlook/SharePoint/Teams, free tier, undercuts Copilot at $30/user/mo
- [claude-mythos](platforms/claude-mythos.md) — Anthropic's unreleased frontier model; found 27yr OpenBSD vuln, broke sandbox; restricted to Project Glasswing

## Models
- [vertical-language-model-efficiency](models/vertical-language-model-efficiency.md) — Building Competitive Vertical Language Models Efficiently
- [gemma-4](models/gemma-4.md) — Google's 26B MoE (3.8B active), first truly open commercial license, #3 globally on Arena AI

## Tools & Libraries
- [claude-code-optimization-settings](tools/claude-code-optimization-settings.md) — Optimizing Claude Code for Developer Productivity
- [autoagent](tools/autoagent.md) — open-source meta-agent that self-optimizes your agent overnight; #1 SpreadsheetBench (96.5%)

## Concepts & Patterns

### 🤖 Agent Architecture
- [compound-orchestrator](concepts/agent-architecture/compound-orchestrator.md) — project harness that makes agent tasks compound: planning contracts, two-round review, README gate, parallel draft/serial accept (Ken Huang)
- [agentic-reasoning-survey](concepts/agent-architecture/agentic-reasoning-survey.md) — 3-layer framework: Foundational→Self-Evolving→Collective; thought+action for long-horizon tasks (Wei et al.)
- [runbooks-and-production-agent-ops](concepts/agent-architecture/runbooks-and-production-agent-ops.md) — Reliable agents need runbooks/permissions/logs/rollback, not better prompts (@ghumare64)
- [karpathy-claude-md-rules](concepts/agent-architecture/karpathy-claude-md-rules.md) — ruleset for agent alignment, scope boundaries, stack locking, and safety checklists (Karpathy / Trending #1)
- [kv-cache-machine-memory](concepts/agent-architecture/kv-cache-machine-memory.md) — SnapKV (92% compression), MSA (100M tokens/2 GPUs), recency≠importance eviction flaw
- [meta-meta-prompting](concepts/agent-architecture/meta-meta-prompting.md) — Orchestration layer (GBrain) handles planning/verification/rollback; compounding > single-prompt (Garry Tan)
- [intelligent-ai-delegation](concepts/agent-architecture/intelligent-ai-delegation.md) — Google DeepMind: contract-first decomposition, adaptive coordination, zk-SNARK monitoring
- [vertical-llm-fine-tuning](concepts/agent-architecture/vertical-llm-fine-tuning.md) — 7B-15B niche models beat frontier models; $300/15 days with Codex orchestrator + DeepSeek data
- [strategic-autonomous-ai-implementation](concepts/agent-architecture/strategic-autonomous-ai-implementation.md) — Strategic Implementation of Autonomous AI Agents
- [optimizing-ai-agentic-workflows](concepts/agent-architecture/optimizing-ai-agentic-workflows.md) — Optimizing AI Agentic Workflows for Enterprise
- [strategic-ai-agent-frameworks](concepts/agent-architecture/strategic-ai-agent-frameworks.md) — Strategic Frameworks for AI Agent Implementation
- [optimizing-agentic-workflows](concepts/agent-architecture/optimizing-agentic-workflows.md) — Optimizing AI Agentic Workflows and Infrastructure

### 📈 AI GTM & Strategy
- [ai-organizational-readiness](concepts/ai-gtm/ai-organizational-readiness.md) — AI fails when companies can't describe themselves; clarity first, AI second (Miessler)
- [ai-organizational-autonomy-levels](concepts/ai-gtm/ai-organizational-autonomy-levels.md) — 6-level maturity model: Theater → Personal → Team → Infrastructure → OS → Self-Driving
- [ai-moat-institution-not-features](concepts/ai-gtm/ai-moat-institution-not-features.md) — AI commoditizes features; real moat is how company organizes judgment and compounds knowledge
- [institutional-knowledge-tax](concepts/ai-gtm/institutional-knowledge-tax.md) — 20% of team time lost rediscovering decisions; fix with decision log + shared context layer
- [navigating-ai-uncertainty](concepts/ai-gtm/navigating-ai-uncertainty.md) — Navigating AI Uncertainty Across Every Layer

### ✍️ Content Strategy
- [geo-ai-overview-manipulation](concepts/content-strategy/geo-ai-overview-manipulation.md) — $5 press releases control Google AI Overview narrative for low-competition brand queries
- [content-at-scale-pipeline](concepts/content-strategy/content-at-scale-pipeline.md) — 27-skill Claude Code pipeline; voice profile from spoken transcript anchors authentic content
- [content-engine-context-packets](concepts/content-strategy/content-engine-context-packets.md) — 400-900 token post-specific context packets beat giant windows; add viral postmortem verifier
- [google-generative-ai-optimization](concepts/content-strategy/google-generative-ai-optimization.md) — Optimizing Website Content for Google Generative AI
- [leveraging-ai-articles-strategic-distribution](concepts/content-strategy/leveraging-ai-articles-strategic-distribution.md) — Leveraging AI Articles for Strategic Knowledge Distribution
- [optimizing-content-engines-context-packets](concepts/content-strategy/optimizing-content-engines-context-packets.md) — Optimizing Content Engines with Context Packets

### 🧠 Knowledge Systems
- [karpathy-llm-wiki-pattern](concepts/knowledge-systems/karpathy-llm-wiki-pattern.md) — #1 source of truth for building LLM knowledge systems; raw→wiki→schema architecture
- [scaling-institutional-knowledge-systems](concepts/knowledge-systems/scaling-institutional-knowledge-systems.md) — Leveraging AI for Scalable Institutional Knowledge Systems
- [reducing-institutional-knowledge-tax](concepts/knowledge-systems/reducing-institutional-knowledge-tax.md) — Reducing Institutional Knowledge Tax Through Documentation
- [institutional-knowledge-retention](concepts/knowledge-systems/institutional-knowledge-retention.md) — The Strategic Importance of Institutional Knowledge Retention
