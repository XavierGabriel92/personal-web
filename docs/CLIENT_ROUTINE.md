# Client-Routine Integration

## Overview

Each client can have one **active routine** — a cloned copy of a trainer's library routine (or one created from scratch). The client's `activeRoutineId` field points to this routine.
Client responses also include an optional `lastWorkoutSession` summary used in trainer-facing lists and the overview page.

See the backend doc at `personal-ai-api/docs/client-routine.md` for the data model and cloning logic.

## Client Tabs

The trainer's client detail view has tabs driven by `src/components/clients/tab/index.tsx`. Each tab maps a URL segment to a tab value:

| URL segment | Tab value | Label |
|---|---|---|
| *(default)* | tab-1 | Overview / profile |
| `workout-session` | tab-2 | Treinos realizados |
| `weight-evolution` | tab-4 | Evolução de Carga |
| `program-history` | tab-5 | Histórico de programas |
| `anamnesis` | tab-6 | Anamneses |

Clicking a tab navigates to the corresponding sub-route under `/trainer/clients/$clientId/`.

## Client Anamnesis Tab

`src/routes/trainer/clients/$clientId/anamnesis.tsx` renders the trainer's view of anamneses assigned to a specific client. It displays all client anamnesis records and allows the trainer to:
- View each anamnesis's name, description, and status (`PENDING` / `COMPLETED`)
- Edit questions (add, reorder via drag-and-drop, delete) while the anamnesis is `PENDING`
- Open `EditClientAnamnesisDialog` to manage a specific client anamnesis

Assigning a new anamnesis to the client is done via `SelectAnamnesisForClientDialog`, which opens the trainer's library for selection.

After assignment or question changes, the hook key `getApiClientByIdAnamnesisSuspenseQueryKey(clientId)` is invalidated to keep the tab in sync.

## Last Workout Session

The trainer UI surfaces the latest recorded workout session in three places:

- `/trainer/clients` table via the `Ultimo treino registrado` column
- `/trainer/analytics` client table via the same quick summary column
- `/trainer/clients/$clientId/overview` via a dedicated `LastWorkoutSessionCard`

The value comes from `client.lastWorkoutSession` returned by `GET /api/clients` and `GET /api/client/:id`.

```ts
type LastWorkoutSession = {
  id: string;
  workoutId?: string;
  workoutName: string;
  startedAt: string;
  completedAt?: string;
  duration: number;
  series: number;
  weight: number;
  createdAt: string;
  exercises?: {
    exerciseId: string;
    exerciseName: string;
    thumbnailUrl?: string;
    sets: { reps: number; weight_kg: number }[];
    notes?: string;
  }[];
};
```

This type is exported from `src/lib/last-workout-session.ts` and shared by all components that consume it.

## `src/lib/last-workout-session.ts` Utility Module

Provides the shared `LastWorkoutSession` type and two formatting helpers used by both the client list and the analytics list:

```ts
import { formatLastWorkoutSessionDate, formatWorkoutSessionName } from '@/lib/last-workout-session';

// Returns the workout name as-is (pass-through; centralises future display logic)
formatWorkoutSessionName(workoutName: string): string

// Returns a relative + absolute date string, or "Nenhum treino registrado" when absent
// e.g. "há 2 dias • 22 mar. de 2026"
formatLastWorkoutSessionDate(date?: string): string
```

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

### `LastWorkoutSessionCard` (`src/components/workout-history/last-workout-session-card.tsx`)

Displays a card with the client's most recent workout session on the overview page. Renders nothing when `session` is undefined.

```tsx
import LastWorkoutSessionCard from '@/components/workout-history/last-workout-session-card';
import type { LastWorkoutSession } from '@/lib/last-workout-session';

interface LastWorkoutSessionCardProps {
  session?: LastWorkoutSession;
}

// Returns null when session is undefined — no empty state rendered
<LastWorkoutSessionCard session={client.lastWorkoutSession} />
```

It delegates rendering to `<SessionCard>` for the full session detail.

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

**Month navigation**: a button showing the current month label (e.g. "Março 2026") opens a `<Popover>` with a year selector (prev/next year chevrons) and a 3×4 grid of abbreviated month buttons. Selecting a month closes the popover, updates `displayedMonth`, and resets the selected exercise.

```tsx
// Month picker opens a Popover — no prev/next/today buttons
<Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
  <PopoverTrigger asChild>
    <Button variant="ghost" className="capitalize font-semibold text-base px-2 gap-1">
      {monthLabelCapitalized}
      <ChevronDownIcon className="size-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-60 p-3">
    {/* year nav + 3×4 month grid */}
  </PopoverContent>
</Popover>
```

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

Reusable card that renders a single workout session: name, relative timestamp, duration, total volume, and a collapsible exercise list with sets table. Used by `WorkoutFrequencyCalendar`, `LastWorkoutSessionCard`, and `WorkoutHistoryList`.

### `ActiveProgram` (`src/components/routine/active-routine.tsx`)

Shows the client's currently assigned routine (name, workout count, duration) with an edit link, or an empty state with a "Criar programa" button.

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

### `SelectAnamnesisForClientDialog` (`src/components/anamnesis/dialog/select-anamnesis-for-client.tsx`)

Dialog for assigning an anamnesis from the trainer's library to a client.

1. Lists all trainer anamneses via `useGetApiAnamnesisSuspense()`
2. Trainer selects one and clicks "Confirmar"
3. Calls `usePostApiClientByIdAnamnesis` → creates a client anamnesis record with `status: PENDING`
4. Invalidates `getApiClientByIdAnamnesisSuspenseQueryKey(clientId)`

