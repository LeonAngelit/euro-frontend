# Spec Driven Development (SDD)

> This project follows a Kiro-style flow: requirements → design → tasks → code.
> Code is not written until the spec is approved by a human.

## Structure

Every new feature (`"sdd": true` in `feature_list.json`) has a dedicated
folder as soon as it leaves `pending` status:

```
specs/<feature-name>/
├── requirements.md   # WHAT is needed (EARS notation)
├── design.md         # HOW it will be built (technical decisions)
└── tasks.md          # Concrete STEPS to implement
```

The `feature-name` matches the `name` field in `feature_list.json`.

## Feature States

| State          | Meaning                                                       |
|----------------|---------------------------------------------------------------|
| `pending`      | No spec. `spec_author` acts first.                            |
| `spec_ready`   | Spec drafted. Waiting for human approval. DO NOT touch code.  |
| `in_progress`  | Spec approved. `implementer` working.                         |
| `done`         | Code is green, `reviewer` approved, session closed.           |
| `blocked`      | Stuck. Reason documented in `progress/current.md`.            |

## The Human Approval Gate

The automatic flow stops **once**: when the `spec_author` finishes the
three files, marks the feature as `spec_ready`, and stops. The human
reads `specs/<feature>/` and says "approved" (or asks for changes).

Only then does the `leader` transition `spec_ready → in_progress` and
launch the `implementer`.

```
pending → [spec_author] → spec_ready → ⏸ HUMAN → in_progress → [implementer → reviewer] → done
```

## requirements.md — Strict EARS

Requirements are written in **EARS** (Easy Approach to Requirements
Syntax). Each requirement is a numbered paragraph with one of these
five patterns:

| Pattern        | Template                                                    |
|----------------|-------------------------------------------------------------|
| **Ubiquitous** | `The system SHALL <action>.`                                |
| **Event**      | `WHEN <trigger>, the system SHALL <action>.`                |
| **State**      | `WHILE <state>, the system SHALL <action>.`                 |
| **Optional**   | `WHERE <optional feature>, the system SHALL <action>.`      |
| **Unwanted**   | `IF <unwanted event> THEN the system SHALL <action>.`       |

Hard Rules:

- Each requirement has a stable id: `R1`, `R2`, ...
- Each requirement MUST be verifiable by at least one concrete test.
- Do not mix several `SHALL` in a single requirement. Split them.
- Do not use soft verbs ("could", "may", "supports"). Only `SHALL` / `SHALL NOT`.

Example:

```markdown
## R1
WHEN the user executes `npx tsx src/cli.ts recent`, the system SHALL
print up to 5 notes ordered by `created_at` descending.

## R2
IF the `--limit` flag receives a value <= 0 THEN the system SHALL
print an error message to stderr and exit with code != 0.
```

## design.md — Technical Decisions

Capture **before** touching code:

- Which files are created / modified.
- Which new signatures appear (functions, classes, commands).
- Which exceptions are reused or added.
- Which alternative was discarded and why (at least one).

It is NOT engineering from first principles — rely on
`docs/architecture.md` and `docs/conventions.md`. `design.md` documents
where your feature touches the boundaries of those rules.

## tasks.md — Executable Checklist

Discrete steps in order, each with a checkbox. Each task references at
least one `R<n>` it covers.

Example:

```markdown
- [ ] T1 — Add `cmd_recent` in `src/cli.ts`. Covers: R1, R3.
- [ ] T2 — Register `recent` sub-command with `--limit` flag. Covers: R1, R2.
- [ ] T3 — Add `test_recent_default_limit` in `tests/cli.test.ts`. Covers: R1.
- [ ] T4 — Add `test_recent_invalid_limit` in `tests/cli.test.ts`. Covers: R2.
```

The `implementer` marks each task `[x]` upon completion. The `reviewer`
rejects if any `[ ]` remain without documented justification.

## Traceability (Hard Rule)

- Every test in `tests/` must be mappable to an `R<n>` from its spec.
- Every `R<n>` must have at least one concrete test.
- The `reviewer` checks this correspondence explicitly and rejects if missing.

The `implementer` documents the map in `progress/impl_<name>.md`:

```markdown
## Traceability
- R1 → `test_recent_default_limit`
- R2 → `test_recent_invalid_limit`
- R3 → `test_recent_custom_limit`
```

## When SDD Does NOT Apply

Features with `"sdd": false` or without the `sdd` field (legacy 1–7)
do NOT have a spec. SDD only applies forward.
