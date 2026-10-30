---
name: design-review
description: Reviews the running Student Management System interface against docs/DESIGN_SYSTEM.md using browser screenshots at several widths, then fixes the differences. Use after any UI change, before declaring a screen finished, or when the interface looks generic.
---

# Design review

## Goal

Catch visual and UX problems that code review cannot, and fix them in a short loop.

## Instructions

1. Start the app (`npm run dev`) and open it in the browser.
2. Capture screenshots of these states at **1440px, 768px and 390px** wide:
   - Populated list, loading skeleton, empty (no data), empty (no matches), error
   - Add drawer (clean and with validation errors), edit drawer
   - ID card, delete confirmation, a toast
3. Review each screenshot against this checklist:
   - Only palette colors, only the two typefaces, only the four radii.
   - One focal point per screen. The ID card is the only showpiece.
   - Alignment and spacing follow the 4px scale. Nothing touches an edge.
   - No clipped, overlapping or mid-word-broken text. Long names and emails are handled.
   - Contrast is readable. Focus ring is visible in keyboard navigation.
   - Copy is sentence case, specific, and uses the action verbs from the design system.
   - Nothing on the "Never do this" list (design system section 10).
4. List the problems found, ranked by severity.
5. Fix the top issues in code, re-capture, and re-check. Stop after three iterations or when the checklist is clean.
6. Report with before and after screenshots and what changed.

## Constraints

- Fix by editing tokens or components, never with one-off overrides.
- Do not redesign. Match the design system, do not reinvent it.
