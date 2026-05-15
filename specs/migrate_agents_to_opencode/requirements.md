# Requirements — migrate_agents_to_opencode

> This feature migrates the project harness from OpenCode to OpenCode.

## R1

The system SHALL rename the `.opencode/` directory to `.opencode/`.

## R2

The system SHALL update all occurrences of `.opencode/` to `.opencode/` in all text files within the repository.

## R3

The system SHALL update `.opencode/opencode.json` (formerly `.opencode/opencode.json`) to use English strings for all comments, descriptions, and console messages.

## R4

The system SHALL update the commands in `.opencode/opencode.json` to reflect the TypeScript/Node.js tech stack (e.g., using `npm test` instead of `python3 -m unittest`).

## R5

The system SHALL update the permissions in `.opencode/opencode.json` to allow the new Node.js/TS commands.

## R6

The system SHALL ensure that the `init.sh` script continues to pass after all changes are applied.

## Traceability with `acceptance` from feature_list.json

| Acceptance criterion (feature #8)                                                          | Covered by     |
| ------------------------------------------------------------------------------------------ | -------------- |
| Opencode provider is used instead of Claude                                                | R1, R2         |
| AGENTS.md reflects this change                                                             | R2             |
| Opencode can read properly all the instructions that are currently inside .opencode folder | R1, R3, R4, R5 |
