# Design — cli_recent

> Technical decisions to implement the `recent` command. Supported by
> `docs/architecture.md` and `docs/conventions.md`. Only points where the
> feature touches the boundary of those rules are documented.

## Scope and Files to Modify

| File                     | Change                                                                 |
|--------------------------|------------------------------------------------------------------------|
| `src/cli.ts`             | Add `recent` command to the program.                                   |
| `tests/cli.test.ts`      | Add 4 new tests (default order, custom limit, empty file, invalid limit) |

`src/notes.ts` and `src/storage.ts` are not touched. The feature is purely
presentational: reads notes with `storage.load()`, sorts and filters in memory,
and prints with the existing format.

## Algorithm

1. **Early validation of the limit.** If `options.limit <= 0`, throw
   `NoteError("--limit must be a positive integer")`. This covers R6 and R7
   (by throwing before any processing - and `recent` never calls `storage.save()`,
   so R7 is structurally guaranteed).
2. Load notes with `storage.load()`.
3. If the list is empty, return without printing (covers R5).
4. Sort the list in memory by `created_at` descending.
5. Apply slice `(0, options.limit)`.
6. For each note in the slice, print `f"{n.id}\t{n.created_at}\t{n.title}"`.
7. Exit.

## Error Handling

- Reuse `NoteError` already defined in `src/notes.ts`. No new exceptions
  are introduced.
- The global handler captures `NoteError`, prints to `stderr`, and exits
  with code `1`. Same pattern as `edit` command when flags are missing.

## Output Format

Identical to `list` command:

```
<id>\t<created_at>\t<title>
```

## Sorting: why `created_at` and not `id`

`created_at` is in ISO 8601 (see `src/notes.ts`). The lexicographical order
 of ISO 8601 matches the chronological order, so `sort((a, b) => b.created_at.localeCompare(a.created_at))`
is correct without parsing.

`id` is also monotonically increasing, but the acceptance criterion
explicitly requires "ordered by `created_at`", so we follow it literally.

## Discarded Alternative

**Alternative A: use a more complex sorting algorithm.**
Discarded because:
- The expected dataset is small (personal notes in a local JSON).
- Simple `sort()` is more readable and maintains stylistic parity with the
  rest of the project.
- `docs/architecture.md` prioritizes clarity over premature optimization.
