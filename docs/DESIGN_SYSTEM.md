# Design System: Student Register

Single source of truth for how the interface looks and behaves. Components must consume **tokens**, never raw values.

## 1. Concept

A registrar's office, not a SaaS dashboard. Calm ink-navy on cool paper, a serious serif for names and titles, and one highlighter-yellow accent that appears only where it carries meaning (search matches and the student ID portrait). The memorable element is the **Student ID card** shown in the details view. Everything else stays quiet.

Principles:

1. **Information first.** Tables, numbers and names are the content. Chrome stays out of the way.
2. **One bold moment.** The ID card. Do not add a second showpiece.
3. **Structure is information.** Borders, dividers and the dashed ID tear line exist because they mean something.
4. **Plain language.** Name things the way a registrar would say them.

## 2. Color tokens

| Token             | Hex       | Use                                  | Contrast               |
| ----------------- | --------- | ------------------------------------ | ---------------------- |
| `--ground`        | `#EFF1F6` | Page background                      | n/a                    |
| `--paper`         | `#FFFFFF` | Surfaces, inputs, table              | n/a                    |
| `--ink`           | `#101A33` | Primary text                         | 16.5:1 on paper        |
| `--ink-2`         | `#4A5472` | Secondary text, icons                | 7.4:1 on paper         |
| `--rule`          | `#DADFEA` | Dividers, table lines                | decorative             |
| `--rule-strong`   | `#AEB7CC` | Input and button borders             | 3:1 or better on paper |
| `--navy`          | `#16245C` | Primary action, ID card header       | 14:1 with white        |
| `--navy-deep`     | `#0E1A4A` | Primary hover and pressed            |                        |
| `--tint`          | `#E7EAF6` | Avatar background, icon-button hover |                        |
| `--marker`        | `#FFD23F` | Search highlight, ID portrait only   | ink on marker 11:1     |
| `--danger`        | `#B42318` | Errors, destructive action           | 6.3:1 on paper         |
| `--danger-soft`   | `#FDECEA` | Destructive hover background         |                        |
| `--surface-hover` | `#F7F8FC` | Row hover, table header              |                        |

Never introduce another hue. No gradients. No tinted near-black text.

## 3. Typography

| Role                                     | Family                | Size / line-height                    | Weight                       |
| ---------------------------------------- | --------------------- | ------------------------------------- | ---------------------------- |
| Display (page title)                     | Crimson Pro           | `clamp(2.4rem, 5.5vw, 3.4rem)` / 1.02 | 600, letter-spacing -0.015em |
| Heading 2 (drawer, empty state, ID name) | Crimson Pro           | 2rem / 1.1                            | 600                          |
| Heading 3                                | Crimson Pro           | 1.5rem / 1.15                         | 600                          |
| Body                                     | Atkinson Hyperlegible | 1rem / 1.5                            | 400                          |
| Strong and labels                        | Atkinson Hyperlegible | 0.95rem to 1rem                       | 700                          |
| Small and helper                         | Atkinson Hyperlegible | 0.875rem / 1.45                       | 400                          |

Rules: sentence case everywhere, no all-caps labels, `font-variant-numeric: tabular-nums` on every number, maximum line length 70ch. The serif is for names, titles and initials only. Load both fonts with `font-display: swap` and fallbacks `Georgia, serif` and `system-ui, sans-serif`.

## 4. Spacing, radius, elevation

- Spacing scale (4px base): 4, 8, 12, 16, 20, 24, 32, 40, 56, 72.
- Radius: `--r-sm` 6px (tags), `--r-md` 8px (inputs, buttons), `--r-lg` 14px (table container, dialogs), `--r-xl` 18px (ID card). Use no other radii.
- Elevation: three levels only (`--shadow-drawer`, `--shadow-dialog`, `--shadow-card`). The table and inputs have **no shadow**, only borders.

## 5. Motion

- Only motion that answers a user action: drawer slide-in (220ms, `cubic-bezier(.2,.8,.2,1)`), dialog fade, toast, hover color changes (120 to 150ms).
- No page-load sequences, no scroll reveals, no row entrance animations.
- Animate `transform` and `opacity` only.
- Honor `prefers-reduced-motion: reduce` by dropping durations to about 0.

## 6. Layout

- Content max-width 1040px, centered. Text is left-aligned.
- Page padding `clamp(16px, 4vw, 32px)`.
- Breakpoints: 760px (table becomes stacked entries) and 1040px (container cap).
- Below 760px the table becomes a stacked list: name and email on the first line, course on its own line, year and GPA beneath, actions pinned top-right. The email truncates with an ellipsis.

## 7. Components

Every component needs these states where relevant: default, hover, focus-visible, active, disabled, loading, error.

