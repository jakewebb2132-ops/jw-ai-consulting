# The 20% Institutional Knowledge Tax
**Source**: [[2026-05-11-linkedin-articles-inspiration]] (Aakash Gupta @aakashgupta)
**Last updated**: 2026-05-11

## Core insight

Every fifth hour on a product team is wasted **rediscovering old decisions**. At a 50-person org, this burns one full engineer-year every two months.

## The math

- 20% of team time = rediscovery overhead
- 50-person org × 20% = 10 people's time wasted per period
- Over 2 months ≈ 1 full engineer-year burned on decisions already made

## The 3-layer solution architecture

1. **Decision log** — searchable record of why decisions were made (not just what was decided)
2. **Shared context layer** — accessible to all agents and team members without tribal knowledge
3. **Reasoning retrieval** — ability to search *reasoning*, not just outcomes

## Why this is a Jake-specific insight

Jake's `~/brain/` system is exactly this 3-layer architecture. Every time an AI session captures decisions to Supabase + appends to `log/daily/`, it's paying down the knowledge tax.

The pitch to clients: your AI implementation will fail not because of model capability, but because your institutional knowledge is locked in Slack threads and individual heads. Jake's system externalizes that knowledge into a queryable, agent-accessible layer.

## Relevance to content

Strong LinkedIn post angle: "Your AI can't read your Slack history. Here's what I built instead."

**Cross-references**: [[ai-organizational-readiness]], [[karpathy-llm-wiki-pattern]]
