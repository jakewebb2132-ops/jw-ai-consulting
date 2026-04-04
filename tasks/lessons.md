# Agent Lessons — JW AI Consulting

A running log of learned patterns. Updated after every user correction or near-miss.

---

## L001 — Always visually verify deployments with browser (2026-04-04)

**What happened:** After pushing code and running `vercel --prod`, I reported success based solely on CLI exit code 0. The live site at `jwaiconsulting.com` was actually serving a **rolled-back** build from weeks earlier. The user had to point this out with a screenshot.

**Root cause:** Two separate issues were silently compounding:
1. The Vercel project was in a "Rolled Back" state, which prevents new deployments from auto-promoting to production — even after a successful `vercel --prod` CLI deploy.
2. `jwaiconsulting.com` was bound to a different Vercel account/team than the CLI was authenticated against, making `vercel alias` commands fail silently.

**Fix applied:** Opened Vercel dashboard via `browser_subagent`, identified the "Undo Rollback" banner, promoted the latest deployment to production manually.

**Rule established (now in `Claud.md` §3):**
- After every deployment, run a 6-step verification checklist ending with a mandatory `browser_subagent` visual screenshot of the live URL.
- Never declare a deployment "done" based on CLI output alone.
- Always check `curl -sI https://<domain>` for HTTP 200 + `server: Vercel` before and after.
- If `vercel domains ls` returns 0 domains for the team, suspect a multi-account setup and investigate via the browser dashboard.

---

## L002 — Check git before claiming code is live (2026-04-04)

**What happened:** `UseCaseAgents.tsx` was created but not committed to git. The Vercel deployment included it (because Vercel built from the working directory, not git), but the GitHub repo was missing it. If the branch had been reset or another agent cloned the repo, the file would have been lost.

**Rule:**
- Always run `git status` after creating or editing files.
- Always `git add` + `git commit` + `git push` before considering a feature "done."
- Git and Vercel are treated as two separate checkpoints — both must be green.

---
