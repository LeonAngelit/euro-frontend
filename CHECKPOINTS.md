# CHECKPOINTS — Final State Evaluation

> In multi-agent systems, we don't evaluate the journey, we evaluate the destination.
> These are the objective checkpoints that a judge (human or AI) can use
> to decide if the project is healthy.

## C1 — The Harness is Complete

- [ ] The 4 base files exist: `AGENTS.md`, `init.sh`, `feature_list.json`,
      `progress/current.md`.
- [ ] The 3 docs exist: `docs/architecture.md`, `docs/conventions.md`,
      `docs/verification.md`.
- [ ] `./init.sh` finishes with exit code 0.

## C2 — The State is Consistent

- [ ] At most one feature is `in_progress` in `feature_list.json`.
- [ ] Every `done` feature has associated passing tests.
- [ ] `progress/current.md` is empty or describes the active session
      (it doesn't contain trash from previous sessions).

## C3 — The Code Respects the Architecture

- [ ] `src/` only contains the modules planned in `docs/architecture.md`.
- [ ] There are no external dependencies in `package.json` (except dev tools).
- [ ] No loose `console.log()` for debug, no TODOs without context.

## C4 — Verification is Real

- [ ] `tests/` has at least one test per module in `src/`.
- [ ] Tests use temporary files/directories, not fs mocks.
- [ ] `npm test` shows > 0 tests and all green.

## C5 — Session Closed Correctly

- [ ] No suspicious untracked files (`*.tmp`, `node_modules` outside `.gitignore`).
- [ ] `progress/history.md` has an entry for the last session.
- [ ] The last feature worked on is reflected in its correct status.

## C6 — Spec Driven Development

- [ ] Every feature with `"sdd": true` in `spec_ready`, `in_progress`,
      or `done` status has its `specs/<name>/` folder with the 3 files:
      `requirements.md`, `design.md`, `tasks.md`.
- [ ] `requirements.md` uses strict EARS (see `docs/specs.md`).
- [ ] Every `done` feature with `"sdd": true` has all its tasks marked
      `[x]` in `tasks.md`.
- [ ] Each `R<n>` from `requirements.md` is covered by at least one
      concrete test in `tests/`.

---

**How to use this file:** a reviewer agent (`.opencode/agents/reviewer.md`)
goes through each checkbox, marks `[x]` or `[ ]`, and rejects the session
closure if any boxes remain empty in C1-C6.