### `EditClientAnamnesisDialog` (`src/components/anamnesis/dialog/edit-client-anamnesis-dialog.tsx`)

Dialog for viewing and editing a client anamnesis. Shows the anamnesis name, description (read-only), and its question list. When `status === "PENDING"`, renders `ClientAnamnesisQuestionList` so the trainer can add, reorder, and delete questions.

### `ClientAnamnesisQuestionList` (`src/components/anamnesis/questions/client-anamnesis-question-list.tsx`)

Wires `QuestionListBase` to the client anamnesis API endpoints:
- `usePostApiClientByIdAnamnesisByClientAnamnesisIdQuestions` — add question
- `useDeleteApiClientByIdAnamnesisByClientAnamnesisIdQuestionsByQuestionId` — remove question
- `usePutApiClientByIdAnamnesisByClientAnamnesisIdQuestionsReorder` — reorder questions

All mutations invalidate `getApiClientByIdAnamnesisSuspenseQueryKey(clientId)` on success.

### `QuestionListBase` (`src/components/anamnesis/questions/question-list-base.tsx`)

Generic drag-and-drop question list used by both `QuestionList` (trainer anamnesis) and `ClientAnamnesisQuestionList` (client anamnesis). Accepts callbacks for add, delete, and reorder so the API wiring is kept in the caller.

```tsx
<QuestionListBase
  questions={questions}
  onAddQuestion={async (text) => { /* call API */ }}
  onDeleteQuestion={async (question) => { /* call API */ }}
  onReorderQuestions={async (orderedList, nextItems) => { /* call API */ }}
  addButtonLabel="Adicionar pergunta"
  emptyMessage="Nenhuma pergunta adicionada ainda"
/>
```

Key behaviours:
- Optimistic local reorder: updates `items` state immediately, rolls back on API error
- Inline add: shows an input row on "Adicionar pergunta" click; Enter to save, Escape to cancel
- Delete confirmation: `AlertDialog` before removing a question
- Hover-reveal delete button: trash icon only visible on row hover

## Client Overview Page

`src/pages/trainer/client/overview.tsx` renders two columns:

- **Left**: `ProgramOverview` + `LastActivities`
- **Right**: `LastWorkoutSessionCard` (hidden when `client.lastWorkoutSession` is undefined)

```tsx
export default function TrainerClientOverviewPage({ clientId }) {
  const { data: client } = useGetApiClientByIdSuspense(clientId);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <ProgramOverview clientId={clientId} />
          <LastActivities clientId={clientId} />
        </div>
        <div className="flex flex-col gap-4">
          <LastWorkoutSessionCard session={client.lastWorkoutSession} />
        </div>
      </div>
    </div>
  );
}
```

The `ClientNotes` component that previously appeared here has been removed.

## Client Layout Header

The client layout (`src/pages/trainer/client/layout.tsx`) shows `client.goals` as the page subtitle (description), not the phone number.

## Cache Invalidation

After assigning or creating a routine, the component invalidates the client query:

```ts
await queryClient.invalidateQueries({
  queryKey: getApiClientByIdSuspenseQueryKey(clientId),
});
```

This triggers a refetch of the client, which updates `activeRoutineId`, causing `ActiveProgram` to switch from empty state to the active routine card.

After assigning or editing a client anamnesis, invalidate:

```ts
await queryClient.invalidateQueries({
  queryKey: getApiClientByIdAnamnesisSuspenseQueryKey(clientId),
});
```

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

## Program History

`src/components/clients/program-history/index.tsx` renders all routines ever assigned to a client, ordered newest first.

**Data flow:**
1. `useGetApiClientByIdSuspense(clientId)` → get `activeRoutineId` (cached from layout, no extra request)
2. `useGetApiRoutinesClientByClientIdSuspense(clientId)` → get full program list

**Each program card shows:** name, creation date (pt-BR format), duration in weeks, workout count, workout name badges, and an "Ativo" badge for the currently active program.

**3-dot menu actions:**
- "Editar programa" → `navigate({ to: '/trainer/routines/$routineId', params: { routineId: routine.id } })`
- "Clonar programa" → calls `usePostApiRoutineByIdCloneToLibrary({ id: routine.id })` + `toast.success("Programa copiado para sua biblioteca!")`

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
- `useGetApiClientByIdSuspense` — fetch client with `activeRoutineId` and `lastWorkoutSession`
- `getApiSessionsClientByClientIdQueryOptions` — query options factory for session list (used with `useSuspenseQuery` directly for date-range filtered calendar and weight-evolution views)
- `useGetApiRoutinesClientByClientIdSuspense` — fetch all programs for a client (program history list)
- `usePostApiRoutineByIdCloneToLibrary` — clone a client routine to the trainer's library; takes `{ id: string }` as mutation variables
- `useGetApiClientByIdAnamnesisSuspense` — fetch all anamneses assigned to a client
- `usePostApiClientByIdAnamnesis` — assign a library anamnesis to a client (creates client anamnesis record)
- `usePostApiClientByIdAnamnesisByClientAnamnesisIdQuestions` — add a question to a client anamnesis
- `useDeleteApiClientByIdAnamnesisByClientAnamnesisIdQuestionsByQuestionId` — remove a question from a client anamnesis
- `usePutApiClientByIdAnamnesisByClientAnamnesisIdQuestionsReorder` — reorder questions on a client anamnesis
- `usePostApiClientByIdAnamnesisByClientAnamnesisIdSend` — send/submit a client anamnesis
- `useGetApiBillingPlanSuspense` — fetch the trainer's current billing plan (used by sidebar `NavPlan` and account dialog)
- `usePostApiBillingUpgrade` — upgrade the trainer's billing plan
