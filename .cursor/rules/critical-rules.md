---
description: Critical project rules for personal-web
globs:
  - "**/*"
alwaysApply: true
---

# personal-web Critical Rules

Source of truth: `CLAUDE.md` and docs in `docs/`.

## Rule Sync Requirement

- Keep this file synchronized with `CLAUDE.md`.
- If `CLAUDE.md` changes, update this rule file in the same task/PR.
- If this rule file changes, mirror the intent in `CLAUDE.md` in the same task/PR.

## Components

- Never use raw HTML when an existing UI component exists.
- Resolution order: `src/components/ui/` -> `src/components/core/` -> shadcn -> custom component.
- Prefer component primitives like `Button`, `Input`, `Separator`, etc.

## Spacing

- Only use spacing scale values: `0.5`, `1`, `1.5`, `2`, `4`, `6`, `8`.
- Never use `3`, `5`, `7`, `9`.
- If spacing feels in-between, fix layout structure instead of introducing forbidden spacing values.

## Colors

- Use semantic tokens only (`text-muted-foreground`, `bg-muted`, `bg-destructive`, etc.).
- Do not use raw Tailwind palette colors (`text-gray-*`, `bg-zinc-*`, etc.).

## Data Fetching and Mutations

- Use suspense query hooks (`*Suspense`) and avoid non-suspense variants.
- Route-level suspense boundaries must include `<Suspense fallback={<Spinner />}>`.
- Every mutation must define:
  - `onSuccess` with invalidation and toast.
  - `onError` with toast.
