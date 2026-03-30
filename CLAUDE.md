# Project Guide

## Documentation

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

## Critical rules (always apply)

### Components
- **Never use raw HTML elements when a UI component exists.** Check `src/components/ui/` first, then `src/components/core/`, then shadcn (`pnpx shadcn@latest add <name>`), then build.
- Use `<Button>` not `<button>`, `<Input>` not `<input>`, `<Separator>` not `<hr>`, etc.
- See the full component inventory in [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

### Spacing
- Only use spacing values from the core scale: `0.5`, `1`, `1.5`, `2`, `4`, `6`, `8`.
- **Never use `3`, `5`, `7`, `9`** — these are in-between values that break visual consistency.
- When `gap-2` feels too tight and `gap-4` feels too loose, fix the layout — don't reach for `gap-3`.

### Colors
- Always use semantic tokens (`text-muted-foreground`, `bg-muted`, `bg-destructive`, etc.).
- Never use raw Tailwind palette colors (`text-gray-500`, `bg-zinc-100`, etc.).

### Data fetching
- Always use `*Suspense` hooks (e.g. `useGetApiClientsSuspense`), never the non-suspense variants.
- Wrap suspense components in `<Suspense fallback={<Spinner />}>` at the route level.
- Always handle `onSuccess` (invalidate + toast) and `onError` (toast) on every mutation.
