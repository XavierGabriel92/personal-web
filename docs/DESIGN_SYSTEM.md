# Design System

This document defines the visual and layout conventions for the application.
It supplements [STYLING.md](./STYLING.md) with concrete rules about spacing, typography, and color usage.

---

## Component usage: the decision tree

Before writing any UI element from scratch, follow this order:

```
1. Does src/components/ui/ have it?  →  use it
2. Does src/components/core/ have it? →  use it
3. Is there a shadcn/ui component?    →  install it with pnpx shadcn@latest add <name>
4. None of the above                  →  build it, place it in src/components/ui/
```

Never reach for a raw HTML element when a UI component already exists.

### What is already available

**`src/components/ui/`** — all shadcn/ui components installed so far:

| Component file          | What it covers                                         |
|------------------------|--------------------------------------------------------|
| `button.tsx`           | All clickable actions                                  |
| `input.tsx`            | Text inputs                                            |
| `textarea.tsx`         | Multi-line text inputs                                 |
| `select.tsx`           | Single-select dropdowns                                |
| `multi-select.tsx`     | Multi-select dropdowns                                 |
| `checkbox.tsx`         | Checkboxes                                             |
| `switch.tsx`           | Toggle switches                                        |
| `label.tsx`            | Form labels                                            |
| `field.tsx`            | Field wrappers (label + input + error)                 |
| `form.tsx`             | React Hook Form integration                            |
| `card.tsx`             | Card surfaces                                          |
| `dialog.tsx`           | Modal dialogs                                          |
| `alert-dialog.tsx`     | Confirmation / non-dismissable dialogs                 |
| `sheet.tsx`            | Side panels                                            |
| `dropdown-menu.tsx`    | Dropdown menus                                         |
| `popover.tsx`          | Floating content anchored to a trigger                 |
| `progress.tsx`         | Progress bar (Radix UI primitive)                      |
| `tooltip.tsx`          | Hover tooltips                                         |
| `tabs.tsx`             | Tab navigation                                         |
| `table.tsx`            | Data tables                                            |
| `badge.tsx`            | Status/label badges                                    |
| `avatar.tsx`           | User avatars                                           |
| `alert.tsx`            | Inline alert banners                                   |
| `separator.tsx`        | Horizontal / vertical dividers                         |
| `skeleton.tsx`         | Loading placeholders                                   |
| `spinner.tsx`          | Loading spinners                                       |
| `empty.tsx`            | Empty-state illustrations                              |
| `scroll-area.tsx`      | Custom scrollable containers                           |
| `collapsible.tsx`      | Expand/collapse sections                               |
| `command.tsx`          | Command palette / search                               |
| `breadcrumb.tsx`       | Breadcrumb navigation                                  |
| `calendar.tsx`         | Date picker calendar                                   |
| `date-picker.tsx`      | Date picker input                                      |
| `chart.tsx`            | Recharts wrapper                                       |
| `button-group.tsx`     | Grouped button rows                                    |
| `sidebar.tsx`          | App sidebar shell                                      |
| `img-file-uploader.tsx`| Image upload with preview                             |
| `video-file-uploader.tsx`| Video upload with preview                           |
| `typography.tsx`       | Headings and text primitives                           |
| `sonner.tsx`           | Toast notifications (via Sonner)                       |

**`src/components/core/`** — shared product-level primitives:

| Component file  | What it covers              |
|----------------|--------------------------|
| `page-title.tsx`| Page-level heading          |

### Common mistakes

```tsx
// ❌ Raw button element
<button onClick={handleClick} className="bg-primary text-white px-4 py-2 rounded">
  Save
</button>

// ✅ Button component
<Button onClick={handleClick}>Save</Button>
```

```tsx
// ❌ Raw input element
<input type="text" className="border rounded px-2 py-1" />

// ✅ Input component
<Input type="text" />
```

```tsx
// ❌ Raw hr element
<hr className="border-t border-gray-200 my-4" />

// ✅ Separator component
<Separator className="my-4" />
```

```tsx
// ❌ Rolling a custom spinner
<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary" />

// ✅ Spinner component
<Spinner />
```

```tsx
// ❌ Custom empty-state div
<div className="text-center text-muted-foreground py-8">No items found</div>

// ✅ Empty component
<Empty message="No items found" />
```

```tsx
// ❌ Rolling a custom progress bar
<div className="h-2 bg-muted rounded-full">
  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
</div>

// ✅ Progress component
import { Progress } from "@/components/ui/progress";
<Progress value={pct} className="h-1.5" />
```

### Installing a new shadcn component

If what you need is not in `src/components/ui/` but exists in shadcn:

```bash
pnpx shadcn@latest add <component-name>
# e.g.
pnpx shadcn@latest add accordion
pnpx shadcn@latest add progress
pnpx shadcn@latest add toggle
```

Browse available components at https://ui.shadcn.com/docs/components.
After installing, the component lands in `src/components/ui/` and is ready to use.

### Building a new component

