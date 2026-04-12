# LinkedIn Job Apply Agent — Setup Guide

## Overview

This guide walks you through the one-time setup to get the agent running on your Mac. After completing this, it will fire automatically at 1:00 AM every night using macOS launchd.

**Stack:**
- **Model:** Gemini 2.5 Flash (via Gemini CLI)
- **Browser automation:** Playwright MCP
- **Email reading:** Gmail MCP
- **Scheduler:** macOS launchd

---

## Step 1: Run the Install Script

Open Terminal and run:

```bash
chmod +x "/Users/jake/.gemini/antigravity/scratch/jw-ai-consulting/GTM Agents/skills/linkedin-job-apply/setup/install.sh"

zsh "/Users/jake/.gemini/antigravity/scratch/jw-ai-consulting/GTM Agents/skills/linkedin-job-apply/setup/install.sh"
```

This will:
- Install Gemini CLI globally
- Install Playwright MCP + Chromium
- Install Gmail MCP
- Write `~/.gemini/settings.json` with both MCP servers configured
- Register the 1 AM launchd job

---

## Step 2: Get a Gemini API Key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a new API key (free tier is fine for daily runs)
3. Add it to your shell profile:

```bash
echo 'export GEMINI_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

> The Gemini CLI automatically uses the `GEMINI_API_KEY` environment variable.

---

## Step 3: Verify Gemini CLI works

```bash
echo "Say hello" | gemini --model gemini-2.5-flash-preview-04-17
```

You should get a response back. If not, check that `GEMINI_API_KEY` is set.

---

## Step 4: Set Up Gmail OAuth (Required for email scanning)

The Gmail MCP needs permission to read your inbox. This is a one-time OAuth flow.

### 4a. Create Google Cloud credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use an existing one) — name it `linkedin-job-agent`
3. Go to **APIs & Services → Library**
4. Enable **Gmail API**
5. Go to **APIs & Services → Credentials**
6. Click **Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Desktop app**
   - Name: `LinkedIn Job Agent`
7. Download the JSON file
8. Rename it to `credentials.json` and place it here:

```
GTM Agents/skills/linkedin-job-apply/setup/gmail-auth/credentials.json
```

### 4b. Run the OAuth flow (first-time only)

```bash
# This opens a browser window to auth with your Google account
node "/Users/jake/.nvm/versions/node/v24.14.0/lib/node_modules/gmail-mcp-server/dist/auth.js"
```

This generates a `token.json` file in the same `gmail-auth/` directory. After this, the MCP server can read Gmail without any user interaction.

> ⚠️ `credentials.json` and `token.json` are gitignored — never commit them.

---

## Step 5: Test a Manual Run

Before the first 1 AM run, do a dry run from Terminal:

```bash
zsh "/Users/jake/.gemini/antigravity/scratch/jw-ai-consulting/GTM Agents/skills/linkedin-job-apply/run.sh"
```

Watch the output. It will:
1. Scan Gmail for LinkedIn job alerts
2. Open each qualifying job in Chrome (headless)
3. Apply or log why it couldn't
4. Write a report to `run-logs/YYYY-MM-DD.md`

---

## Step 6: Verify the Scheduled Job

```bash
# Check that the job is registered
launchctl list | grep linkedin

# See next scheduled run time
launchctl print gui/$(id -u)/com.jakewebb.linkedin-apply

# Force a manual trigger right now (for testing)
launchctl kickstart gui/$(id -u)/com.jakewebb.linkedin-apply
```

---

## Useful Management Commands

| Action | Command |
|---|---|
| **Disable** the agent | `launchctl unload ~/Library/LaunchAgents/com.jakewebb.linkedin-apply.plist` |
| **Re-enable** | `launchctl load ~/Library/LaunchAgents/com.jakewebb.linkedin-apply.plist` |
| **View launchd logs** | `cat "GTM Agents/skills/linkedin-job-apply/run-logs/launchd-stdout.log"` |
| **Check today's report** | `cat "GTM Agents/skills/linkedin-job-apply/run-logs/$(date +%Y-%m-%d).md"` |
| **View application log** | `cat "GTM Agents/skills/linkedin-job-apply/applied-jobs.json"` |

---

## File Locations After Setup

```
~/.gemini/settings.json                                    ← Gemini CLI MCP config
~/Library/LaunchAgents/com.jakewebb.linkedin-apply.plist   ← Scheduler

GTM Agents/skills/linkedin-job-apply/
  SKILL.md                    ← Agent instructions
  run.sh                      ← Daily runner (called by launchd)
  resume-data.json            ← Your application data
  applied-jobs.json           ← Rolling application log
  cover-letter-template.md    ← Cover letter template
  setup/
    install.sh                ← This installer
    SETUP-GUIDE.md            ← This file
    gmail-auth/
      credentials.json        ← Google OAuth client secret (you add this)
      token.json              ← Generated after first auth run
  run-logs/
    YYYY-MM-DD.md             ← Daily summary report
    launchd-stdout.log        ← Raw agent output
    launchd-stderr.log        ← Error log
```

---

## Troubleshooting

**Agent not running at 1 AM?**
- Mac must be awake at 1 AM (disable sleep in System Settings → Battery)
- Or use [Amphetamine](https://apps.apple.com/us/app/amphetamine/id937984704) to keep it awake overnight

**Gmail MCP not working?**
- Re-run the OAuth auth script (token may have expired)
- Verify `credentials.json` is in `setup/gmail-auth/`

**Playwright can't open pages?**
- Run `npx playwright install chromium` to reinstall the browser
- Check `run-logs/launchd-stderr.log` for details

**Wrong jobs being applied to?**
- Edit the keyword filter table in `SKILL.md` → Phase 2
- You can add or remove keywords without touching anything else

**Model costs?**
- Gemini 2.5 Flash is ~$0.075/1M input tokens
- A typical run (50 emails, 10 applications) uses ~100K tokens ≈ $0.007 per night
