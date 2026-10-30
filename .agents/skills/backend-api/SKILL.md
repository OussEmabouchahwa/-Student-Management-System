---
name: backend-api
description: Builds and reviews the Express, TypeScript, Prisma and Zod REST API for the Student Management System. Use when creating endpoints, schemas, services, repositories, error handling, pagination or database migrations on the server.
---

# Backend API

## Goal

Produce a layered, typed, secure REST API that a reviewer would accept without comments.

## Folder layout

```
server/
  prisma/            schema.prisma, migrations/, seed.ts
  src/
    app.ts           builds the Express app (no listen), used by tests
    server.ts        reads config, calls app.listen
    config/env.ts    Zod-validated environment
    lib/             app-error.ts, logger.ts, prisma.ts
    middleware/      validate.ts, error-handler.ts, not-found.ts
    modules/students/
      students.routes.ts
      students.controller.ts
      students.service.ts
      students.repository.ts
      students.schemas.ts      Zod schemas + inferred types
      students.service.test.ts
      students.routes.test.ts
```

## Instructions

1. **Schemas first.** Define `createStudentSchema`, `updateStudentSchema` (partial, at least one field), `listStudentsQuerySchema` and `idParamSchema` in `students.schemas.ts`. Derive types with `z.infer`. Trim strings, lowercase emails, coerce numbers in query strings.
2. **Repository** wraps Prisma. It returns plain objects and never throws HTTP errors. Translate Prisma's unique-constraint error (`P2002`) into a domain error in the service.
3. **Service** applies business rules and throws `AppError` with a stable `code` (`STUDENT_NOT_FOUND`, `EMAIL_TAKEN`). It never imports Express types.
4. **Controller** is thin: read validated input, call the service, send the response. Wrap handlers so rejected promises reach the error handler.
5. **Routes** register `GET /students/courses` before `GET /students/:id`, otherwise `courses` is parsed as an id.
6. **Error handler** is the only place that turns errors into responses. Shape: `{ "error": { "code", "message", "fields"? } }`. Unknown errors become 500 with a generic message and a logged stack.
7. **Pagination** uses `page` and `limit` (default 10, maximum 50). Return `{ data, meta: { page, limit, total, totalPages } }`. Sorting accepts an allow-list (`lastName`, `course`, `year`, `gpa`, `createdAt`) with `:asc` or `:desc`. Never pass raw user input to `orderBy`.
8. **Search** matches first name, last name, email and course case-insensitively.
9. **Status codes**: 200 read and update, 201 create, 204 delete, 400 validation, 404 missing, 409 duplicate email, 500 unexpected.
10. **Security**: `helmet`, CORS allow-list from env, `express.json({ limit: "10kb" })`, `express-rate-limit` on the API router, graceful shutdown on `SIGTERM`.
11. **Observability**: `pino` logger with request id, no personal data in logs. `GET /health` returns `{ status: "ok" }`.
12. **Migrations** are generated with `prisma migrate dev`, committed, and named for what they do. `seed.ts` inserts 12 realistic, diverse students and is idempotent.

## Constraints

- Do not put business logic in controllers or routes.
- Do not return Prisma models directly if they contain fields the API should not expose. Map them.
- Do not catch an error just to rethrow it unchanged.
