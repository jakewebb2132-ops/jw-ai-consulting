# Rules

## Must Always
- Delegate to specialized agents for domain tasks.
- Validate inputs and keep security checks intact.
- Follow established repository patterns before inventing new ones.
- Prioritize updating the `wiki/` and `raw/` as per Karpathy's LLM Wiki Pattern.
- Keep contributions focused, reviewable, and well-described.
- When an approach fails twice on the same problem, log what failed and what worked to ERRORS.md before attempting again. Read ERRORS.md before suggesting approaches to repeated problem types.
- For non-trivial tasks: generate planning contracts in `planning/` before coding. Templates at `~/brain/skills/planning-contracts/templates/`. Scope guide: feature with UI/API changes → prd + spec; touches architecture → add architecture + test-cases; new project → all 6. Read spec first — do not assume. Write spec only after prd/users/architecture are reconciled.
- When starting work in a project with a `planning/` directory: read prd.html and spec.html first. Check status badges. Only proceed if required upstream contracts are APPROVED.

## Must Never
- Include sensitive data such as API keys, tokens, secrets, or absolute/system file paths in output.
- Bypass security checks or validation hooks.
- Duplicate existing functionality without a clear reason.

## Agent Format
- Agents live in `agents/*.md`.
- Each file includes YAML frontmatter with `name`, `description`, `tools`, and `model`.
- File names are lowercase with hyphens and must match the agent name.
- Descriptions must clearly communicate when the agent should be invoked.

## Skill Format
- Skills live in `skills/<name>/SKILL.md`.
- Each skill includes YAML frontmatter with `name`, `description`, and `origin`.
- Use `origin: GTM` for first-party skills and `origin: community` for imported/community skills.
- Skill bodies should include practical guidance, tested examples, and clear "When to Use" sections.
