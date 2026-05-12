# KV Cache & Machine Memory Architecture
**Source**: [[2026-05-06-linkedin-articles-inspiration]] ("The Architecture of Machine Memory - Inside the KV Cache")
**Last updated**: 2026-05-06

## Core insight

Most AI agent memory failures happen at the **token level** — before any RAG pipeline can intervene. If a critical token is evicted from the KV cache, no external retrieval system can recover it.

## How the KV cache works

When a transformer processes text, it computes Key (K) and Value (V) vectors for every token and caches them to avoid recomputation. The cache grows linearly with context length — at 128k tokens on a large model, it can consume gigabytes per layer and head.

## The naive eviction flaw

**StreamingLLM** kept a sliding window of recent tokens + a few initial "attention sinks." This prevents OOM crashes but causes:
- **Lost in the middle**: Info buried mid-context gets evicted; model forgets it
- **Tool output dilution**: Large tool responses push earlier instructions out
- **System prompt amnesia**: Model invents replacement constraints when system prompt is evicted
- **False memory propagation**: Hallucinated token survives eviction (model attends to it), permanently poisoning generation

The flaw: *recency ≠ importance*.

## Intelligent compression: SnapKV

Researchers found each attention head **consistently attends to the same tokens** throughout generation — the model internally knows what matters.

**SnapKV algorithm**:
1. Look at an "observation window" at the end of the prompt
2. Identify which earlier tokens received high cumulative attention ("heavy hitters")
3. Keep those tokens + neighboring words via max-pool clustering

**Results**: 92% compression ratio, 8.2x memory efficiency, 3.6x faster generation, no accuracy loss on needle-in-a-haystack benchmarks.

## Memory Sparse Attention (MSA)

MSA solves the *attend* side (which tokens to look at during generation) vs. SnapKV's *keep* side.

At 100M token scale, full attention is mathematically infeasible. MSA uses **top-k token selection + sparse attention**, enabling:
- Multi-hop reasoning across non-contiguous memory
- 100M token throughput on 2 GPUs
- Often beats external RAG systems

## The right mental model for agent memory

Memory architecture priority order:
1. **KV cache** — what the model sees right now
2. **Context window management** — what goes in the prompt
3. **External retrieval (RAG)** — last resort for things that couldn't fit

Designing RAG without understanding KV eviction is building on an unstable foundation.

## Future: KV state persistence

Goal: cache that can be **saved and reloaded across sessions** without lossy vector encoding. This would make long-horizon agents viable without external memory systems.

**Cross-references**: [[karpathy-llm-wiki-pattern]], [[intelligent-ai-delegation]]
