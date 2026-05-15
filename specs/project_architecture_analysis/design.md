# Design — project_architecture_analysis

## Decision: Create, not modify

The `ARCHITECTURE.md` file does **not** currently exist at the project root.
This feature creates it from scratch. No existing file is modified.

## File created

- **`ARCHITECTURE.md`** (project root) — the single deliverable.

## Structure of ARCHITECTURE.md

The document follows this outline (each section maps to one or more
requirements):

```
1.  Project Overview               → R2
2.  Tech Stack                      → R3
3.  Project Structure               → R4
4.  Component Architecture          → R5
5.  Routing                         → R6
6.  State Management                → R7
7.  CLI Subsystem                   → R8
8.  API Integration                 → R9
9.  Configuration                   → R10
10. Utilities                       → R11
11. Layout Shell                   → R12
12. Testing Strategy                → R13
13. Build & Deployment             → R14
14. Architectural Concerns         → R15
```

Section 15 (R16) is a brief note explaining the relationship to
`docs/architecture.md`.

## Technical decisions

### D1 — Descriptive, not prescriptive

`docs/architecture.md` already contains **prescriptive rules** (atomic
persistence, no mocks, no new deps). `ARCHITECTURE.md` adds a **descriptive**
layer: it documents what the code actually **is** right now, not what it
**should** be. Both files coexist; the prescriptive rules remain untouched.

### D2 — Single source of architectural truth

`ARCHITECTURE.md` is placed at the project root (not under `docs/`) so agents
find it first. It references `docs/architecture.md` for policy and
`docs/conventions.md` for style rules, but does not duplicate their content.

### D3 — No code changes

This feature only writes documentation. No source code, tests, or configs are
modified. The spec intentionally avoids touching `src/` or `tests/`.

### D4 — Information sourced from the codebase

Every section in `ARCHITECTURE.md` is derived from reading the actual source
files. No speculative or aspirational content is included. If the codebase
changes, `ARCHITECTURE.md` must be updated to match.

## Alternatives discarded

| Alternative | Reason discarded |
|---|---|
| Merge into `docs/architecture.md` | That file is prescriptive policy; mixing descriptive state would dilute its purpose |
| Auto-generate from code | Adds build complexity; no precedent in project; hard to capture "concerns" automatically |
| Place under `specs/` | Specs are per-feature and temporary; ARCHITECTURE.md is permanent and cross-cutting |
| Use YAML/TOML instead of Markdown | Project convention is Markdown for all human-readable docs |

## Reference

- `docs/architecture.md` — prescriptive rules (do not add deps, atomic
  persistence, stateless CLI, no mocks)
- `docs/conventions.md` — style (snake_case modules, `[name].test.ts` test
  files, vitest runner, temp files not mocks)