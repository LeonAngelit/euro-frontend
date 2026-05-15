# Design — migrate_agents_to_opencode

> Technical decisions for migrating the harness to OpenCode.

## Scope and Files to Modify

| File / Folder             | Change                                                            |
| ------------------------- | ----------------------------------------------------------------- |
| `.opencode/` (folder)     | Rename to `.opencode/`.                                           |
| `.opencode/opencode.json` | Update to English and fix commands (Node.js/TS).                  |
| `AGENTS.md`               | Update repository map and mentions of `.opencode/`.               |
| `README.md`               | Update mentions of `.opencode/` or OpenCode.                      |
| `init.sh`                 | Update checks for harness files (if they check for `.opencode/`). |
| `feature_list.json`       | Update status to `done` after migration (at the end).             |

## Technical Decisions

1. **Renaming**: We will use `mv .opencode .opencode` to preserve all agent instructions.
2. **Global Replace**: We will use a script or `sed` to replace `.opencode/` with `.opencode/` globally to ensure consistency.
3. **Settings Update**:
   - `python3 -m unittest discover` -> `npm test`.
   - `python3 -m src.cli` -> `npx tsx src/cli.ts`.
   - All messages in `opencode.json` will be translated to English to match the project's new standard.

## Discarded Alternative

**Alternative A: Keep `.opencode/` but add a symlink.**
Discarded because:

- It creates clutter.
- The requirement explicitly asks to "use OpenCode instead of Claude".
- Hard-coding the new name is cleaner and follows the "Less but better" architecture.

## Verification Plan

- Run `./init.sh`.
- Check for any remaining occurrences of `.opencode` in the codebase.
