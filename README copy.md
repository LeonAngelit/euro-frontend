# harness-example — Notes CLI

Example project demonstrating **Harness Engineering** principles applied to a minimalist notes CLI in TypeScript.

> The application code is deliberately simple. The importance of this repo
> is not **what** it does, but **how** it is structured so that an AI agent
> can work on it autonomously and verifiably.

## How the Harness is Organized

| Pillar                              | Manifestation in this repo                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| **1. The Repository IS the System** | `AGENTS.md`, `init.sh`, `feature_list.json`, `specs/`, `progress/`, `docs/`     |
| **2. Multi-Agent Orchestration**    | `.opencode/agents/leader.md`, `spec_author.md`, `implementer.md`, `reviewer.md` |
| **3. Spec Driven Development**      | `docs/specs.md`, EARS notation, human approval gate at `spec_ready`             |
| **4. Supervision and Improvement**  | `CHECKPOINTS.md`, hooks in `.opencode/opencode.json`, `tests/`                  |

## Getting Started

```bash
./init.sh
```

If everything is green, open `AGENTS.md` and follow from there.

## Using the App (Humans)

```bash
npx tsx src/cli.ts add "buy bread" --body "and milk"
npx tsx src/cli.ts list
```

## Try it yourself with OpenCode

If you download the repo and open OpenCode in the root, you are already inside the harness: `OPENCODE.md` forces the model to act as a `leader` (orchestrates, doesn't edit code) and `docs/specs.md` imposes the Spec Driven Development flow.

Quick recipe:

1. `./init.sh` — must finish green.
2. Open `feature_list.json` and leave at least one feature with
   `status: "pending"` and `"sdd": true`. Features #8 to #11 are already like this.
3. Launch OpenCode in the root of the repo: `opencode`.
4. Ask it: **"implement the next pending feature"**.

What happens, in two phases:

**Phase 1 — Spec.** The `leader` launches a `spec_author` that writes
`specs/<feature>/{requirements.md, design.md, tasks.md}` and leaves the feature
in `spec_ready`. Then it **stops and asks for your approval**.

You read the three files in your editor:

- `requirements.md` — what the feature should do, in strict EARS.
- `design.md` — technical decisions before writing code.
- `tasks.md` — checklist of discrete steps to execute.

When you are satisfied, say "approved" (or ask for changes) in the chat.

**Phase 2 — Code.** The `leader` transitions the feature to `in_progress` and
launches `implementer` (follows the tasks one by one marking them `[x]`) and
then `reviewer` (verifies `R<n>` ↔ test traceability and all tasks completed).

Where the trace of each sub-agent is stored:

| File                              | Who writes it      | Content                                                            |
| --------------------------------- | ------------------ | ------------------------------------------------------------------ |
| `specs/<feature>/requirements.md` | spec_author        | Numbered EARS requirements `R1`, `R2`, ...                         |
| `specs/<feature>/design.md`       | spec_author        | Technical decisions + discarded alternative                        |
| `specs/<feature>/tasks.md`        | spec_author        | Checklist; the implementer marks them `[x]`                        |
| `progress/current.md`             | leader             | Living session plan                                                |
| `progress/impl_<feature>.md`      | implementer        | Files touched + `R<n> → test` map + test output                    |
| `progress/review_<feature>.md`    | reviewer           | Checklist against `docs/`, `specs/<feature>/` and `CHECKPOINTS.md` |
| `feature_list.json`               | leader/implementer | `pending` → `spec_ready` → `in_progress` → `done`                  |
| `progress/history.md`             | leader             | Append-only summary when closing the session                       |

Open `specs/` and `progress/` in your editor while OpenCode works: each
report appears as soon as the sub-agent finishes. That's the
anti-broken-phone rule in action — content doesn't circulate via chat,
it lives on disk and is versioned.

## Structure

```
.
├── AGENTS.md              # Map for agents (progressive disclosure)
├── CHECKPOINTS.md         # "Correct final state" criteria
├── feature_list.json      # Scope: one feature at a time
├── init.sh                # Verification and initialization
├── specs/<feature>/       # Spec per feature (Kiro-style)
│   ├── requirements.md    # EARS notation
│   ├── design.md          # Technical decisions
│   └── tasks.md           # Implementation checklist
├── progress/
│   ├── current.md         # Active session (living state)
│   └── history.md         # Append-only log
├── docs/
│   ├── architecture.md    # What "good work" means
│   ├── conventions.md     # Style, naming, errors
│   ├── specs.md           # SDD process: EARS, 3 files, human approval
│   └── verification.md    # How to demonstrate it works
├── .opencode/
│   ├── agents/            # leader, spec_author, implementer, reviewer
│   └── opencode.json      # Hooks that automate verification
├── src/
│   ├── storage.ts         # Atomic persistence (JSON)
│   ├── notes.ts           # Domain model
│   └── cli.ts             # Commander.js interface
└── tests/
    ├── storage.test.ts
    ├── notes.test.ts
    └── cli.test.ts
```

## Insights this project illustrates

- **Progressive disclosure** in `AGENTS.md`: the agent doesn't get all rules
  at once; it gets a map to find them on demand.
- **One feature at a time** validated by `init.sh` (rejects more than one
  `in_progress` in `feature_list.json`).
- **Spec Driven Development** Kiro-style: requirements (EARS) → design →
  tasks → code, with a human approval gate before touching code.
- **State on disk**, not in chat: `specs/`, `progress/current.md`, and
  `history.md` survive restarts and blown context windows.
- **Executable verification**: `init.sh` runs real tests and validates
  the presence of specs for every SDD feature.
- **Mandatory traceability**: each `R<n>` maps to a concrete test;
  the reviewer rejects if missing.
- **Leader-Spec-Implementer-Reviewer pattern**: the leader doesn't implement,
  the spec_author doesn't code, the implementer doesn't self-approve, the
  reviewer doesn't edit code.
- **Anti-Broken-Phone**: sub-agents write results to files and only return
  a lightweight reference.
