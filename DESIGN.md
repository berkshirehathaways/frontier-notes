# Frontier Notes Design System

## 1. Atmosphere & Identity

Frontier Notes feels like a quiet technical magazine: editorial, archival, and slightly terminal-like. The signature is paper-toned density with hard rules, restrained accent, and media treated as evidence rather than decoration.

## 2. Color

### Palette

| Role | Token | Light | Usage |
|------|-------|-------|-------|
| Background | `--bg` | `#f2efe7` | Main paper background |
| Background soft | `--bg-soft` | `#f7f5ee` | Softer paper surface |
| Surface | `--surface` | `#fbfaf6` | Cards and panels |
| Surface strong | `--surface-strong` | `#ffffff` | Strong emphasis surfaces |
| Text primary | `--text` | `#0d0d0d` | Headlines and body |
| Text muted | `--muted` | `#5a5a5a` | Secondary text |
| Text faint | `--faint` | `#8e8e8e` | Metadata and hints |
| Border | `--line` | `#d1ccc2` | Default dividers |
| Border strong | `--line-strong` | `#afab9f` | Section dividers |
| Border accent | `--line-accent` | `#0d0d0d` | Editorial rules |
| Accent | `--accent` | `#c8f260` | Current badges and rare emphasis |
| Accent text | `--accent-text` | `#3a6200` | Text on accent |
| Tag | `--tag` | `#e8e4da` | Tag background |
| Tag text | `--tag-text` | `#3b3b3b` | Tag text |

### Rules

- Accent color stays under 5 percent of the visible surface.
- New colors must be added here before use.
- Borders and tonal contrast carry hierarchy. Shadows are not used.

## 3. Typography

### Scale

| Level | Token | Size | Usage |
|-------|-------|------|-------|
| 2XS | `--text-2xs` | `0.64rem` | Metadata, overlines |
| XS | `--text-xs` | `0.72rem` | Captions |
| SM | `--text-sm` | `0.82rem` | Compact body |
| Base | `--text-base` | `1rem` | Default body |
| MD | `--text-md` | `1.08rem` | Lead body |
| LG | `--text-lg` | `1.22rem` | Small headings |
| XL | `--text-xl` | `1.45rem` | Card headings |
| 2XL | `--text-2xl` | `1.85rem` | Section headings |
| 3XL | `--text-3xl` | `2.5rem` | Page headings |
| 4XL | `--text-4xl` | `3.4rem` | Editorial display |
| 5XL | `--text-5xl` | `4.2rem` | Reserved display |

### Font Stack

- Sans: `--font-sans`
- Serif: `--font-serif`
- Mono: `--font-mono`

### Rules

- Editorial titles use the serif stack.
- Metadata and issue labels use the mono stack.
- Korean text uses `word-break: keep-all` where wrapping quality matters.

## 4. Spacing & Layout

### Base Unit

Spacing is based on 4px increments.

| Token | Value | Usage |
|-------|-------|-------|
| `--sp-1` | `0.25rem` | Tight inline gaps |
| `--sp-2` | `0.5rem` | Compact list gaps |
| `--sp-3` | `0.75rem` | Small block gaps |
| `--sp-4` | `1rem` | Standard spacing |
| `--sp-5` | `1.25rem` | Comfortable spacing |
| `--sp-6` | `1.5rem` | Section inner spacing |
| `--sp-8` | `2rem` | Major block spacing |
| `--sp-10` | `2.5rem` | Page rhythm |
| `--sp-12` | `3rem` | Major sections |
| `--sp-16` | `4rem` | Reserved large sections |

### Grid

- Site shell max width: `1280px`.
- Primary breakpoints: `1024px`, `900px`, `768px`.
- Editorial layouts favor CSS Grid and hard divider lines.

## 5. Components

### Issue Detail Cover

- **Structure**: an image inside `.issue-cover`.
- **Spacing**: follows the issue header grid gap.
- **Behavior**: render at the source image ratio. Do not use `object-fit: cover` for screenshot-like evidence images because it can crop readable text.
- **Accessibility**: image `alt` text names the issue title or scene.

### Issue Lists

- **Structure**: metadata column plus content column.
- **Spacing**: compact, rule-separated rows.
- **Behavior**: Korean titles use `word-break: keep-all` and `overflow-wrap: break-word`.

## 6. Motion & Interaction

### Timing

| Type | Duration | Usage |
|------|----------|-------|
| Micro | `0.12s` | Link color and underline feedback |
| Standard | `200-300ms` | Future panel or menu transitions |

### Rules

- Animate only `transform`, `opacity`, or color.
- Focus rings use the primary text color and must remain visible.

## 7. Depth & Surface

### Strategy

Borders-only.

| Type | Token | Usage |
|------|-------|-------|
| Thin | `--border-thin` | Cards and subtle dividers |
| Mid | `--border-mid` | Emphasis dividers |
| Strong | `--border-strong` | Editorial section rules |

No `box-shadow` is used. Depth is expressed with paper tones, hard rules, and spacing.
