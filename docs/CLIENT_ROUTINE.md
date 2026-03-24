# Client-Routine Integration

## Overview

Each client can have one **active routine** — a cloned copy of a trainer's library routine (or one created from scratch). The client's `activeRoutineId` field points to this routine.

See the backend doc at `personal-ai-api/docs/client-routine.md` for the data model and cloning logic.

## Client Tabs

The trainer's client detail view has tabs driven by `src/components/clients/tab/index.tsx`. Each tab maps a URL segment to a tab value:

| URL segment | Tab value | Label |
|---|---|---|
| *(default)* | tab-1 | Overview / profile |
| `workout-session` | tab-2 | Treinos realizados |
| `weight-evolution` | tab-4 | Evolução de Carga |

Clicking a tab navigates to the corresponding sub-route under `/trainer/clients/$clientId/`.

## Client Workout-Session Page

`src/pages/trainer/client/workout-session.tsx` renders the trainer's view of a client's session history. It wraps `WorkoutFrequencyCalendar` in a `<Suspense>` boundary.

```tsx
// src/pages/trainer/client/workout-session.tsx
export default function TrainerClientProgramsPage({ clientId }: TrainerClientProgramsPageProps) {
  return (
    <Suspense fallback={<Spinner className="size-6" />}>
      <WorkoutFrequencyCalendar clientId={clientId} />
    </Suspense>
  );
}
```

## Client Weight-Evolution Page

`src/pages/trainer/client/weight-evolution.tsx` renders a per-exercise weight progression chart. It wraps `WeightEvolution` in a `<Suspense>` boundary.

```tsx
// src/pages/trainer/client/weight-evolution.tsx
export default function WeightEvolutionPage({ clientId }: WeightEvolutionPageProps) {
  return (
    <Suspense fallback={<Spinner className="size-6" />}>
      <WeightEvolution clientId={clientId} />
    </Suspense>
  );
}
```

## Components

### `WorkoutFrequencyCalendar` (`src/components/workout-history/frequency-calendar.tsx`)

Shows a shadcn `<Calendar>` with workout days highlighted. Clicking a highlighted day reveals a `SessionCard` with that session's details.

- Fetches sessions for the **currently displayed month** — re-fetches whenever the trainer navigates months.
- Uses `useSuspenseQuery` with the generated query options directly (not the `useXxxSuspense` hook shorthand):

```tsx
import { getApiSessionsClientByClientIdQueryOptions } from '@/gen/hooks/useGetApiSessionsClientByClientId';
import { useSuspenseQuery } from '@tanstack/react-query';

const { data } = useSuspenseQuery(
  getApiSessionsClientByClientIdQueryOptions(clientId, { since, until })
);
```

This pattern (passing query options to `useSuspenseQuery` directly) is equivalent to calling the generated `useGetApiSessionsClientByClientIdSuspense` hook and is useful when you need to construct the query options object separately before calling the hook.

- `since` / `until` are computed from the first/last millisecond of the displayed month.
- Workout days are highlighted with `modifiers={{ workout: workoutDays }}` on the Calendar component.
- The calendar uses `ptBR` locale from `date-fns/locale`.
- A footer on the calendar shows a legend and a "Hoje" button to jump back to the current month.
- A summary below the calendar shows the session count for the displayed month: `{n} treino(s) em {monthName}`.

### `WeightEvolution` (`src/components/workout-history/weight-evolution.tsx`)

Shows a month-based exercise selector and a recharts `LineChart` of max weight per session for the selected exercise.

**Layout**: exercise list panel (left) + chart panel (right), same side-by-side pattern as `WorkoutFrequencyCalendar`.

**Month navigation**: prev/next chevron buttons + "Hoje" button. Changing month resets the selected exercise.

**Exercise list**: filtered by a search `<Input>`. Exercises are extracted from session data, so only exercises actually performed in the displayed month are shown.

**Chart**: plots `{ date, weight }` points where `weight` is the max `weight_kg` across all sets for that exercise in a session. Sessions where every set has `weight_kg === 0` are excluded.

```tsx
import { useSuspenseQuery } from '@tanstack/react-query';
import { getApiSessionsClientByClientIdQueryOptions } from '@/gen/hooks/useGetApiSessionsClientByClientId';
import { extractUniqueExercises, buildWeightEvolution } from '@/components/workout-history/weight-evolution';

// Inside component:
const { data } = useSuspenseQuery(
  getApiSessionsClientByClientIdQueryOptions(clientId, { since, until })
);
const exercises = extractUniqueExercises(data.sessions);
const chartData = buildWeightEvolution(data.sessions, selectedExerciseId);
```

**Exported helpers** (testable in isolation):

