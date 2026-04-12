#!/bin/zsh
# =============================================================================
# LinkedIn Job Apply Agent — Daily Runner
# Called by launchd at 1:00 AM every day.
# =============================================================================

set -uo pipefail

# ── Environment ───────────────────────────────────────────────────────────────
export NVM_DIR="$HOME/.nvm"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_FILE="$SKILL_DIR/SKILL.md"
RESUME_DATA="$SKILL_DIR/resume-data.json"
APPLIED_LOG="$SKILL_DIR/applied-jobs.json"
COVER_LETTER="$SKILL_DIR/cover-letter-template.md"
LOG_DIR="$SKILL_DIR/run-logs"
TODAY=$(date +%Y-%m-%d)
RUN_LOG="$LOG_DIR/${TODAY}.md"

mkdir -p "$LOG_DIR"

# ── Preflight checks ──────────────────────────────────────────────────────────
echo "[$(date -Iseconds)] Starting LinkedIn Job Apply agent..."

if [[ ! -f "$SKILL_FILE" ]]; then
  echo "ERROR: SKILL.md not found at $SKILL_FILE" >&2
  exit 1
fi

if [[ ! -f "$RESUME_DATA" ]]; then
  echo "ERROR: resume-data.json not found at $RESUME_DATA" >&2
  exit 1
fi

if [[ ! -f "$APPLIED_LOG" ]]; then
  echo '{"applied_jobs":[]}' > "$APPLIED_LOG"
fi

if ! which gemini &>/dev/null; then
  echo "ERROR: Gemini CLI not found. Run setup/install.sh first." >&2
  exit 1
fi

# ── Build the full prompt ─────────────────────────────────────────────────────
# Inject file contents + today's date into the skill prompt so the model
# has full context without needing filesystem MCP access.

RESUME_JSON=$(cat "$RESUME_DATA")
APPLIED_JSON=$(cat "$APPLIED_LOG")
COVER_TEMPLATE=$(cat "$COVER_LETTER")

FULL_PROMPT=$(cat <<PROMPT
Today's date: ${TODAY}
Current time (local): $(date '+%Y-%m-%d %H:%M %Z')
Run log output path: ${RUN_LOG}

--- RESUME DATA (use for all form fields) ---
${RESUME_JSON}

--- APPLIED JOBS LOG (deduplicate against this) ---
${APPLIED_JSON}

--- COVER LETTER TEMPLATE ---
${COVER_TEMPLATE}

--- INSTRUCTIONS ---
$(cat "$SKILL_FILE")

CRITICAL: After completing all applications, write the full summary report in markdown
to the exact path: ${RUN_LOG}
Use the exact format specified in Phase 5 of the instructions above.
Update applied-jobs.json at: ${APPLIED_LOG}
PROMPT
)

# ── Run Gemini CLI ────────────────────────────────────────────────────────────
echo "[$(date -Iseconds)] Launching Gemini 2.5 Flash..."

echo "$FULL_PROMPT" | gemini \
  --model "gemini-2.5-flash-preview-04-17" \
  --yolo \
  2>&1 | tee -a "${LOG_DIR}/launchd-stdout.log"

EXIT_CODE=$?

if [[ $EXIT_CODE -eq 0 ]]; then
  echo "[$(date -Iseconds)] Agent completed successfully. Check $RUN_LOG for results."
  # ── Sync to dashboard public dir so the Job Applications tab stays fresh ──
  DASHBOARD_DATA_DIR="$(cd "$SKILL_DIR/../../.." && pwd)/public/data"
  if [[ -d "$DASHBOARD_DATA_DIR" ]]; then
    cp "$APPLIED_LOG" "$DASHBOARD_DATA_DIR/applied-jobs.json"
    echo "[$(date -Iseconds)] Synced applied-jobs.json → public/data/ for dashboard."
  fi
else
  echo "[$(date -Iseconds)] Agent exited with code $EXIT_CODE. Check ${LOG_DIR}/launchd-stderr.log" >&2

  # Write a minimal error log if agent didn't create one
  if [[ ! -f "$RUN_LOG" ]]; then
    cat > "$RUN_LOG" <<EOF
# LinkedIn Job Application Run — ${TODAY}

**Status:** ❌ Agent exited with error code ${EXIT_CODE}

Check \`run-logs/launchd-stderr.log\` for details.

**Run Time:** $(date '+%I:%M %p %Z')
EOF
  fi
fi
