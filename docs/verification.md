# Verification — How to Demonstrate the Work Functions

> Golden rule: **the agent does not say "it works", it proves it**.
> Every feature ends with executable evidence, not assertions.

## Verification Levels

### Level 1 — Unit Tests (Mandatory)

Every public function in `src/` has at least one test in `tests/` that:

1. Covers the happy path.
2. Covers at least one error path if the function can fail.

Command:
```bash
npm test
```

### Level 2 — CLI Integration Test (Mandatory for UI Features)

Features that add commands to the CLI are verified by executing the real
CLI against a temporary file:

```typescript
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
// ...
const res = spawnSync('npx', ['tsx', 'src/cli.ts', 'add', 'hello'], {
  env: { ...process.env, NOTES_FILE: testFilePath },
  encoding: 'utf-8',
});
expect(res.status).toBe(0);
expect(res.stdout).toContain('id=1');
```

### Level 3 — Manual Smoke Test (Optional but Recommended)

Before closing the session, run an end-to-end flow with a temporary file
in `/tmp`:

```bash
NOTES_FILE=/tmp/notes_demo.json npx tsx src/cli.ts add "test" --body "x"
NOTES_FILE=/tmp/notes_demo.json npx tsx src/cli.ts list
rm /tmp/notes_demo.json
```

### Level 4 — Requirements Traceability (Mandatory for `"sdd": true` Features)

Each `R<n>` from `specs/<name>/requirements.md` must be mappable to at
least one concrete test in `tests/`. The reviewer rejects if coverage
is missing.

The implementer documents the map in `progress/impl_<name>.md`:

```markdown
## Traceability
- R1 → `test_recent_default_limit`
- R2 → `test_recent_invalid_limit`
- R3 → `test_recent_custom_limit`
```

## Anti-patterns (Do Not Do)

- ❌ "I've added the command, it should work." → missing executable test.
- ❌ Test that only verifies the function doesn't throw an exception. → it
  must check the concrete result.
- ❌ `mock` of the filesystem. → use real temporary files/directories.
- ❌ Marking the feature as `done` without passing `./init.sh`.

## Final Verification Before Closing

```bash
./init.sh           # must finish with [OK] Environment ready
```

If `./init.sh` is red, **do not** mark anything as `done`. Note the
blockage in `progress/current.md` with a `blocked` status in
`feature_list.json`.
