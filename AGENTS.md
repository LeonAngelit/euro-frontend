# AGENTS.md — Navigation map for AI agents

> This file is the **entry point** for any agent working on this
> repository. It is NOT a bible of rules: it is a **map**. Read only what
> you need when you need it (progressive disclosure).

---

## 1. Before you start (mandatory)

1. Run `./init.sh` and verify that it finishes without errors. If it fails, **stop**
   and resolve the environment before touching code.
2. Read `progress/current.md` to understand the state of the last session.
3. Read `feature_list.json`. Every new feature (`"sdd": true`) goes through
   **Spec Driven Development** — see `docs/specs.md` and §4 of this file.
4. Read `docs/specs.md` before touching any spec or feature `sdd: true`.

## 2. Repository Map

| File / Folder          | Content                                                                               | When to read it                                    |
| ---------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `feature_list.json`    | Task list with status (`pending` / `spec_ready` / `in_progress` / `done` / `blocked`) | Always, at the start                               |
| `ARCHITECTURE.md`      | Technical analysis and project structure details                                      | Before deciding where to make changes              |
| `progress/current.md`  | Current session state                                                                 | Always, at the start                               |
| `progress/history.md`  | Append-only log of previous sessions                                                  | If you need historical context                     |
| `specs/<feature>/`     | `requirements.md` + `design.md` + `tasks.md` (Kiro-style)                             | Before implementing any feature with `"sdd": true` |
| `docs/architecture.md` | What "doing a good job" means in this project                                         | Before implementing                                |
| `docs/conventions.md`  | Style rules, naming, structure                                                        | Before writing code                                |
| `docs/specs.md`        | SDD process: EARS notation, the 3 files, human approval gate                          | Before writing or reading a spec                   |
| `docs/verification.md` | How to verify your work (includes requirement traceability)                           | Before declaring a task as `done`                  |
| `CHECKPOINTS.md`       | Objective criteria for "correct final state"                                          | To self-evaluate                                   |
| `.opencode/agents/`    | Sub-agent definitions (`leader`, `spec_author`, `implementer`, `reviewer`)            | If you orchestrate work                            |
| `src/`                 | Application code                                                                      | To implement                                       |
| `tests/`               | Automated tests                                                                       | To verify                                          |

## 3. Hard Rules (non-negotiable)

- **One feature at a time.** Do not mix changes from multiple tasks in the same session.
- **Do not declare a task `done` without green tests.** Run `./init.sh` and
  ensure that the test block passes 100%.
- **Do not skip the spec phase.** Every feature with `"sdd": true` must pass
  through `spec_author` and obtain human approval before touching code.
- **Do not skip the human approval gate.** The leader stops the flow
  at `spec_ready` and waits.
- **Document what you do** in `progress/current.md` while you work, not at the end.
- **Leave the repository clean** before closing the session (see §5).
- **If you don't know something, look in `docs/`** before inventing it.

## 4. Workflow (SDD)

```
pending → [spec_author] → spec_ready → ⏸ HUMAN → in_progress → [implementer → reviewer] → done
```

1. The leader detects the first `pending` feature with `"sdd": true`.
2. The leader launches `spec_author`, which creates
   `specs/<name>/{requirements,design,tasks}.md` and marks the status as
   `spec_ready`.
3. **Pause.** The human reads the spec in `specs/<name>/` and approves (or asks for changes).
4. Once approved, the leader changes the status to `in_progress` and launches `implementer`.
5. The implementer executes `tasks.md` one by one, marking them `[x]`.
6. The reviewer verifies traceability `R<n>` ↔ test and completed tasks;
   approves or rejects.
7. If approved, the implementer marks `done` and moves the summary to
   `progress/history.md`.

## 5. Session Closure (lifecycle)

Before finishing:

1. Run `./init.sh` — everything green.
2. If the task is finished: mark `status: "done"` in `feature_list.json`.
3. Move the summary from `progress/current.md` to the end of `progress/history.md`.
4. Empty `progress/current.md` leaving only the template.
5. Do not leave temporary files, debug `print()` calls, or TODOs without context.

## 6. If you get blocked

- Re-read the relevant section of `docs/`.
- If the tool doesn't do what you expect, **do not invent a workaround**:
  document the blockage in `progress/current.md` and stop the session.

# context-mode — MANDATORY routing rules

context-mode MCP tools available. Rules protect context window from flooding. One unrouted command dumps 56 KB into context.

## Think in Code — MANDATORY

