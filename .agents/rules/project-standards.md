# Project standards (always on)

These rules apply to every file you write in this workspace. If a task seems to require breaking one, stop and explain why instead of breaking it silently.

## Code quality

- TypeScript `strict: true` on client and server. No `any`, no `@ts-ignore`, no non-null assertions without a comment explaining why.
- One responsibility per function and per file. Functions stay under 40 lines, files under 250 lines. Split before exceeding.
- Name things by intent: `findStudentByEmail`, not `getData`. No abbreviations except `id`, `url`, `db`, `api`.
- Use early returns instead of nested conditionals. No boolean parameters that flip behavior (use two functions or an options object).
- No magic numbers or strings. Shared values live in a named constant (`PAGE_SIZE_DEFAULT`, `GPA_MAX`).
- No commented-out code, no stray `console.log`, no `TODO` without an issue reference. Use the logger on the server.
- Prefer named exports. One React component per file, file named after the component.
- Imports ordered: node/external, internal absolute, relative. Remove unused imports.
- Handle every error path deliberately. Never swallow an error with an empty `catch`.

## Architecture

- Server: `routes -> controller -> service -> repository`. Controllers parse input and shape responses only. Services hold business rules. Repositories are the only layer that talks to the database.
- Validation happens once, at the edge, with Zod schemas. Types are derived from schemas (`z.infer`), never written twice.
- Client: feature folders (`features/students/...`). Server state lives in TanStack Query. Form state lives in React Hook Form. Filters live in the URL. Do not mirror server data into `useState`.
- Shared UI primitives live in `components/ui`. Feature components compose them. Feature code never imports from another feature.

## Configuration and security

- All configuration comes from environment variables validated at startup (`config/env.ts`). Commit `.env.example`, never `.env`.
- Server uses `helmet`, a restrictive CORS allow-list, request body size limit, and rate limiting.
- Never build SQL by string concatenation. Never render unsanitized HTML. Never log personal data (emails, phone numbers).

## Git and tooling

- Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`). Small, focused commits.
- ESLint, Prettier and `tsc --noEmit` must pass with zero warnings before any phase counts as finished.
- Dependencies: add only what is needed, pinned by the lockfile. Prefer the standard library when it is enough.

## Documentation

- README stays accurate. Update it in the same change that alters behavior, scripts or structure.
- Public functions with non-obvious behavior get a one-line doc comment explaining why, not what.
