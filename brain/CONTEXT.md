# Brain — Jake Webb's Universal AI Context
_Every AI tool loads this file first. One edit here propagates everywhere._

---

## Who I am

Jake Webb — AI consultant, GTM strategist, builder. Running JW AI Consulting out of Austin TX.
Email: jakewebb2132@gmail.com | GitHub: jakewebb2132-ops

---

## Load these next (in order)

1. **`~/brain/SOUL.md`** — my personality preferences and hard behavioral rules for every AI session
2. **`~/brain/RULES.md`** — always/never rules, agent and skill format conventions
3. **`~/brain/projects/INDEX.md`** — registry of everything built and deployed; read before starting any task
4. **`~/brain/wiki/index.md`** — compiled knowledge base; check before answering questions about tools, models, platforms

---

## Memory architecture

This brain has two layers. Use both.

**Layer 1 — Structured filesystem (this repo)**
Plain markdown. Git-backed. Human-readable. Works in any AI tool.

```
~/brain/
├── CONTEXT.md          ← you are here
├── SOUL.md             ← personality + hard rules
├── RULES.md            ← always/never conventions
├── LEARNINGS.md        ← experiment ledger (append-only)
├── wiki/               ← Karpathy compiled knowledge
│   ├── index.md        ← start here for any knowledge query
│   ├── log.md          ← append-only chronological record
│   ├── concepts/       ← frameworks, patterns, ideas
│   ├── models/         ← AI models and families
│   ├── platforms/      ← products, APIs, hosted services
│   ├── tools/          ← libraries, CLIs, open-source
│   └── people/         ← key individuals
├── projects/
│   ├── INDEX.md        ← one-line registry of every deployed project
│   └── *.md            ← full context per project
├── log/
│   ├── daily/          ← YYYY-MM-DD.md  (what was built, what was learned)
│   ├── weekly/         ← YYYY-WNN.md    (weekly synthesis)
│   └── yearly/         ← YYYY.md        (annual summary)
├── instincts/          ← continuous learning output
│   ├── personal/       ← Jake-specific patterns detected from sessions
│   ├── inherited/      ← cross-project patterns
│   └── evolved/        ← clustered into reusable skills
├── agents/             ← agent definitions (*.md with YAML frontmatter)
├── skills/             ← skill definitions (*/SKILL.md)
├── brand-guidelines/   ← typography, colors, motion, compiled guide
├── raw/                ← immutable source documents (never modify)
└── scripts/
    ├── brain.py        ← Supabase semantic layer CLI
    └── learn.py        ← unified learning CLI
```

**Layer 2 — Semantic/Supabase (session memory)**
For decisions, builds, and context too small for a wiki page but too important to lose.

```bash
# Search what exists across sessions
python3 ~/brain/scripts/brain.py search "topic"

# Capture what you just built or decided
python3 ~/brain/scripts/brain.py capture "built X at Y, deployed to Z" --type project --topic name

# List recent thoughts
python3 ~/brain/scripts/brain.py list --days 7
```

Credentials: `~/brain/.env` (copy from `.env.example`)

---

## Session boot protocol

Every session, every tool:

1. Read this file (done)
2. Read `SOUL.md` — adjust tone and behavior
3. Read `projects/INDEX.md` — know what exists before building
4. For knowledge questions: read `wiki/index.md` → relevant pages
5. At session end: capture significant decisions to Supabase brain + append to `log/daily/YYYY-MM-DD.md`

---

## Continuous learning

Observations are captured automatically via Claude Code hooks (Pre/PostToolUse).
Patterns are detected and stored in `instincts/personal/` and `instincts/inherited/`.

Check learning status:
```bash
python3 ~/brain/scripts/learn.py status
```

Evolve patterns into reusable skills:
```bash
python3 ~/brain/scripts/learn.py evolve
```

---

## Active projects

See `projects/INDEX.md` for the full registry. Key deployments:

| Project | URL | Repo |
|---------|-----|------|
| Austin Events | https://jwaiconsulting.com/austin-events | jakewebb2132-ops/austin-events |
| JW AI Consulting | https://jwaiconsulting.com | jakewebb2132-ops/jw-ai-consulting |
| Sales Dashboard | https://dashboard.jwaiconsulting.com | jakewebb2132-ops/jw-sales-dashboard |

---

## Knowledge system conventions (Karpathy wiki pattern)

- **Ingest**: new source → read fully → create/update wiki pages → update `wiki/index.md` → append to `wiki/log.md`
- **Query**: read `wiki/index.md` → read relevant pages → synthesize with citations
- **Lint**: find contradictions, stale claims, orphan pages, missing cross-references
- Raw files in `raw/` are never modified once written
- Every wiki page starts with `**Source**: [[filename]]` and `**Last updated**: YYYY-MM-DD`
- Cross-references use `[[page-name]]` wiki-link syntax

Source authority: Karpathy > Anthropic docs > primary research > newsletter summaries

---

## Tech stack defaults

| Layer | Choice |
|-------|--------|
| Frontend | Vite + React + Tailwind |
| Deploy | `npx vercel --prod --yes` (use `--force` if UI changes aren't reflecting) |
| DB / memory | Supabase — project `cdbvlnxirrfczxdccwbr` |
| Automation | launchd (macOS), Python scripts |
| Package manager | npm |
| Fonts | Space Grotesk (headings), Inter (body) |

---

## Don't repeat these mistakes

- `dashboard.jwaiconsulting.com` maps to the `jw-sales-command` repo, not `jw-ai-consulting`. Always check `.vercel/project.json` if in doubt.
- launchd `Weekday=0` = Sunday, not Monday.
- When calculating "upcoming week", use `today` as start date. Don't calculate "next Monday" — you'll skip the current week.
- `"ai" in "contain"` is `True` in Python. Use word-boundary regex (`\bai\b`) for short keywords or you'll get false positives inside other words.
- Vercel stale cache: add `--force` flag (`vercel --prod --force`) when UI changes aren't reflecting after deploy.
- Gemini embedding model is `gemini-embedding-001` (v1beta). `text-embedding-004` 404s.
- Gemini embeddings default to 3072 dims — pass `outputDimensionality: 1536` to stay under pgvector HNSW limit.

---

## GitHub

Account: **jakewebb2132-ops** — https://github.com/jakewebb2132-ops
Brain repo: https://github.com/jakewebb2132-ops/brain