```ts
// Returns unique exercises sorted alphabetically by name (pt-BR collation)
export function extractUniqueExercises(
  sessions: Session[]
): { id: string; name: string; thumbnailUrl?: string }[]

// Returns [{ date: "d MMM", weight: number }] ordered by session date.
// Points where maxWeight === 0 are excluded.
export function buildWeightEvolution(
  sessions: Session[],
  exerciseId: string
): { date: string; weight: number }[]
```

**Chart setup** (recharts via shadcn `ChartContainer`):

```tsx
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  weight: { label: 'Carga máx.', color: 'var(--chart-1)' },
} satisfies ChartConfig;

<ChartContainer config={chartConfig} className="h-[280px] w-full">
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
    <YAxis
      tickLine={false} axisLine={false} tickMargin={8}
      tickFormatter={(v) => `${v}kg`}
      domain={[(min) => Math.floor(min * 0.9), (max) => Math.ceil(max * 1.1)]}
    />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Line dataKey="weight" stroke="var(--color-weight)" strokeWidth={2}
      dot={{ r: 4, fill: 'var(--color-weight)', strokeWidth: 0 }} />
  </LineChart>
</ChartContainer>
```

### `SessionCard` (`src/components/workout-history/session-card.tsx`)

Reusable card that renders a single workout session: name, relative timestamp, duration, total volume, and a collapsible exercise list with sets table. Used by both `WorkoutFrequencyCalendar` and `WorkoutHistoryList`.

### `ActiveProgram` (`src/components/routine/active-routine.tsx`)

Shows the client's currently assigned routine (name, workout count, duration) with an edit link, or an empty state with a "Criar programa" button. This component is no longer rendered on the default client program tab — it may be embedded in other contexts.

Data flow:
1. `useGetApiClientByIdSuspense(clientId)` → get `activeRoutineId`
2. `useGetApiRoutineById(activeRoutineId, { query: { enabled: !!activeRoutineId } })` → get routine details (non-suspense because it is conditional)

The component handles the `isLoading` state from step 2 manually (renders a `<Spinner>` card) since the query is conditional and cannot use the suspense variant.

### `SelectRoutineForClientDialog` (`src/components/routine/sheet/select-routine-for-client.tsx`)

Dialog for assigning a routine to a client. Two flows:

**Assign from library:**
1. Lists trainer's library routines via `useGetApiRoutinesSuspense()` (only returns routines with no `clientId`)
2. Trainer selects a routine and clicks "Confirmar"
3. Calls `usePostApiClientByIdAssignRoutine` → backend clones the routine for the client
4. Invalidates `getApiClientByIdSuspenseQueryKey(clientId)` → `ActiveProgram` re-renders with the new active routine

**Create from scratch:**
1. Trainer clicks "Criar programa do zero"
2. Calls `usePostApiRoutineCreate` with `{ name: "Nova rotina", duration: 0, clientId }`
3. Backend creates an empty routine with `clientId` set (not a library routine)
4. Navigates trainer to `/trainer/routines/$newRoutineId` to fill in workouts

## Cache Invalidation

After assigning or creating a routine, the component invalidates the client query:

```ts
await queryClient.invalidateQueries({
  queryKey: getApiClientByIdSuspenseQueryKey(clientId),
});
```

This triggers a refetch of the client, which updates `activeRoutineId`, causing `ActiveProgram` to switch from empty state to the active routine card.

## Suspense Boundaries

Both `WorkoutFrequencyCalendar` and `WeightEvolution` use `useSuspenseQuery` internally, so they must be wrapped in a `<Suspense>` boundary by their parent pages:

```tsx
<Suspense fallback={<Spinner className="size-6" />}>
  <WorkoutFrequencyCalendar clientId={clientId} />
</Suspense>

<Suspense fallback={<Spinner className="size-6" />}>
  <WeightEvolution clientId={clientId} />
</Suspense>
```

## Generated Hooks

All API hooks are generated by Kubb from the backend's OpenAPI spec. Run `npm run generate` after backend changes:

```bash
npm run generate
```

Relevant generated hooks:
- `useGetApiRoutinesSuspense` — list library routines
- `usePostApiClientByIdAssignRoutine` — assign (clone) a routine to a client
- `usePostApiRoutineCreate` — create a new routine (accepts optional `clientId`)
- `useGetApiRoutineById` — fetch routine by ID (used for active routine display; non-suspense with `enabled` guard)
- `useGetApiClientByIdSuspense` — fetch client with `activeRoutineId`
- `getApiSessionsClientByClientIdQueryOptions` — query options factory for session list (used with `useSuspenseQuery` directly for date-range filtered calendar and weight-evolution views)
