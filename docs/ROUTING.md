# Routing

This document describes routing patterns and practices using TanStack Router.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## TanStack Router

The application uses **TanStack Router** with file-based routing. Routes are defined as files in `src/routes/` directory.

## Route Structure

```
routes/
├── __root.tsx              # Root route (provides QueryClientProvider)
├── index.tsx                # Home/landing page
├── _auth/                   # Auth layout route
│   ├── route.tsx           # Auth layout (redirects if authenticated)
│   ├── sign-in.tsx          # Sign in page
│   ├── sign-up.tsx          # Sign up page
│   ├── request-reset-password.tsx
│   └── reset-password.tsx
├── trainer/                 # Trainer layout route
│   ├── route.tsx           # Trainer layout (requires auth)
│   ├── home.tsx            # Trainer dashboard
│   ├── analytics.tsx       # Analytics dashboard
│   ├── exercises.tsx       # Exercises list
│   ├── clients.tsx         # Clients list
│   ├── routines/           # Routines routes
│   │   ├── route.tsx
│   │   ├── index.tsx       # Routines list
│   │   └── $routineId.tsx  # Routine detail
│   ├── workouts/
│   │   └── $workoutId.tsx   # Workout detail
│   └── anamnesis/
│       ├── _anamnesisLayout.tsx   # Layout route, renders /trainer/anamnesis
│       └── $anamnesisId.tsx       # /trainer/anamnesis/:id (detail/modal)
└── client/                  # Client layout route
    └── home.tsx            # Client dashboard
```

## Route Configuration

### Root Route

**File**: `src/routes/__root.tsx`

```typescript
export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <Outlet />
    </QueryClientProvider>
  ),
});
```

The root route provides:
- QueryClientProvider for TanStack Query
- Toast notifications (Sonner)
- Outlet for child routes

### Protected Route

**File**: `src/routes/trainer/route.tsx`

```typescript
export const Route = createFileRoute("/trainer")(
  component: TrainerDashboardLayout,
  beforeLoad: async () => {
    const data = await cachedSession();
    if (!data?.session) {
      throw redirect({ to: "/sign-in" });
    }
  },
});
```

Protected routes use `beforeLoad` to check authentication before rendering.

### Auth Layout Route

**File**: `src/routes/_auth/route.tsx`

```typescript
export const Route = createFileRoute("/_auth")(
  component: Layout,
  beforeLoad: async () => {
    const data = await cachedSession();
    if (data?.session) {
      // Redirect based on user type
      const redirectTo =
        data.user?.type === "member" ? "/client/home" : "/trainer/home";
      throw redirect({ to: redirectTo });
    }
  },
});
```

Auth routes redirect authenticated users away from sign-in/sign-up pages.

## Pathless Layout Routes within a Segment

When a group of URLs sharing the same path prefix need a shared layout (header, tabs, context) **without** that layout adding its own path segment, use a **pathless layout route** named with an underscore: `_layoutName`.

This is different from the root-level `_auth` pattern — here the underscore layout lives *inside* a named segment.

```
routes/trainer/clients/
├── _clientLayout.tsx              → layout wrapper (renders header + tabs + <Outlet />)
├── _clientLayout.index.tsx        → matches /trainer/clients       (list)
├── _clientLayout.$clientId.tsx    → matches /trainer/clients/:id   (detail)
└── $clientId/
    └── ...                        → sub-routes outside the layout
```

The layout file renders both the shared UI and an `<Outlet>` for the active child:

```tsx
// src/routes/trainer/clients/_clientLayout.tsx
export const Route = createFileRoute('/trainer/clients/_clientLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <ClientsLayoutPage />  {/* shared header + tab bar */}
      <Outlet />
    </>
  )
}
```

Child routes opt into the layout by including the layout name in their filename:

```tsx
// _clientLayout.index.tsx  → /trainer/clients
export const Route = createFileRoute('/trainer/clients/_clientLayout/')({ ... })

// _clientLayout.$clientId.tsx  → /trainer/clients/:clientId
export const Route = createFileRoute('/trainer/clients/_clientLayout/$clientId')({ ... })
```

Routes that should **not** share the layout are siblings of the layout file, not children.

**When to use this pattern**: any time two or more URLs under the same prefix need a tab bar, breadcrumb, or contextual header. If a route segment has only a single page (no sub-routes), use a plain layout route without `<Outlet>` instead.

## Route Features

### Type-Safe Navigation

All routes are typed. Navigation is type-safe:

```typescript
import { Link, useNavigate } from "@tanstack/react-router";

// Type-safe link
<Link to="/trainer/routines/$routineId" params={{ routineId: "123" }}>
  View Routine
</Link>

// Type-safe navigation
const navigate = useNavigate();
navigate({ to: "/trainer/exercises" });
```

### Route Loaders

Data loading before route renders (using React Query Suspense):

```typescript
export const Route = createFileRoute("/trainer/routines/$routineId")(
  loader: ({ params }) => {
    return queryClient.ensureQueryData({
      queryKey: getApiRoutineByIdSuspenseQueryKey(params.routineId),
      queryFn: () => getApiRoutineById(params.routineId),
    });
  },
  component: RoutineDetail,
});
```

### Route Guards

Use `beforeLoad` for authentication checks:

```typescript
beforeLoad: async () => {
  const data = await cachedSession();
  if (!data?.session) {
    throw redirect({ to: "/sign-in" });
  }
}
```

### Code Splitting

