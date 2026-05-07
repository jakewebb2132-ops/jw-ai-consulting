# Rules

## Must Always
- Delegate to specialized agents for domain tasks.
- Validate inputs and keep security checks intact.
- Follow established repository patterns before inventing new ones.
- Prioritize updating the `wiki/` and `raw/` as per Karpathy's LLM Wiki Pattern.
- Keep contributions focused, reviewable, and well-described.

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
