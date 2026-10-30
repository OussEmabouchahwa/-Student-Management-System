# Design guardrails (always on for any UI work)

The full specification is `docs/DESIGN_SYSTEM.md`. Read it before touching UI. These are the non-negotiables.

## Must

- Colors, radii, shadows, fonts and durations come from tokens in `client/src/styles/tokens.css`, exposed through Tailwind. A raw hex value or arbitrary Tailwind color inside a component is a bug.
- Use Crimson Pro for display text, names and initials, and Atkinson Hyperlegible for everything else.
- Every interactive element has hover, `focus-visible`, active and disabled states.
- Every data view has loading (skeleton), empty, error and populated states.
- Touch targets are at least 44x44px. Text contrast is at least 4.5:1.
- Icons are SVG from `lucide-react`, with `aria-hidden` when decorative and an `aria-label` when they stand alone.
- Numbers use tabular figures. Copy is sentence case, specific and written for a registrar.
- Respect `prefers-reduced-motion`. Animate only `transform` and `opacity`, and only in response to a user action.

## Must not

- Gradients, glassmorphism, neon accents, decorative blobs, hero banners.
- ALL-CAPS tracked-out labels, an eyebrow above every heading, "Welcome to..." headlines.
- Emoji as icons or bullets.
- Identical shadowed card grids. The student list is a table.
- Default Tailwind blue or indigo, or any color outside the palette.
- Placeholder content such as "Lorem ipsum" or "John Doe".
- More than one signature moment. The ID card is it.

## Self-check before you finish a screen

Open the screen in the browser at 1440px, 768px and 390px. If it could be mistaken for a generic admin template, it is not finished.