Only build from scratch when shadcn does not have an equivalent.
Place it in `src/components/ui/` if it is generic (no business logic), or in
the relevant feature folder (e.g. `src/components/exercise/`) if it is domain-specific.

---

## Spacing

### The rule: stick to the core scale

Only use values from this scale:

| Token | rem   | Use case                                      |
|-------|-------|-----------------------------------------------|
| `0.5` | 0.125 | Hairline gaps (e.g. between badge and icon)   |
| `1`   | 0.25  | Tight icon/label pairs, dense list items      |
| `1.5` | 0.375 | Button inner padding (py), compact rows       |
| `2`   | 0.5   | Default gap between related elements          |
| `4`   | 1.0   | Default padding inside cards/sheets/dialogs   |
| `6`   | 1.5   | Larger section padding (dialog `p-6`)         |
| `8`   | 2.0   | Page-level padding, major section separation  |

### ❌ Avoid odd in-between values

Do **not** use `3`, `5`, `7`, `9` as standalone spacing. These sit between
two well-defined scale steps and produce visually inconsistent results.

```tsx
// ❌ Avoid
<div className="gap-3 p-3 space-y-5">

// ✅ Prefer — round down to 2 for tight spacing
<div className="gap-2 p-2 space-y-4">

// ✅ Prefer — round up to 4 for comfortable spacing
<div className="gap-4 p-4 space-y-4">
```

If `gap-2` feels too tight and `gap-4` feels too loose, that is usually a
sign that the layout itself needs adjustment (e.g. a separator, a heading, or
a different grouping), not that `gap-3` is the right fix.

### Fractional exceptions (`.5`)

`0.5`, `1.5`, `2.5`, and `3.5` are allowed as precision overrides for
specific Radix UI / shadcn internal patterns (e.g. `py-1.5` on menu items).
Do not introduce them in product-level components.

### Common patterns

```tsx
// Items inside a card section
<CardContent className="px-4">
  <div className="flex flex-col gap-2">...</div>
</CardContent>

// Form field group
<FieldGroup className="space-y-4">
  <Field>...</Field>
  <Field>...</Field>
</FieldGroup>

// Horizontal toolbar / action row
<div className="flex items-center gap-2">
  <Button>...</Button>
  <Button variant="outline">...</Button>
</div>

// Page-level section separation
<div className="flex flex-col gap-6">
  <section>...</section>
  <section>...</section>
</div>
```

---

## Component-level padding reference

| Component        | Padding              |
|-----------------|----------------------|
| `CardContent`   | `px-4`, `py-4`       |
| `CardHeader`    | `px-4`, `gap-2`      |
| `DialogContent` | `p-6`, `gap-4`       |
| `SheetHeader`   | `p-4`, `gap-1.5`     |
| `SheetFooter`   | `p-4`, `gap-2`       |

Keep padding consistent with these values when building new layouts that
live inside these containers — do not add extra padding on child wrappers.

---

## Typography

Use the semantic scale from `src/components/ui/typography.tsx` and Tailwind's
text utilities. Do not mix arbitrary font sizes.

| Usage                   | Class                         |
|------------------------|-------------------------------|
| Page title              | `text-2xl font-semibold`      |
| Section heading         | `text-lg font-semibold`       |
| Card title              | `text-sm font-medium`         |
| Body / default          | `text-sm` (Tailwind default)  |
| Muted / helper text     | `text-sm text-muted-foreground` |
| Label                   | `text-xs font-medium`         |

---

## Color

Always use semantic color tokens — never raw hex or arbitrary Tailwind colors.

| Token                   | When to use                                    |
|------------------------|------------------------------------------------|
| `bg-background`         | Page / root background                         |
| `bg-card`               | Card surfaces                                  |
| `bg-muted`              | Subtle backgrounds (empty states, sidebars)    |
| `bg-primary`            | Primary actions                                |
| `bg-destructive`        | Delete / irreversible actions                  |
| `text-foreground`       | Default text                                   |
| `text-muted-foreground` | Secondary / helper text                        |
| `text-primary`          | Highlighted / branded text                     |
| `text-destructive`      | Error text, required field markers             |
| `border`                | Default border color                           |
| `border-input`          | Input borders                                  |

```tsx
// ❌ Avoid
<p className="text-gray-500">Helper text</p>
<div className="bg-zinc-100">...</div>

// ✅ Use semantic tokens
<p className="text-muted-foreground">Helper text</p>
<div className="bg-muted">...</div>
```

---

## Icons

- Always pair icons with text or provide an `aria-label` when used alone.
- Use `size-4` (1rem) as the default icon size inside buttons and list items.
- Use `size-5` for standalone icons and larger touch targets.
- Keep icon and label in a `flex items-center gap-2` wrapper.

```tsx
// ✅ Icon + label
<div className="flex items-center gap-2">
  <PlusIcon className="size-4" />
  <span>Add exercise</span>
</div>

// ✅ Icon-only button (must have aria-label)
<Button variant="ghost" size="icon" aria-label="Delete">
  <TrashIcon className="size-4" />
</Button>
```
