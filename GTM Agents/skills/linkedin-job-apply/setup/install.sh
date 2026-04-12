#!/bin/zsh
# =============================================================================
# LinkedIn Job Apply Agent — One-Time Setup Script
# Run this once to install all dependencies and configure the scheduler.
# =============================================================================

set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
ok()   { echo "${GREEN}✅ $1${NC}"; }
info() { echo "${BLUE}ℹ️  $1${NC}"; }
warn() { echo "${YELLOW}⚠️  $1${NC}"; }
fail() { echo "${RED}❌ $1${NC}"; exit 1; }

SCRIPT_DIR="${0:A:h}"                          # This setup/ directory
SKILL_DIR="${SCRIPT_DIR:h}"                    # skills/linkedin-job-apply/
PLIST_ID="com.jakewebb.linkedin-apply"
PLIST_DST="$HOME/Library/LaunchAgents/${PLIST_ID}.plist"
GEMINI_SETTINGS="$HOME/.gemini/settings.json"
GMAIL_CREDS_DIR="$SKILL_DIR/setup/gmail-auth"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " LinkedIn Job Apply Agent — Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Step 1: Load nvm and verify Node ─────────────────────────────────────────
info "Loading nvm..."
export NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh" || fail "nvm not found. Install from https://nvm.sh"
nvm use 24 2>/dev/null || nvm use --lts
NODE_BIN=$(which node)
NPM_BIN=$(which npm)
NPX_BIN=$(which npx)
ok "Node: $(node --version) at $NODE_BIN"

# ── Step 2: Install Gemini CLI ────────────────────────────────────────────────
info "Installing Gemini CLI..."
if ! which gemini &>/dev/null; then
  npm install -g @google/gemini-cli
  ok "Gemini CLI installed"
else
  ok "Gemini CLI already present: $(gemini --version 2>/dev/null || echo 'installed')"
fi
GEMINI_BIN=$(which gemini)

# ── Step 3: Install Playwright MCP ──────────────────────────────────────────
info "Installing Playwright MCP (browser automation)..."
# Install globally so launchd can find it
npm install -g @playwright/mcp
# Install Chromium browser
npx playwright install chromium
ok "Playwright MCP installed"
PLAYWRIGHT_MCP_BIN=$(npm root -g)/@playwright/mcp/dist/index.js

# ── Step 4: Install Gmail MCP ─────────────────────────────────────────────────
info "Installing Gmail MCP server..."
npm install -g @gptscript-ai/gmail-mcp 2>/dev/null || \
  npm install -g gmail-mcp-server 2>/dev/null || \
  warn "Could not auto-install Gmail MCP. See SETUP-GUIDE.md Step 4 for manual install."

GMAIL_MCP_BIN=$(npm root -g 2>/dev/null)/gmail-mcp-server/dist/index.js 2>/dev/null || true

# ── Step 5: Create Gmail OAuth credentials directory ─────────────────────────
mkdir -p "$GMAIL_CREDS_DIR"
info "Gmail credentials will live in: $GMAIL_CREDS_DIR"
if [[ ! -f "$GMAIL_CREDS_DIR/credentials.json" ]]; then
  warn "Gmail OAuth credentials not found."
  warn "Follow SETUP-GUIDE.md Step 4 to download credentials.json from Google Cloud Console"
  warn "and place it at: $GMAIL_CREDS_DIR/credentials.json"
fi

# ── Step 6: Configure ~/.gemini/settings.json ─────────────────────────────────
info "Configuring Gemini CLI MCP settings..."
mkdir -p "$HOME/.gemini"

NODE_MODULES_GLOBAL=$(npm root -g)

# Write settings.json (merge-safe: preserves existing keys)
python3 - <<PYEOF
import json, os, sys

path = os.path.expanduser("$GEMINI_SETTINGS")
settings = {}
if os.path.exists(path):
    with open(path) as f:
        try:
            settings = json.load(f)
        except json.JSONDecodeError:
            settings = {}

settings.setdefault("mcpServers", {})

settings["mcpServers"]["playwright"] = {
    "command": "$NPX_BIN",
    "args": ["@playwright/mcp@latest", "--headless"],
    "env": {}
}

settings["mcpServers"]["gmail"] = {
    "command": "node",
    "args": ["$NODE_MODULES_GLOBAL/gmail-mcp-server/dist/index.js"],
    "env": {
        "GMAIL_CREDENTIALS_PATH": "$GMAIL_CREDS_DIR/credentials.json",
        "GMAIL_TOKEN_PATH": "$GMAIL_CREDS_DIR/token.json"
    }
}

with open(path, "w") as f:
    json.dump(settings, f, indent=2)
print("Settings written to: " + path)
PYEOF
ok "~/.gemini/settings.json configured"

# ── Step 7: Write launchd plist ───────────────────────────────────────────────
info "Writing launchd plist..."
RUN_SCRIPT="$SKILL_DIR/run.sh"
LOG_DIR="$SKILL_DIR/run-logs"
mkdir -p "$LOG_DIR"

cat > "$PLIST_DST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_ID}</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/zsh</string>
        <string>${RUN_SCRIPT}</string>
    </array>

    <!-- Fire every day at 1:00 AM -->
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>1</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>${LOG_DIR}/launchd-stdout.log</string>

    <key>StandardErrorPath</key>
    <string>${LOG_DIR}/launchd-stderr.log</string>

    <!-- Needed so nvm-managed node is on PATH -->
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/Users/jake/.nvm/versions/node/v24.14.0/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
        <key>NVM_DIR</key>
        <string>/Users/jake/.nvm</string>
        <key>HOME</key>
        <string>/Users/jake</string>
    </dict>

    <!-- Only run when logged in -->
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
PLIST
ok "launchd plist written to: $PLIST_DST"

# ── Step 8: Load the launchd job ─────────────────────────────────────────────
info "Loading launchd job..."
launchctl unload "$PLIST_DST" 2>/dev/null || true
launchctl load "$PLIST_DST"
ok "launchd job registered: $PLIST_ID"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "${GREEN} Setup complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Remaining manual steps:"
echo "  1. Complete Gmail OAuth → follow SETUP-GUIDE.md Step 4"
echo "  2. Test a manual run:  zsh '${RUN_SCRIPT}'"
echo "  3. Check next 1AM run: launchctl list | grep linkedin"
echo ""
