# Project Gstack Skills

This project uses **Gstack** by Garry Tan to enhance strategic review and security checkup capabilities.

## Usage Instructions
- **Browsing**: Use the `/browse` skill for all web-based research.
- **Office Hours**: Run `/office-hours` to provide context on the goal.
- **Review**: Run `/review` on any branch changes.
- **Canary/Security**: Use `/canary` and `/guard` for security-related checkups.
- **QA**: Run `/qa` to test a live staging URL.

## Skills Location
Gstack is installed at `/Users/jake/.claude/skills/gstack`.
Refer to the official repository for documentation on individual skills: [garrytan/gstack](https://github.com/garrytan/gstack).

## Skill routing

- **Checkpoint / compile / save progress / new session** → invoke `/checkpoint`, but ALWAYS ask the user first: "Ready to save a checkpoint so you can resume in a fresh session?" and wait for confirmation before running the skill.
- **Bugs, errors, "why is this broken"** → invoke `/investigate`
- **Ship, deploy, push, create PR, go live** → invoke `/ship`, then immediately invoke `/land-and-deploy` to merge the PR and deploy to production. Always run both in sequence — `/ship` alone does not go live.
- **QA, test the site, find bugs** → invoke `/qa`
- **Code review, check my diff** → invoke `/review`
- **Design audit, visual polish** → invoke `/design-review`
