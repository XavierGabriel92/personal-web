# Client Area

This document describes the client-facing web area under `src/routes/client/`.

## Purpose

The client area replicates the main experience from `personal-ai-mobile-app` inside `personal-web` using web-native patterns:

- TanStack Router for navigation
- TanStack Query + Kubb-generated clients/hooks for data fetching
- Better Auth cookie session
- shadcn/ui primitives for layout and interaction

The goal is UI parity with the mobile app without copying React Native implementation details.

## Route map

| Web route | Purpose |
| --- | --- |
| `/client/set-password` | First-login password/profile completion gate |
| `/client/home` | Dashboard with trainer, next workout, pending anamnesis, weekly summary |
| `/client/workouts` | Active program overview and prescribed workout cards |
| `/client/history` | Infinite-scroll finished workout history |
| `/client/profile` | Profile hub with edit, theme, anamneses, activities, sign out |
| `/client/profile/edit` | Client profile form |
| `/client/anamneses` | Assigned anamnesis list |
| `/client/anamneses/$clientAnamnesisId` | Read-only anamnesis detail |
| `/client/anamneses/$clientAnamnesisId/respond` | Respond or confirm anamnesis |
| `/client/activities` | Infinite-scroll client activity feed |
| `/client/exercises/$exerciseId` | Exercise detail with media and instructions |
| `/client/sessions/select-exercise` | Exercise picker used by the live workout flow |
| `/client/sessions/active` | Live workout editor for the current draft session |
| `/client/sessions/active/save` | Finish/discard flow for the current draft session |

## Layout

### `/client` guard

`src/routes/client/route.tsx` is the root guard for all client routes:

- unauthenticated users are redirected to `/sign-in`
- trainers are redirected to `/trainer/home`
- incomplete client onboarding is forced to `/client/set-password`
- `/client` itself redirects to `/client/home` when onboarding is complete

### App shell

The tabbed client shell lives in `src/routes/client/(tabs)/route.tsx`.

It renders:

- `src/components/client/nav-bar.tsx`
- `src/components/client/active-workout-pill.tsx`
- child routes for `/client/home`, `/client/workouts`, `/client/history`, `/client/profile`

The bottom navigation is fixed across viewport sizes and centered with `max-w-2xl`.

### Shared client UI

| Component | Location | Role |
| --- | --- | --- |
| `ClientNavBar` | `src/components/client/nav-bar.tsx` | Bottom tab bar for the 4 primary client tabs |
| `ClientPageContainer` | `src/components/client/page-container.tsx` | Shared content width and page padding |
| `ClientScreenHeader` | `src/components/client/screen-header.tsx` | Mobile-style header for full-screen subpages |
| `ActiveWorkoutPill` | `src/components/client/active-workout-pill.tsx` | Resume/discard pill for an active draft workout |
| `ReplaceDraftWorkoutDialog` | `src/components/client/replace-draft-workout-dialog.tsx` | Confirmation when starting a new workout while a draft exists |

## Data layer

### Queries

Client pages use generated suspense hooks whenever the data is required to render:

- `useGetApiClientMeHomeSuspense`
- `useGetApiClientMeRoutineWorkoutsSuspense`
- `useGetApiClientMeAnamnesisSuspense`
- `useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense`
- `useGetApiExercisesFiltersSuspense`
- `useGetApiExerciseByIdSuspense`

For infinite lists the app uses `useSuspenseInfiniteQuery` with the generated client functions:

- `getApiClientMeSessionsHistory`
- `getApiClientMeActivities`

### Optional draft session

`/api/client/me/sessions/draft` is optional and may return `404` when there is no draft. Because of that, the client area wraps it in `src/hooks/use-draft-session.ts` instead of using the suspense variant directly.

That hook powers:

- the active workout pill
- workout-start draft guard
- the live workout editor
- the save/discard screen

## File organization

Client code is split by role:

- route files: `src/routes/client/**`
- grouped tab routes: `src/routes/client/(tabs)/**`
- page components: `src/pages/client/**`
- reusable client UI: `src/components/client/**`
- shared client helpers and types: `src/lib/client-portal.ts`
- shared client hooks: `src/hooks/use-client-session.ts`, `src/hooks/use-relative-date.ts`, `src/hooks/use-draft-session.ts`, `src/hooks/use-start-workout-with-draft-guard.ts`

## Mobile to web mapping

| Mobile source | Web target | Primary web data source |
| --- | --- | --- |
| `app/(tabs)/home.tsx` | `/client/home` | `useGetApiClientMeHomeSuspense` |
| `app/(tabs)/treinos.tsx` | `/client/workouts` | `useGetApiClientMeRoutineWorkoutsSuspense` + `useGetApiClientMeHomeSuspense` |
| `app/(tabs)/history.tsx` | `/client/history` | `getApiClientMeSessionsHistory` via `useSuspenseInfiniteQuery` |
| `app/(tabs)/profile.tsx` | `/client/profile` | `useClientSession` |
| `app/edit-profile.tsx` | `/client/profile/edit` | `usePatchApiClientMeProfile` |
| `app/anamnesis-list.tsx` | `/client/anamneses` | `useGetApiClientMeAnamnesisSuspense` |
| `app/anamnesis-detail.tsx` | `/client/anamneses/$clientAnamnesisId` | `useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense` |
| `app/anamnesis-respond.tsx` | `/client/anamneses/$clientAnamnesisId/respond` | `useGetApiClientMeAnamnesisByClientAnamnesisIdSuspense`, `usePutApiClientMeAnamnesisByClientAnamnesisIdQuestionsByQuestionId`, `usePostApiClientMeAnamnesisByClientAnamnesisIdFinish` |
| `app/activities.tsx` | `/client/activities` | `getApiClientMeActivities` via `useSuspenseInfiniteQuery` |
| `app/exercise-detail.tsx` | `/client/exercises/$exerciseId` | `useGetApiExerciseByIdSuspense` |
| `app/select-exercise.tsx` | `/client/sessions/select-exercise` | `useGetApiExercisesFiltersSuspense`, `usePostApiExercisesSearch` |
| `app/log-workout.tsx` | `/client/sessions/active` | `useDraftSession`, `usePutApiClientMeSessionsBySessionIdExercises`, `useDeleteApiClientMeSessionsBySessionId` |
| `app/save-workout.tsx` | `/client/sessions/active/save` | `useDraftSession`, `usePostApiClientMeSessionsBySessionIdFinish` |

## Cross-screen state

The mobile app uses module-level in-memory state for exercise selection. The web app does not.

The web live workout flow passes pending selection through URL search params on `/client/sessions/active`:

- `addedExerciseId`
- `addedExerciseName`
- `addedExerciseImgSrc`
- `replaceExerciseId`

That keeps back/forward navigation aligned with the visible state.

## What we intentionally did not copy

The web version keeps the same product shape but does not port mobile-specific implementation details:

- no Expo Router or React Native navigation primitives
- no SecureStore or bearer-token persistence logic
- no Gluestack UI components
- no slide-up modal navigation animations
- no module-level temporary state for exercise selection
- no legacy `/client/welcome` route

Clients land directly on `/client/home` after completing the set-password flow.
