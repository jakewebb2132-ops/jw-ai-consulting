# Content Engine v2: Small Context Packets > Giant Windows
**Source**: [[2026-05-11-linkedin-articles-inspiration]] (Ronin @DeRonin_)
**Last updated**: 2026-05-11

## Core insight

Switching from giant context windows to **small, post-specific "context packets"** (400–900 tokens) makes AI-drafted content sharper on the first attempt.

## The old approach (broken)

Dump everything into context → giant prompt → generic, unfocused draft → heavy editing required.

## The new approach

For each post, assemble a tight context packet containing only:
- The specific topic/angle
- 2–3 reference examples (same format/tone)
- Your voice fingerprint (compressed)
- The goal (engagement, education, conversion)

Result: **400–900 tokens** of highly relevant signal, no noise.

## The viral postmortem prompt

Add a final verification step: before queuing, run a "viral postmortem prompt" that asks:
- Why would someone share this?
- What friction exists in the CTA?
- Does the hook deliver on its promise?

This acts as a cheap editor that catches weak posts before they go out.

## Connection to Jake's content pipeline

- The existing LinkedIn content pipeline should adopt the context packet model
- Each wiki concept page in `~/brain/wiki/concepts/` is essentially a pre-built context packet
- The viral postmortem prompt should be added as the final step in `~/brain/skills/linkedin-content/`

**Cross-references**: [[content-at-scale-pipeline]], [[ai-organizational-readiness]]
