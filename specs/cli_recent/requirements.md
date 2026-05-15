# Requirements — cli_recent

> This feature allows listing the most recent notes.

## R1
WHEN the user executes `npx tsx src/cli.ts recent` without flags, the system SHALL print up to 5 notes.

## R2
WHEN the user executes `npx tsx src/cli.ts recent --limit <N>`, the system SHALL print up to `<N>` notes.

## R3
THE system SHALL sort the notes by `created_at` in descending order (most recent first).

## R4
EACH printed line SHALL follow the format `<id>\t<created_at>\t<title>`.

## R5
WHILE there are no stored notes, the system SHALL exit with exit code `0` without writing anything to stdout.

## R6
IF the user executes `npx tsx src/cli.ts recent --limit <N>` with `N <= 0`, THEN the system SHALL exit with a non-zero exit code and write an error message to stderr.

## R7
IF the user executes `npx tsx src/cli.ts recent --limit <N>` with `N <= 0`, THEN the system SHALL NOT modify the notes file.

## Traceability with `acceptance` from feature_list.json

| Acceptance criterion (feature #7)                                                       | Covered by |
|-----------------------------------------------------------------------------------------|------------|
| `npx tsx src/cli.ts recent` lists the 5 most recent notes by default                   | R1, R3     |
| `npx tsx src/cli.ts recent --limit 10` allows changing the number                       | R2         |
| The order is by `created_at` from most recent to oldest                                 | R3         |
| Each line follows the format `<id>\t<created_at>\t<title>` (same as `list`)             | R4         |
| If there are no notes, exit code 0 and prints nothing (consistent with `list`)          | R5         |
| If `--limit` is <= 0, exit code != 0 and clear message in stderr                        | R6, R7     |
| Tests cover default order, custom limit, empty file, invalid limit                      | R1–R7 (via tests) |
