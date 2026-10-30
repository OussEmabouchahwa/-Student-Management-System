---
description: Run every quality gate and report the result
---

1. From the repository root run `npm run lint`, `npm run typecheck` and `npm run test`. Report failures with file and line.
2. Run `npm run build` for both workspaces.
3. Start the app with `npm run dev` and confirm `GET /health` returns `{ "status": "ok" }`.
4. Run `npm run test:e2e`.
5. Check that `README.md` matches the real scripts, structure and API.
6. Produce a short report: gates passed, gates failed, and the next action for each failure.
