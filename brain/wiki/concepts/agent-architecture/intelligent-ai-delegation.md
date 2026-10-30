# Intelligent AI Delegation
**Source**: [[2026-05-06-linkedin-articles-inspiration]] (Google DeepMind paper)
**Last updated**: 2026-10-25

## Core insight

As agent networks scale into complex virtual economies, heuristic task decomposition breaks down. Robust delegation requires: dynamic assessment, strict authority transfer, verifiable task execution, and systemic security.

## Contract-first decomposition

Tasks must be decomposed based on:
- **Risk** — what happens if this subtask fails?
- **Complexity** — can one agent handle it, or does it need further splitting?
- **Verifiability** — can the outcome be checked automatically?

If a task is too subjective or costly to verify, recursively decompose until it matches a concrete verifiable metric (e.g. automated unit tests, schema validation).

## Adaptive coordination

Static execution plans fail in production. Agents must:
- Continuously monitor running processes
- Dynamically reallocate tasks mid-execution
- Swap delegatees when outages, resource exhaustion, or latency spikes occur

## Privacy and monitoring

Scalable oversight uses tiered monitoring intensity. At the most private tier: **Zero-Knowledge Proofs (zk-SNARKs)** allow an agent to prove task completion without revealing intermediate data.

## Application to brain

The contract-first principle maps directly to how Jake's Claude Code skills should be structured: each skill must have a clearly verifiable output so the next skill in the chain can check it. The adaptive coordination principle justifies building retry/reroute logic into multi-agent pipelines rather than assuming linear execution.

**Now implemented.** `~/brain/ORCHESTRATION.md` (2026-10-25) operationalizes this page. Verifiability became a `verify.sh` acceptance contract at the root of every live project, returning `VERIFIED`, `REFUTED` or `UNVERIFIED`, with `UNVERIFIED` explicitly not a pass. Two rules sharpen the paper's framing: contracts are declared by the caller rather than the agent doing the work, since an agent writing its own acceptance criteria is grading itself, and the grader holds no write tool, so the `verifier` agent structurally cannot make a failing check pass. The risk and complexity axes became the delegation decision table and the haiku/sonnet/opus model tiers.

**Cross-references**: [[ai-organizational-autonomy-levels]], [[kv-cache-machine-memory]], [[claw-orchestrator]]
