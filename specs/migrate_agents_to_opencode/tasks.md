# Tasks — migrate_agents_to_opencode

> Discrete steps to implement the migration.

## Implementation

- [x] T1 — Rename `.opencode/` directory to `.opencode/`. Covers: R1.
- [x] T2 — Update `.opencode/opencode.json`: translate all Spanish strings to English. Covers: R3.
- [x] T3 — Update `.opencode/opencode.json`: update commands to Node.js/Vitest and update permissions. Covers: R4, R5.
- [x] T4 — Search and replace all occurrences of `.claude/` with `.opencode/` in the entire project (including `AGENTS.md`, `README.md`, `docs/`, etc.). Covers: R2.
- [x] T5 — Update any specific mentions in `init.sh` that might be checking for `.claude/`. Covers: R6.

## Verification

- [x] T6 — Run `./init.sh` and verify all tests pass and harness check is OK. Covers: R6.
- [x] T7 — Verify no occurrences of `.claude` remain using `grep`. Covers: R2.

## Closure

- [x] T8 — Update `feature_list.json` status to `done` and move session summary to history.