Analyze/count/filter/compare/search/parse/transform data: **write code** via `context-mode_ctx_execute(language, code)`, `console.log()` only the answer. Do NOT read raw data into context. PROGRAM the analysis, not COMPUTE it. Pure JavaScript — Node.js built-ins only (`fs`, `path`, `child_process`). `try/catch`, handle `null`/`undefined`. One script replaces ten tool calls.

## BLOCKED — do NOT attempt

### curl / wget — BLOCKED

Shell `curl`/`wget` intercepted and blocked. Do NOT retry.
Use: `context-mode_ctx_fetch_and_index(url, source)` or `context-mode_ctx_execute(language: "javascript", code: "const r = await fetch(...)")`

### Inline HTTP — BLOCKED

`fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, `http.request(` — intercepted. Do NOT retry.
Use: `context-mode_ctx_execute(language, code)` — only stdout enters context

### Direct web fetching — BLOCKED

Use: `context-mode_ctx_fetch_and_index(url, source)` then `context-mode_ctx_search(queries)`

## REDIRECTED — use sandbox

### Shell (>20 lines output)

Shell ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`.
Otherwise: `context-mode_ctx_batch_execute(commands, queries)` or `context-mode_ctx_execute(language: "shell", code: "...")`

### File reading (for analysis)

Reading to **edit** → reading correct. Reading to **analyze/explore/summarize** → `context-mode_ctx_execute_file(path, language, code)`.

### grep / search (large results)

Use `context-mode_ctx_execute(language: "shell", code: "grep ...")` in sandbox.

## Tool selection

0. **MEMORY**: `context-mode_ctx_search(sort: "timeline")` — after resume, check prior context before asking user.
1. **GATHER**: `context-mode_ctx_batch_execute(commands, queries)` — runs all commands, auto-indexes, returns search. ONE call replaces 30+. Each command: `{label: "header", command: "..."}`.
2. **FOLLOW-UP**: `context-mode_ctx_search(queries: ["q1", "q2", ...])` — all questions as array, ONE call (default relevance mode).
3. **PROCESSING**: `context-mode_ctx_execute(language, code)` | `context-mode_ctx_execute_file(path, language, code)` — sandbox, only stdout enters context.
4. **WEB**: `context-mode_ctx_fetch_and_index(url, source)` then `context-mode_ctx_search(queries)` — raw HTML never enters context.
5. **INDEX**: `context-mode_ctx_index(content, source)` — store in FTS5 for later search.

## Parallel I/O batches

For multi-URL fetches or multi-API calls, **always** include `concurrency: N` (1-8):

- `context-mode_ctx_batch_execute(commands: [3+ network commands], concurrency: 5)` — gh, curl, dig, docker inspect, multi-region cloud queries
- `context-mode_ctx_fetch_and_index(requests: [{url, source}, ...], concurrency: 5)` — multi-URL batch fetch

**Use concurrency 4-8** for I/O-bound work (network calls, API queries). **Keep concurrency 1** for CPU-bound (npm test, build, lint) or commands sharing state (ports, lock files, same-repo writes).

GitHub API rate-limit: cap at 4 for `gh` calls.

## Output

Write artifacts to FILES — never inline. Return: file path + 1-line description.
Descriptive source labels for `search(source: "label")`.

## Session Continuity

Skills, roles, and decisions persist for the entire session. Do not abandon them as the conversation grows.

## Memory

Session history is persistent and searchable. On resume, search BEFORE asking the user:

| Need                    | Command                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------- |
| What did we decide?     | `context-mode_ctx_search(queries: ["decision"], source: "decision", sort: "timeline")` |
| What constraints exist? | `context-mode_ctx_search(queries: ["constraint"], source: "constraint")`               |

DO NOT ask "what were we working on?" — SEARCH FIRST.
If search returns 0 results, proceed as a fresh session.

## ctx commands

| Command       | Action                                                                        |
| ------------- | ----------------------------------------------------------------------------- |
| `ctx stats`   | Call `stats` MCP tool, display full output verbatim                           |
| `ctx doctor`  | Call `doctor` MCP tool, run returned shell command, display as checklist      |
| `ctx upgrade` | Call `upgrade` MCP tool, run returned shell command, display as checklist     |
| `ctx purge`   | Call `purge` MCP tool with confirm: true. Warns before wiping knowledge base. |

After /clear or /compact: knowledge base and session stats preserved. Use `ctx purge` to start fresh.
