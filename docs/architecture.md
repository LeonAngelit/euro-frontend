# Architecture — What "doing a good job" means here

> Complexity is the enemy of automation. This project follows a "Less but
> better" architecture to be easily understood by agents.

## Core Principles

1. **The Source of Truth is the Disk**: No databases, no external caches.
   Everything is a JSON file on disk. If it's not on disk, it doesn't exist.
2. **Atomic Persistence**: Operations that write to disk MUST be atomic
   (write to temp + rename). We never leave the main file in a corrupt state.
3. **Pure Domain Logic**: The logic for creating/editing notes is separated
   from the storage and the CLI.
4. **Verifiable UI**: Every CLI command must be testable via `child_process`
   subshell with predictable exit codes.

## Project Structure (src/)

| Module       | Responsibility                                                                 |
|--------------|--------------------------------------------------------------------------------|
| `notes.ts`   | Domain model. Note structure, immutable logic, and data validation.            |
| `storage.ts` | Technical layer. Atomic read/write from/to the JSON file.                      |
| `cli.ts`     | User Interface. Commands, flag parsing, and user formatting.                   |

## Tech Stack Selection

We use **TypeScript/Node.js** with **Vitest** for a very specific reason:
The development cycle is extremely fast, types provide a first layer of
verification, and Vitest's output is clean and agent-friendly.

## Evolutionary Rules

- **Do not add new dependencies**: Every new feature must be solved with
  `commander.js` and Node's built-in modules (`fs`, `path`, `crypto`).
- **Do not use mocks**: In this project, we prefer using temporary files
  rather than mocking the filesystem. This ensures our "atomic write"
  logic is actually working.
- **Stateless CLI**: The CLI does not maintain state between calls beyond
  the JSON file itself.
