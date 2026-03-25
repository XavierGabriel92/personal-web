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
│       ├── _anamnesisLayout.tsx          # Pathless layout (header + tabs)
│       ├── _anamnesisLayout.index.tsx    # /trainer/anamnesis (list)
│       ├── _anamnesisLayout.templates.tsx # /trainer/anamnesis/templates
│       └── $anamnesisId.tsx              # /trainer/anamnesis/:id (detail)
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
export const Route = createFileRoute("/trainer")({
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
export const Route = createFileRoute("/_auth")({
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
routes/trainer/anamnesis/
├── _anamnesisLayout.tsx          → layout wrapper (renders header + tabs + <Outlet />)
├── _anamnesisLayout.index.tsx    → matches /trainer/anamnesis      (list)
├── _anamnesisLayout.templates.tsx → matches /trainer/anamnesis/templates
└── $anamnesisId.tsx              → matches /trainer/anamnesis/:id  (outside the layout)
```

The layout file renders both the shared UI and an `<Outlet>` for the active child:

```tsx
// src/routes/trainer/anamnesis/_anamnesisLayout.tsx
export const Route = createFileRoute('/trainer/anamnesis/_anamnesisLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AnamnesisLayoutPage />  {/* shared header + tab bar */}
      <Outlet />
    </>
  )
}
```

Child routes opt into the layout by including the layout name in their filename:

```tsx
// _anamnesisLayout.index.tsx  → /trainer/anamnesis
export const Route = createFileRoute('/trainer/anamnesis/_anamnesisLayout/')({ ... })

// _anamnesisLayout.templates.tsx  → /trainer/anamnesis/templates
export const Route = createFileRoute('/trainer/anamnesis/_anamnesisLayout/templates')({ ... })
```

Routes that should **not** share the layout (e.g. the detail page) are siblings of the layout file, not children:

```tsx
// $anamnesisId.tsx  → /trainer/anamnesis/:anamnesisId (no shared layout)
export const Route = createFileRoute('/trainer/anamnesis/$anamnesisId')({ ... })
```

**When to use this pattern**: any time two or more URLs under the same prefix need a tab bar, breadcrumb, or contextual header that the detail/sub-pages should not share.

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
export const Route = createFileRoute("/trainer/routines/$routineId")({
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
export const Route = createFileRoute("/trainer/routines/$routineId")({
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

## Best Practices

- ✅ Use file-based routing structure
- ✅ Protect routes with `beforeLoad` guards
- ✅ Use Suspense queries for route-level data loading
- ✅ Wrap components using Suspense queries in `<Suspense>` boundaries to prevent blank-page blinks
- ✅ Leverage type-safe navigation
- ✅ Use route parameters for dynamic segments
- ✅ Use search parameters for filters/pagination
- ✅ Use pathless layout routes (`_layoutName`) to share headers/tabs across sibling routes without adding a URL segment
- ✅ Keep detail pages as siblings of the layout file (not children) when they should not inherit the shared layout
- ✅ Keep route components focused and small
