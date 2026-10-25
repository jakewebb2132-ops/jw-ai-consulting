#!/usr/bin/env bash
# Acceptance contract. Exit 0 = VERIFIED, nonzero = REFUTED.
# Declared by the caller, not by the agent doing the work.
# Run from the repo root. Every check runs even if an earlier one fails.
set -uo pipefail
cd "$(dirname "$0")"

CHECKS=(
  "npm run lint"
  "npm run typecheck"
  "npm run build"
  "npm test"
)

# Snapshot the files the contract grades by, so a run cannot pass by editing them.
BEFORE=$(git diff --stat HEAD -- tests/ '*.test.*' '*.spec.*' 2>/dev/null || true)

fail=0
echo "CONTRACT"
for i in "${!CHECKS[@]}"; do echo "  $((i+1)). ${CHECKS[$i]}"; done
echo
echo "RESULTS"
for i in "${!CHECKS[@]}"; do
  out=$(eval "${CHECKS[$i]}" 2>&1); code=$?
  printf '  %d. %-48s -> exit %d\n' "$((i+1))" "${CHECKS[$i]}" "$code"
  if [ $code -ne 0 ]; then fail=1; echo "$out" | tail -20 | sed 's/^/     /'; fi
done

echo
AFTER=$(git diff --stat HEAD -- tests/ '*.test.*' '*.spec.*' 2>/dev/null || true)
if [ "$BEFORE" != "$AFTER" ]; then
  echo "TEST INTEGRITY: MODIFIED during run"
  echo
  echo "VERDICT: REFUTED - the run edited the tests it is graded by"
  exit 2
fi
echo "TEST INTEGRITY: clean"
echo
if [ $fail -eq 0 ]; then echo "VERDICT: VERIFIED"; else echo "VERDICT: REFUTED"; fi
exit $fail
