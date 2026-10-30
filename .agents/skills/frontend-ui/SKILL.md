---
name: frontend-ui
description: Builds the React, TypeScript, Tailwind interface for the Student Management System according to docs/DESIGN_SYSTEM.md. Use when creating or changing components, screens, forms, tables, dialogs, styling, loading and empty states, or client-side data fetching.
---

# Frontend UI

## Goal

Build an interface that is accessible, responsive and visually consistent with `docs/DESIGN_SYSTEM.md`, with clean separation between UI, state and data access.

## Folder layout

```
client/src/
  app/                 App.tsx, providers.tsx (QueryClient, Toaster)
  components/ui/       Button, IconButton, Field, Input, Select, Drawer,
                       Dialog, ConfirmDialog, Toast, Skeleton, EmptyState
  features/students/
    api/               students.api.ts, students.keys.ts
    components/        StudentTable, StudentRow, StudentFormDrawer,
                       StudentIdCard, StudentFilters, GpaMeter, Avatar
    hooks/             useStudents, useStudentMutations, useStudentFilters
    schemas/           student-form.schema.ts
    types.ts
  lib/                 http.ts, cn.ts, format.ts
  styles/              tokens.css, globals.css
```

## Instructions

1. **Tokens before components.** Create `tokens.css`, wire Tailwind to the variables, load the two fonts, and build `components/ui` primitives. Only then build the feature.
2. **Primitives** use Radix UI (`@radix-ui/react-dialog`, `react-alert-dialog`, `react-select` or native select) for focus trapping and ARIA, styled with tokens. Do not hand-roll focus management.
3. **Data access.** `http.ts` wraps `fetch`, parses the API error shape and throws a typed `ApiError`. `students.api.ts` exposes typed functions. `students.keys.ts` defines query keys.
4. **Server state** uses TanStack Query. Mutations invalidate the list and show a toast. Use `placeholderData: keepPreviousData` for pagination so the table does not flash.
5. **Filters in the URL.** `q`, `course`, `sort`, `page` live in search params so views are shareable and survive refresh. Debounce search input by 250ms.
6. **Forms.** React Hook Form with a Zod resolver whose rules mirror the server's. Server field errors (`error.fields`) are mapped back onto fields with `setError`. Focus the first invalid field on submit. Disable Save and show a spinner while pending.
7. **Table.** Semantic `<table>` with `<th scope="col">`. Student names are real buttons that open the ID card. Row actions are icon buttons with descriptive `aria-label`s. Highlight search matches with `<mark>`, escaping everything else.
8. **States.** Skeleton rows while loading, `EmptyState` for no data and no matches, an inline error panel with a "Try again" button on failure. Never show a blank screen.
9. **Responsive.** Follow section 6 of the design system: stacked entries below 760px, drawer becomes full width on phones.
10. **Accessibility.** Run through section 9 of the design system. Return focus to the triggering element when a dialog closes.
11. **Formatting helpers** (`formatGpa`, `formatStudentNumber`, `formatDate`, `getInitials`) live in `lib/format.ts` with unit tests.

## Constraints

- No raw colors, no inline styles except for dynamic values such as the GPA bar width.
- No `useEffect` for data fetching. No copying query data into local state.
- No component over 150 lines. Extract.
