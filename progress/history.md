# History Log (append-only)

> Every time a session is closed, its summary is added here.
> Do not edit previous entries. Only add to the end.

---

## 2026-04-20 — Project Bootstrap

- **Agent:** human (Martin)
- **Changes:** initial harness structure (AGENTS.md, init.sh, feature_list.json, docs/).
- **Result:** environment ready. `./init.sh` green.

## 2026-04-22 — Feature 1: storage_layer

- **Agent:** implementer #1
- **Plan:** create `src/storage.py` with atomic `load()` / `save()` and tests.
- **Changes:** `src/storage.py`, `tests/test_storage.py`.
- **Verification:** `./init.sh` green, 3 tests passing.
- **Closure:** feature 1 marked `done`.

## 2026-04-23 — Feature 2: note_model

- **Agent:** implementer #2
- **Plan:** `Note` dataclass with `Note.new(title, body)` and dict serialization.
- **Changes:** `src/notes.py`, `tests/test_notes.py`.
- **Verification:** `./init.sh` green.
- **Closure:** feature 2 marked `done`.

## 2026-04-25 — Feature 3: cli_add_list

- **Agent:** implementer #3, reviewed by reviewer-agent.
- **Plan:** `src/cli.py` with argparse, `add` and `list` commands.
- **Changes:** `src/cli.py`, `tests/test_cli.py`.
- **Verification:** `./init.sh` green, 7 tests passing.
- **Closure:** feature 3 marked `done`. Next: feature 4 (show/delete).

## 2026-04-27 — Feature 4: cli_show_delete

- **Agent:** Claude Opus 4.7
- **Plan:** add `cmd_show` and `cmd_delete` in `src/cli.py` with `NoteNotFound` handling (stderr + exit 1).
- **Changes:** `src/cli.py` (sub-commands `show`/`delete` and `NoteError` capture in `main`), `tests/test_cli.py` (4 new tests: success and failure of each command, stderr capture).
- **Verification:** `./init.sh` green, 14 tests passing.
- **Closure:** feature 4 marked `done`. Next: feature 5 (search).

## 2026-04-27 — Feature 5: cli_search

- **Agent:** Claude Opus 4.6
- **Plan:** add `cmd_search` in `src/cli.py` with case-insensitive search in title and body. No matches → NoteNotFound (stderr + exit 1).
- **Changes:** `src/cli.py` (sub-command `search` with `cmd_search`), `tests/test_cli.py` (3 new tests: match, no-match, case-insensitivity).
- **Verification:** `./init.sh` green, 17 tests passing.
- **Closure:** feature 5 marked `done`. All features completed.

## 2026-04-29 — Feature 6: cli_edit

- **Agent:** Claude Opus 4.7 (leader) → implementer → reviewer.
- **Plan:** add `cmd_edit` in `src/cli.py` with optional `--title` and `--body`; no flags → `NoteError`; non-existent id → `NoteNotFound`.
- **Changes:** `src/cli.py` (sub-command `edit` and `cmd_edit` building a new `Note` instance preserving `id`/`created_at`), `tests/test_cli.py` (5 tests: each flag, both together, non-existent id, absence of flags).
- **Verification:** `./init.sh` green, 22 tests passing. Reviewer APPROVED (`progress/review_cli_edit.md`).
- **Closure:** feature 6 marked `done`. All project features completed.

## 2026-05-13 — Feature 7: cli_recent

- **Agent:** Claude Opus 4.7 (leader) → spec_author → implementer → reviewer.
- **Plan:** execute the 8 tasks from `specs/cli_recent/tasks.md`: add `cmd_recent` and `recent` subparser in `src/cli.py`, cover R1–R7 with tests, validate traceability and `./init.sh`.
- **Changes:** `src/cli.py` (`cmd_recent` + subparser with `--limit`), `tests/test_cli.py` (5 new tests: default order, custom limit, empty file, limit 0, negative limit; helper `_add_with_created_at`).
- **Verification:** `./init.sh` green, 27 tests passing. Reviewer APPROVED (`progress/review_cli_recent.md`); traceability in `progress/impl_cli_recent.md`.
- **Closure:** feature 7 marked `done`. Next: feature 8 (cli_count).

## 2026-05-15 — TypeScript Migration

- **Agent:** Antigravity
- **Plan:** 1. Initialize Node.js/TS project. 2. Migrate src/_.py to src/_.ts. 3. Migrate tests/_.py to tests/_.test.ts. 4. Update init.sh and feature_list.json.
- **Changes:** `package.json`, `tsconfig.json`, `src/*.ts`, `tests/*.test.ts`, `init.sh`, `feature_list.json`.
- **Verification:** `./init.sh` green, all tests passing in Vitest. Old Python files removed.
- **Closure:** Migration complete. Project is now TS/Node.

## 2026-05-15 — Finalize Translation to English

- **Agent:** Antigravity
- **Plan:** Translate remaining harness files (agents instructions) to English.
- **Changes:** .opencode/agents/\*.md.
- **Verification:** grep for Spanish words returned zero relevant matches. init.sh is green.
- **Closure:** Translation complete.

## 2026-05-15 — Feature 8: migrate_agents_to_opencode

- **Agent:** Antigravity (Leader → Spec Author → Implementer → Reviewer)
- **Plan:** Rename .claude to .opencode, update opencode.json, update global references, and translate strings.
- **Changes:** .opencode/, OPENCODE.md, AGENTS.md, README.md, feature_list.json.
- **Verification:** ./init.sh green, grep for .claude empty.
- **Closure:** Feature 8 marked done. Harness migrated to OpenCode.
