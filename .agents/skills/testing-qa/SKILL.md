---
name: testing-qa
description: Writes and runs unit, integration, component and end-to-end tests for the Student Management System using Vitest, Supertest, Testing Library and Playwright. Use when adding features, fixing bugs, checking coverage or verifying that a phase is complete.
---

# Testing and QA

## Goal

Every behavior that matters has a test that fails when the behavior breaks. Tests read like documentation.

## Instructions

1. **Pyramid.** Many fast unit tests, a solid set of API integration tests, focused component tests, and one Playwright end-to-end path.
2. **Server unit tests** (Vitest) cover the service layer with a fake repository: duplicate email, not found, update with no fields, pagination math.
3. **Server integration tests** (Vitest + Supertest) call `createApp()` against a temporary SQLite database that is migrated before the suite and cleaned between tests. Cover every route and every status code in the API contract, including 400 field errors, 404 and 409.
4. **Client unit tests** cover `lib/format.ts` and the form schema.
5. **Component tests** (Vitest + Testing Library) query by role and accessible name, never by CSS class or test id unless unavoidable. Cover: table renders rows, search highlights matches, empty and error states, form shows server errors under the right field, delete requires confirmation.
6. **End-to-end** (Playwright, one spec): add a student, find it by search, open its ID card, edit it, delete it with confirmation. Run against a seeded test database.
7. **Naming.** `it("returns 409 when the email already exists")`. Describe behavior, not implementation.
8. **Targets.** At least 80% line coverage on `modules/students/*.service.ts` and `lib/format.ts`. Do not chase coverage on glue code.
9. **Flakiness.** No arbitrary sleeps. Wait on roles, text or network responses.
10. **Reporting.** After a run, summarize: tests passed and failed, coverage numbers, and any behavior that is untested and why.

## Commands

```
npm run test           unit and integration, both workspaces
npm run test:e2e       Playwright
npm run test:coverage  coverage report
```

## Constraints

- Never edit a test to make it pass without explaining what behavior changed.
- Never mock what you can run for real (the database, the Express app).
