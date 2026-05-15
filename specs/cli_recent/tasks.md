# Tasks — cli_recent

> Discrete steps in order. The `implementer` marks `[x]` upon completing each
> one. Each task references the `R<n>` it covers.

## Implementation

- [x] T1 — Add the `recent` command in `src/cli.ts` that:
  validates `options.limit > 0` (throwing `NoteError` if not), loads notes with
  `storage.load()`, sorts them by `created_at` descending, applies the
  slice `(0, options.limit)`, and prints each one with the format
  `${n.id}\t${n.created_at}\t${n.title}`. Covers: R1, R2, R3, R4, R5, R6, R7.

- [x] T2 — Register the `recent` sub-command in `src/cli.ts` with `--limit`
  (type=int, default=5). Covers: R1, R2.

## Tests

- [x] T3 — Add `test_recent_default_limit_orders_by_created_at_desc` in
  `tests/cli.test.ts`: creates > 5 notes, executes `recent` without flags,
  and verifies that exactly 5 lines are printed in descending order by
  `created_at`. Covers: R1, R3.

- [x] T4 — Add `test_recent_custom_limit` in `tests/cli.test.ts`:
  creates N notes, executes `recent --limit K` with `K < N`, verifies that
  exactly `K` lines are printed and that each line respects the format
  `<id>\t<created_at>\t<title>`. Covers: R2, R4.

- [x] T5 — Add `test_recent_empty_outputs_nothing` in
  `tests/cli.test.ts`: without previous notes, executes `recent`, verifies
  exit code `0` and empty stdout. Covers: R5.

- [x] T6 — Add `test_recent_invalid_limit_zero` and
  `test_recent_invalid_limit_negative` in `tests/cli.test.ts`: with notes
  present, executes `recent --limit 0` and `recent --limit -3`
  respectively; verifies that exit code is `!= 0`, stdout is empty, stderr
  is not empty, and the notes file on disk has not changed. Covers: R6, R7.

## Closure

- [x] T7 — Document traceability `R<n>` ↔ test in
  `progress/impl_cli_recent.md` following the example in `docs/specs.md`.

- [x] T8 — Run `./init.sh` and check that all tests pass (including the new ones).
  Covers: final verification before review.
