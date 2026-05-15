#!/usr/bin/env bash
# init.sh — Environment verification and initialization
#
# This script is executed by the agent at the START of a session and before
# declaring any task as `done`. If it fails, the session must not proceed.
#
# Expected output: clear exit codes and blocks marked with [OK]/[FAIL].

set -u
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok()    { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
fail()  { printf "${RED}[FAIL]${NC}  %s\n" "$1"; }

EXIT_CODE=0

echo "── 1. Verifying environment ───────────────────────────"

# Node.js available
if ! command -v node >/dev/null 2>&1; then
  fail "node is not installed"
  exit 1
fi
ok "node -> $(node --version)"

# npm available
if ! command -v npm >/dev/null 2>&1; then
  fail "npm is not installed"
  exit 1
fi
ok "npm -> $(npm --version)"

echo ""
echo "── 2. Verifying base harness files ───────────────────"

for f in AGENTS.md feature_list.json progress/current.md docs/architecture.md docs/conventions.md docs/verification.md CHECKPOINTS.md; do
  if [ ! -f "$f" ]; then
    fail "Missing base file: $f"
    EXIT_CODE=1
  else
    ok "Exists $f"
  fi
done

echo ""
echo "── 3. Validating feature_list.json and specs ─────────"

# Use node to validate JSON (more robust since we are in Node)
node - <<'JS'
import fs from 'fs';
import path from 'path';

try {
    const data = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));
    const valid = new Set(["pending", "spec_ready", "in_progress", "done", "blocked"]);
    const inProgress = data.features.filter(f => f.status === "in_progress");
    
    if (inProgress.length > 1) {
        console.error(`[FAIL]  There are ${inProgress.length} features in in_progress (maximum 1)`);
        process.exit(1);
    }
    
    const requiresSpec = new Set(["spec_ready", "in_progress", "done"]);
    const specErrors = [];
    
    for (const f of data.features) {
        if (!valid.has(f.status)) {
            console.error(`[FAIL]  Invalid status in feature ${f.id}: ${f.status}`);
            process.exit(1);
        }
        
        if (f.sdd && requiresSpec.has(f.status)) {
            const specDir = path.join("specs", f.name);
            for (const fname of ["requirements.md", "design.md", "tasks.md"]) {
                if (!fs.existsSync(path.join(specDir, fname))) {
                    specErrors.push(`feature ${f.id} (${f.name}) in ${f.status} without ${specDir}/${fname}`);
                }
            }
        }
    }
    
    if (specErrors.length > 0) {
        specErrors.forEach(e => console.error(`[FAIL]  ${e}`));
        process.exit(1);
    }
    
    console.log(`[OK]    feature_list.json valid (${data.features.length} features)`);
    console.log(`[OK]    Specs present for sdd features with non-pending status`);
} catch (e) {
    console.error(`[FAIL]  feature_list.json or specs invalid: ${e.message}`);
    process.exit(1);
}
JS

if [ $? -ne 0 ]; then EXIT_CODE=1; fi

echo ""
echo "── 4. Running tests ───────────────────────────────────"

if [ -d "tests" ]; then
  if npm test; then
    ok "All tests pass"
  else
    fail "There are broken tests"
    EXIT_CODE=1
  fi
else
  warn "Folder tests/ does not exist yet"
fi

echo ""
echo "── 5. Summary ─────────────────────────────────────────"

if [ $EXIT_CODE -eq 0 ]; then
  ok "Environment ready. You can start working."
else
  fail "Environment is NOT ready. Resolve errors before proceeding."
fi

exit $EXIT_CODE
