# Personal Web Agent Guide

## Scope

Applies to this repository only (`personal-web`).

## Rule Priority

1. Follow this file first for repository-specific constraints.
2. Use docs in `docs/` for detailed implementation patterns.
3. If a conflict appears, prefer the most specific rule.

## Rule Sync Requirement

- `CLAUDE.md` and `.cursor/rules/critical-rules.md` must stay aligned.
- Whenever one file changes, update the other in the same task/PR to reflect the same rule intent.

## Core Rules

### Components

- Never use raw HTML elements when a UI component exists.
- Resolution order: `src/components/ui/` -> `src/components/core/` -> shadcn (`pnpx shadcn@latest add <name>`) -> build new.
- Use `<Button>` not `<button>`, `<Input>` not `<input>`, `<Separator>` not `<hr>`, and equivalent UI primitives.

### Spacing

- Allowed spacing scale: `0.5`, `1`, `1.5`, `2`, `4`, `6`, `8`.
- Never use `3`, `5`, `7`, `9`.
- If `gap-2` is too tight and `gap-4` too loose, adjust layout structure instead of using `gap-3`.

### Colors

- Always use semantic tokens (`text-muted-foreground`, `bg-muted`, `bg-destructive`, etc.).
- Never use raw Tailwind palette classes (for example `text-gray-500`, `bg-zinc-100`).

### Data Fetching

- Always use `*Suspense` query hooks.
- Wrap suspense usage at route level with `<Suspense fallback={<Spinner />}>`.
- Every mutation must define both:
  - `onSuccess` (invalidate queries + toast)
  - `onError` (toast)

## Reference Docs

| Doc | What it covers |
|-----|----------------|
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Spacing rules, component usage decision tree, color tokens, typography |
| [UI_COMPONENTS.md](docs/UI_COMPONENTS.md) | shadcn/ui component patterns and usage examples |
| [STYLING.md](docs/STYLING.md) | Tailwind v4 setup, `cn()` utility, CVA variants |
| [BEST_PRACTICES.md](docs/BEST_PRACTICES.md) | General coding standards across all layers |
| [FORMS.md](docs/FORMS.md) | React Hook Form + Zod patterns |
| [DATA_FETCHING.md](docs/DATA_FETCHING.md) | TanStack Query, Suspense hooks, mutations |
| [STATE_MANAGEMENT.md](docs/STATE_MANAGEMENT.md) | Server state vs local state guidelines |
| [API_CLIENT.md](docs/API_CLIENT.md) | Kubb-generated client usage and regeneration |
| [ROUTING.md](docs/ROUTING.md) | TanStack Router file-based routing |
| [AUTHENTICATION.md](docs/AUTHENTICATION.md) | Auth flow and route guards |
| [DRAG_DROP.md](docs/DRAG_DROP.md) | Drag and drop patterns |
| [BUILD_DEVELOPMENT.md](docs/BUILD_DEVELOPMENT.md) | Dev server, build, and tooling |
| [PRODUCT.md](docs/PRODUCT.md) | Product overview, users, core business concepts and domain model |
| [CLIENT_ROUTINE.md](docs/CLIENT_ROUTINE.md) | How clients and routines relate (active routine, cloning, assignment) |
| [WHATSAPP_INVITE.md](docs/WHATSAPP_INVITE.md) | Client email activation and resend (legacy doc path) |
| [backlog.md](docs/backlog.md) | Known bugs, improvements, and missing features by page |