Automatic code splitting per route - each route is loaded on demand.

### Scroll Restoration

Automatic scroll position restoration when navigating back/forward.

### Preloading

Intent-based preloading configured in router:

```typescript
const router = createRouter({
  routeTree,
  defaultPreload: "intent", // Preload on hover/focus
  scrollRestoration: true,
});
```

## Route Parameters

### Path Parameters

```typescript
// Route file: routes/trainer/routines/$routineId.tsx
export const Route = createFileRoute("/trainer/routines/$routineId")(
  component: RoutineDetail,
});

// In component
function RoutineDetail() {
  const { routineId } = Route.useParams();
  // ...
}
```

### Search Parameters

```typescript
import { useSearch } from "@tanstack/react-router";

function SearchPage() {
  const { search, page } = useSearch({ from: "/search" });
  // URL: /search?search=query&page=1
}
```

## Navigation Patterns

### Programmatic Navigation

```typescript
import { useNavigate } from "@tanstack/react-router";

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate({
      to: "/trainer/routines/$routineId",
      params: { routineId: "123" },
    });
  };
}
```

### Link Component

```typescript
import { Link } from "@tanstack/react-router";

<Link
  to="/trainer/routines/$routineId"
  params={{ routineId: routine.id }}
  className="..."
>
  View Routine
</Link>
```

## Suspense Boundaries in Route Components

When a route component (or a component it renders) uses a Suspense query (`useSuspenseQuery` / `*Suspense` hooks), it **must** be wrapped in a `<Suspense>` boundary. Without it, the thrown Promise bubbles up to TanStack Router's internal boundary, which renders nothing — causing a visible blank-page blink during navigation.

```tsx
// ✅ Correct — Suspense boundary wraps the suspense-query component
function RouteComponent() {
  const { clientId } = Route.useParams();
  return (
    <>
      <Suspense fallback={<Spinner className="size-8" />}>
        <ClientLayout clientId={clientId} />
      </Suspense>
      <Outlet />
    </>
  );
}

// ❌ Wrong — no boundary; causes blank page blink on navigation
function RouteComponent() {
  const { clientId } = Route.useParams();
  return (
    <>
      <ClientLayout clientId={clientId} /> {/* uses useGetApiClientByIdSuspense internally */}
      <Outlet />
    </>
  );
}
```

Use the existing `<Spinner />` component (`@/components/ui/spinner`) as the fallback.

## Modal Routes

A **modal route** is a route whose sole job is to render a dialog. The dialog is driven by a URL, which means:

- The modal can be opened by navigating to the route (e.g. from a list item click).
- The same dialog component is reusable elsewhere without re-importing it inside every parent page.
- The browser Back button (or `router.history.back()`) closes the modal naturally.

### Pattern

```
routes/trainer/anamnesis/
├── _anamnesisLayout.tsx   → /trainer/anamnesis  (list page)
└── $anamnesisId.tsx       → /trainer/anamnesis/:id  (modal route)
```

```tsx
// src/routes/trainer/anamnesis/$anamnesisId.tsx
export const Route = createFileRoute('/trainer/anamnesis/$anamnesisId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { anamnesisId } = Route.useParams()
  const router = useRouter()
  const [open, setOpen] = useState(true)

  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <EditTrainerAnamnesisDialog
        anamnesisId={anamnesisId}
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) router.history.back()
        }}
      />
    </Suspense>
  )
}
```

### Key points

- **`open` starts as `true`**: the dialog opens immediately when the route mounts.
- **`onOpenChange` calls `router.history.back()`**: closing the dialog navigates back, keeping the URL in sync.
- **The dialog component stays decoupled**: it only needs `open` / `onOpenChange` props — it has no awareness of routing.
- **Wrap in `<Suspense>`** if the dialog fetches data with a suspense hook (see [Suspense Boundaries in Route Components](#suspense-boundaries-in-route-components)).

### Opening the modal

Navigate to the route from anywhere — a list item, a button, a link:

```tsx
// From a list item
<Link to="/trainer/anamnesis/$anamnesisId" params={{ anamnesisId: item.id }}>
  Edit
</Link>

// Programmatically
navigate({ to: '/trainer/anamnesis/$anamnesisId', params: { anamnesisId: id } })
```

### When to use

Use this pattern when:
- A dialog needs to be accessible from multiple entry points without duplicating state management.
- The resource has its own identity (an ID in the URL makes sense).
- You want deep-linking or the ability to share/bookmark the open-modal state.

Do **not** use it for ephemeral dialogs (e.g. a confirmation prompt) or dialogs that depend heavily on local parent state that isn't expressible as a URL param.

## Best Practices

- ✅ Use file-based routing structure
- ✅ Protect routes with `beforeLoad` guards
- ✅ Use Suspense queries for route-level data loading
- ✅ Wrap components using Suspense queries in `<Suspense>` boundaries to prevent blank-page blinks
- ✅ Leverage type-safe navigation
- ✅ Use route parameters for dynamic segments
- ✅ Use search parameters for filters/pagination
- ✅ Use pathless layout routes (`_layoutName`) to share headers/tabs across sibling routes without adding a URL segment — only when there are multiple child routes
- ✅ Keep detail pages as siblings of the layout file (not children) when they should not inherit the shared layout
- ✅ Keep route components focused and small
- ✅ Use modal routes (`$id.tsx` renders a dialog) for reusable dialogs that need deep-linking or multiple entry points