- **Button.** Variants: primary (navy), secondary (paper with strong border), destructive (danger fill). Height 44px, radius 8px, bold 0.95rem. Icon and label gap 8px. Loading replaces the label with a spinner and keeps the width.
- **IconButton.** 40px (44px on coarse pointers), transparent, tint hover. The destructive variant hovers `--danger-soft`. Always has an `aria-label` naming the person ("Edit Amira Ben Salah").
- **Field.** Visible label above, helper text below, error text below in danger. Uses `aria-invalid` and `aria-describedby`. Optional fields say "(optional)" in secondary text.
- **Input and Select.** 44px high, 1px strong border, focus ring `3px solid var(--navy)` with 2px offset. Invalid border is danger.
- **SearchInput.** Leading magnifier icon, clear button when filled, debounced 250ms. Matches are highlighted in rows with `<mark>`.
- **StudentTable.** Container `--paper`, `--r-lg`, 1px rule border. Header row uses `--surface-hover`. Row hover uses `--surface-hover`. Columns: Student (avatar, name, email), Course, Year, GPA, Actions.
- **Avatar.** 40px circle, tint background, navy initials in the serif.
- **GpaMeter.** 64x6px bar on a 0 to 4 scale plus the tabular number. No GPA shows "Not graded" in secondary text.
- **Drawer (add and edit form).** Slides in from the right, 460px maximum, serif title and close button in the header, scrolling body, sticky footer with Cancel and Save. It does **not** close on backdrop click, to protect typed data.
- **StudentIdCard (signature).** Navy header with a lanyard slot at the top, yellow portrait block with serif initials, name in serif, student number `YYYY-NNNN`, two-column definition grid, dashed tear line above the footer actions. Closes on backdrop click and Escape.
- **ConfirmDialog.** Names the student and states the consequence ("will be removed from the register. This can't be undone."). Buttons: "Keep student" and "Delete student".
- **Toast.** Bottom-center, ink background, white bold text, 2.6s, `role="status"`. Wording repeats the action verb: "Added Ada Lovelace", "Saved Ada Lovelace", "Deleted Ada Lovelace".
- **EmptyState.** Serif heading, one sentence, one action. Two variants: no data ("Add student") and no matches ("Clear filters").
- **Skeleton.** Row-shaped placeholders while loading. No full-page spinners.
- **Pagination.** "Showing 1 to 10 of 42" text plus Previous and Next buttons.

## 8. Voice and copy

Active, specific, sentence case. Buttons say what happens ("Save student", not "Submit"). Errors say what is wrong and how to fix it and never apologize. Use realistic, diverse example names. Never use "Lorem ipsum" or "John Doe".

## 9. Accessibility (WCAG 2.2 AA)

- Contrast 4.5:1 for text, 3:1 for UI boundaries.
- Full keyboard operation with visible focus everywhere.
- Focus moves into dialogs and returns to the trigger when they close.
- Errors are announced (`role="alert"`) and linked to their fields.
- Touch targets are at least 44x44px.
- Never rely on color alone (the GPA bar always has the number next to it).

## 10. Never do this

Gradients or gradient text, glassmorphism, neon accents, dark mode by default, tracked-out ALL-CAPS eyebrows, emoji as icons, grids of identical shadowed cards, a hero banner, decorative blobs, default Tailwind indigo or blue, scattered entrance animations, radii outside the four above, raw hex values inside components.

## 11. Token implementation

`client/src/styles/tokens.css`:

```css
:root {
  --ground: #eff1f6;
  --paper: #ffffff;
  --ink: #101a33;
  --ink-2: #4a5472;
  --rule: #dadfea;
  --rule-strong: #aeb7cc;
  --navy: #16245c;
  --navy-deep: #0e1a4a;
  --tint: #e7eaf6;
  --marker: #ffd23f;
  --danger: #b42318;
  --danger-soft: #fdecea;
  --surface-hover: #f7f8fc;

  --font-serif: "Crimson Pro", Georgia, "Times New Roman", serif;
  --font-sans: "Atkinson Hyperlegible", system-ui, -apple-system, "Segoe UI", sans-serif;

  --r-sm: 6px;
  --r-md: 8px;
  --r-lg: 14px;
  --r-xl: 18px;

  --shadow-drawer: -16px 0 48px rgb(16 26 51 / 0.14);
  --shadow-dialog: 0 24px 60px rgb(16 26 51 / 0.3);
  --shadow-card: 0 28px 70px rgb(16 26 51 / 0.35);

  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur-fast: 120ms;
  --dur-base: 220ms;
  color-scheme: light;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-fast: 0.01ms;
    --dur-base: 0.01ms;
  }
}
```

Map every token in `tailwind.config.ts` (`theme.extend.colors.ink = "var(--ink)"` and so on) so utilities such as `bg-paper text-ink border-rule` are the only way colors reach components.
