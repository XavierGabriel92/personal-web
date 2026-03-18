# State Management

This document describes state management patterns in the application.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## State Management Strategy

The application uses different state management approaches for different types of state:

1. **Server State**: TanStack Query
2. **Client State**: React State
3. **URL State**: TanStack Router
4. **Form State**: React Hook Form

## Server State: TanStack Query

All server state is managed by TanStack Query. See [DATA_FETCHING.md](./DATA_FETCHING.md) for details.

```typescript
import { useGetApiRoutines } from "@/gen";

function RoutinesList() {
  const { data, isLoading, error } = useGetApiRoutines();
  // Server state managed by TanStack Query
}
```

## Client State: React State

Local component state uses React hooks:

```typescript
import { useState, useEffect, useCallback, useMemo } from "react";

function MyComponent() {
  const [localState, setLocalState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  const handleAction = useCallback(() => {
    // Memoized callback
  }, [dependencies]);
  
  const computedValue = useMemo(() => {
    // Expensive computation
    return compute(localState);
  }, [localState]);
}
```

### When to Use React State

- ✅ UI state (modals, dropdowns, toggles)
- ✅ Form input state (handled by React Hook Form)
- ✅ Component-specific state
- ✅ Temporary state that doesn't need persistence

### When NOT to Use React State

- ❌ Server data (use TanStack Query)
- ❌ Shareable state (use URL state or context)
- ❌ Form state (use React Hook Form)

## URL State: TanStack Router

Query parameters managed by TanStack Router:

```typescript
import { useSearch } from "@tanstack/react-router";

function SearchPage() {
  const { search, page } = useSearch({ from: "/search" });
  // URL: /search?search=query&page=1
  
  const navigate = useNavigate();
  
  const updateSearch = (newSearch: string) => {
    navigate({
      search: { search: newSearch, page: 1 },
    });
  };
}
```

### When to Use URL State

- ✅ Filters that should be shareable/bookmarkable
- ✅ Pagination state
- ✅ Search queries
- ✅ View preferences (list/grid, sort order)

## Form State: React Hook Form

Form state managed by React Hook Form. See [FORMS.md](./FORMS.md) for details.

```typescript
import { useForm } from "react-hook-form";

function MyForm() {
  const form = useForm<FormData>({
    defaultValues: { /* ... */ },
  });
  
  // Form state managed by React Hook Form
}
```

## Context API (When Needed)

For shared state across components, use React Context:

```typescript
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

### When to Use Context

- ✅ Theme preferences
- ✅ User preferences
- ✅ Shared UI state (sidebar open/closed)
- ✅ Avoid prop drilling

### When NOT to Use Context

- ❌ Server data (use TanStack Query)
- ❌ Form state (use React Hook Form)
- ❌ URL state (use TanStack Router)

## State Management Patterns

### Optimistic Updates

For better UX, update UI optimistically:

```typescript
const handleDrag = (reorderedItems: WorkoutExercise[]) => {
  const queryKey = getApiWorkoutByIdSuspenseQueryKey(workoutId);
  const oldData = queryClient.getQueryData(queryKey);
  
  // Optimistically update cache
  queryClient.setQueryData(queryKey, (old) => ({
    ...old,
    exercises: reorderedItems,
  }));
  
  // Then call API
  reorderExercises(
    { data: { exerciseWorkouts: exercisesData } },
    {
      onSuccess: (response) => {
        queryClient.setQueryData(queryKey, response);
      },
      onError: () => {
        // Rollback on error
        queryClient.setQueryData(queryKey, oldData);
      },
    }
  );
};
```

### Derived State

Compute state from other state:

```typescript
const filteredItems = useMemo(() => {
  return items.filter((item) => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );
}, [items, search]);
```

### State Lifting

Lift state up to the nearest common ancestor:

```typescript
function Parent() {
  const [sharedState, setSharedState] = useState();
  
  return (
    <>
      <Child1 state={sharedState} setState={setSharedState} />
      <Child2 state={sharedState} setState={setSharedState} />
    </>
  );
}
```

## Best Practices

- ✅ Use TanStack Query for server state
- ✅ Use React state for local UI state
- ✅ Use URL state for shareable/filterable state
- ✅ Use React Hook Form for form state
- ✅ Use Context sparingly (only when needed)
- ✅ Avoid prop drilling (use context or state management)
- ✅ Implement optimistic updates for better UX
- ✅ Use useMemo for expensive computations
- ✅ Use useCallback for event handlers passed to children
- ✅ Keep state as close to where it's used as possible
- ✅ Lift state up only when necessary

