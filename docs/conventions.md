# Conventions — Style and Standards

> Consistency is more important than personal preference. These rules
> ensure the code looks like it was written by one person (or one agent).

## TypeScript Style

- **Use ESM**: Always use `import/export` and `.js` extensions in imports (as per Node.js ESM rules).
- **Explicit Types**: Use interfaces/types for domain models.
- **Async/Await**: Always use the promise-based version of `node:fs` and async/await.
- **No classes unless necessary**: Use simple functions and interfaces for the domain. The `Note` class is allowed for factory methods.

## File Naming

- **Source**: `snake_case` or `kebab-case`? The current project uses `src/cli.ts`, `src/notes.ts`. We will stick to `snake_case` for modules if they become more complex, but single names are preferred.
- **Tests**: `[name].test.ts`.

## Test Conventions

- Use `vitest` for all tests.
- One test file per source module.
- Each test uses a temporary file and cleans up after itself.
- Descriptive test names: `test_load_returns_empty_when_file_missing`.

## Error Handling

Domain exceptions in `src/notes.ts`:

```typescript
export class NoteError extends Error { ... }
export class NoteNotFound extends NoteError { ... }
```

The CLI catches domain exceptions, prints a message to `stderr`, and exits
with code 1. Never propagate stack traces to the user.

## Comments

By default **do not** write them. Only allowed when they explain a
non-obvious *why* (e.g., documented workaround, subtle invariant). Names should
do the rest.
