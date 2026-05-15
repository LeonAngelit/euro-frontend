# Implementation — cli_recent

> Feature #7 from `feature_list.json`. Implementation summary and
> `R<n> → test` traceability required by `docs/specs.md`.

## Summary of Changes

- `src/cli.ts`
  - New `recent` command: validates `options.limit > 0` (throws
    `NoteError` otherwise), loads notes with `storage.load()`, sorts them
    by `created_at` descending, applies the slice `(0, options.limit)`, and
    prints each one with the format `<id>\t<created_at>\t<title>`.
- `tests/cli.test.ts`
  - 5 new tests (see table below).
  - Uses direct file writing for specific `created_at` values where needed.

`src/notes.ts` and `src/storage.ts` were not touched, as per `design.md`.

## Traceability

| Requirement | Test                                                        |
|-------------|-------------------------------------------------------------|
| R1          | `test_recent_default_limit_orders_by_created_at_desc`       |
| R2          | `test_recent_custom_limit`                                  |
| R3          | `test_recent_default_limit_orders_by_created_at_desc`       |
| R4          | `test_recent_custom_limit`                                  |
| R5          | `test_recent_empty_outputs_nothing`                         |
| R6          | `test_recent_invalid_limit_zero`, `test_recent_invalid_limit_negative` |
| R7          | `test_recent_invalid_limit_zero`, `test_recent_invalid_limit_negative` |

Details:

- **R1** (default <= 5): `test_recent_default_limit_orders_by_created_at_desc`
  creates 7 notes and checks that `recent` (without flags) prints exactly 5
  lines.
- **R2** (custom `--limit`): `test_recent_custom_limit` creates 6 notes and
  checks that `recent --limit 3` prints exactly 3 lines.
- **R3** (sort by `created_at` desc):
  `test_recent_default_limit_orders_by_created_at_desc` verifies that
  timestamps are in descending order and that titles are the 5 most
  recent.
- **R4** (format `<id>\t<created_at>\t<title>`): `test_recent_custom_limit`
  checks that each line has exactly 3 tab-separated fields and the second
  one is an ISO 8601 timestamp.
- **R5** (no notes: exit 0, empty stdout): `test_recent_empty_outputs_nothing`
  runs `recent` on a file without notes and verifies `status == 0`,
  `stdout == ""` and `stderr == ""`.
- **R6** (`--limit <= 0`: exit != 0 and stderr message):
  `test_recent_invalid_limit_zero` (with `--limit 0`) and
  `test_recent_invalid_limit_negative` (with `--limit -3`).
- **R7** (`--limit <= 0`: does not modify notes): the same two tests
  compare the content of the notes file before and after and verify that
  it does not change.

## Verification

- `./init.sh` executed at the end: **27 tests OK** (5 new + 22 pre-existing).

## Tasks

All tasks T1..T8 from `specs/cli_recent/tasks.md` are marked `[x]` unless
the reviewer requests changes.

## Status

Ready for review. **Do not** mark `done` in `feature_list.json` — this is
handled by the reviewer/leader according to the protocol.
