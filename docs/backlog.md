# Backlog

Tasks organized by page/route. Each entry includes the type (BUG / IMPROVEMENT / MISSING), context, and a concrete implementation plan.

---

## TRAINER HOME
**Route:** `/trainer/home`
**Files:** `src/pages/trainer/home.tsx` (to be created), `src/components/trainer/home/`

### [MISSING] Build the trainer home/dashboard page

**Problem:** No home page exists yet. This is the landing page for trainers after login — it should give a quick overview of their clients and activity.

**Layout (based on design mockup):**

#### Section 1 — Onboarding checklist (show only if incomplete)
- Card titled "Let's get started" with 3 sequential steps:
  1. Create a program → links to `/trainer/routines`
  2. Invite a client → opens the Add Client sheet
  3. Assign a program → links to client's program tab
- Right side: a "Read Getting Started Guide" card with a preview image and link.
- Once all 3 steps are done, hide this section entirely.

#### Section 2 — Header + actions
- Left: `"Hello, {firstName} 👋"` heading with subtitle `"Get an overview of your clients' progress."`
- Right: search input (`Search clients`) that filters the client list below, and a `+ Add Client` button that opens the create-client sheet.

#### Section 3 — Stats cards (3 columns)
Each card shows a count + a `>` arrow that navigates to the filtered clients list:
- **Total Clients** → links to `/trainer/clients`
- **Active clients last 7 days** → links to `/trainer/clients?filter=active`
- **Inactive clients last 7 days** → links to `/trainer/clients?filter=inactive`
- Fetch data from the clients API; derive active/inactive by checking last activity date.

#### Section 4 — Bottom split (2 columns)
- **Latest Activities** (left, ~40% width): list of recent client activity events (e.g., workout completed, program assigned). Use a timeline or simple list. Fetch from activity/audit API if available.
- **Weekly Active Clients** (right, ~60% width): a line or bar chart showing active client count per day for the last 7 days. Use `recharts` (already in the project).

**Plan:**
1. Create `src/pages/trainer/home.tsx` with the layout above.
2. Create sub-components under `src/components/trainer/home/`:
   - `onboarding-checklist.tsx` — the "Let's get started" card
   - `stats-cards.tsx` — the 3 metric cards
   - `latest-activities.tsx` — activity feed
   - `weekly-active-chart.tsx` — recharts bar/line chart
3. Check `src/gen/` for hooks: clients list, activity feed, stats. Wire them up.
4. Add the route in `src/routes/trainer/` and register it in the route tree.

---

## CLIENT EXPERIENCE — WHATSAPP AI INTEGRATION
**Scope:** Cross-cutting feature. Touches backend (AI agent, WhatsApp integration), client web app, and trainer web app (activity feed + charts).

> ⚠️ This is a high-level concept entry. Before starting implementation, the agent **must ask the user** about:
> - Which WhatsApp Business API provider to use (Twilio, Meta Cloud API, Z-API, etc.)
> - Where the AI agent lives (personal-ai-api repo or a new service)
> - Business rules: what happens if a client skips a workout? Can they log partial sessions? Can they log a workout not in their assigned routine?
> - Auth: how does the WhatsApp conversation identify the client (phone number bound to account)?
> - Data model: does the backend already have a `WorkoutSession` / `ActivityLog` table, or does it need to be created?

---

### [MISSING] Trainer generates a WhatsApp invite link for a new client

**Problem:** After registering a client, the trainer has no way to onboard them to the WhatsApp AI experience.

**Idea:**
- On the client creation success step (or client detail page), show a "Share WhatsApp link" button.
- The link is a `wa.me` deep link pre-filled with a greeting message that includes a unique client token (e.g., `https://wa.me/+55...?text=Oi!%20Meu%20código%20é%20{token}`).
- The token lets the AI agent identify and bind the WhatsApp number to the client's account on first message.

---

### [MISSING] WhatsApp AI agent — conversational client interface

**Problem:** Clients need a zero-friction way to interact with their training program without opening an app.

**Idea — the AI handles 3 core flows via conversation:**

#### Flow 1: View next workout
- Client sends something like "qual é meu próximo treino?" ("what's my next workout?")
- AI looks up their assigned routine, finds the next pending workout, and replies with a structured summary (workout name, exercises, sets/reps).

#### Flow 2: Log a workout session (conversational UI)
- Client says "vou treinar agora" ("I'm going to train now") or similar.
- AI guides them through the session as a chat: confirms the workout, then asks for each exercise's sets/reps/weight one by one (or all at once if they prefer).
- When the session is complete, AI confirms and saves it to the backend as a `WorkoutSession`.
- AI sends a summary: total volume, sets completed, duration.

#### Flow 3: View workout history
- Client asks "meus últimos treinos" ("my last workouts").
- AI returns a list of recent sessions with date, workout name, and key stats.

---

### [MISSING] Activity feed module — typed activity events

**Problem:** Completed workout sessions (and other client events) need to be stored as rich, typed activity records that can be rendered with specific UI components.

**Idea — Activity types (each with its own card component and possible actions):**

| Type | Description | Icon | Actions |
|------|-------------|------|---------|
| `WORKOUT_COMPLETED` | Client finished a workout session | 🏋️ dumbbell | View session detail |
| `WEIGHT_LOGGED` | Client logged a new body weight | ⚖️ scale | View weight history |
| `ROUTINE_ASSIGNED` | Trainer assigned a new routine | 📋 clipboard | View routine |
| `STREAK_MILESTONE` | Client hit a training streak (e.g., 7 days in a row) | 🔥 fire | — |
| `PERSONAL_RECORD` | Client beat a previous best on an exercise | 🏆 trophy | View exercise history |

- Each activity record has: `type`, `clientId`, `trainerId`, `payload` (JSON, type-specific), `createdAt`.
- The activity feed on the trainer home page renders these with their specific card component.
- The client's own activity feed (visible via WhatsApp or future client web app) uses the same data.

---

### [MISSING] Client performance charts — Volume, Séries, Duração

**Problem:** The client detail page (and potentially trainer home) should show performance trends over time, fed by logged workout sessions.

**Idea:**
- Three bar charts, one per metric, using `recharts`:
  - **Volume** (kg): sum of `sets × reps × weight` per session, grouped by week.
  - **Séries**: total sets completed per session/week.
  - **Duração**: total workout duration per session/week.
- Data comes from `WorkoutSession` records linked to the client.
- X-axis: last N weeks (e.g., 5 weeks shown as in the mockup).
- Each chart card shows the current week's aggregate value as a headline number (e.g., `1620kg`, `45 séries`, `1:20h`).

---

## EDIT PROGRAM (ROUTINE)
**Route:** `/trainer/routines/:routineId`
**Files:** `src/pages/trainer/routine.tsx`, `src/components/routine/sidebar/resume-program.tsx`, `src/components/workout/list/draggable.tsx`, `src/components/routine/sheet/assign-routine.tsx`

---

### [IMPROVEMENT] Remove click-anywhere-to-redirect on workout list items

**Problem:** Clicking anywhere on a workout row in the routine editor navigates to that workout's edit page. This is unintentional — only the explicit "Edit" button should trigger navigation.

**Plan:**
1. In `src/components/workout/list/draggable.tsx` (or `src/components/workout/collapsible/workout.tsx`), find the `onClick` handler on the workout item/row wrapper.
2. Remove or scope it: only keep navigation inside the "Edit" button's `onClick`.
3. Make sure drag handles still work and that the collapsible expand/collapse still works without triggering navigation.

---

## READY-MADE PROGRAMS
**Route:** `/trainer/routines/homug-programs`
**Files:** `src/pages/trainer/routines/homug-programs.tsx` (or equivalent), `src/components/routine/list/`

---

### [MISSING] Copy a ready-made program to the trainer's own programs

**Problem:** Trainers can browse pre-built programs but cannot copy them to their own library to customize.

**Plan:**
1. In the homug-programs list component, add a "Copy to my programs" action button or menu item on each program card.
2. On click, call a "duplicate" or "copy" API endpoint. Check `src/gen/` for something like `usePostApiRoutineCopy()` or `usePostApiRoutineDuplicate()`. If not available, may need to create a new routine by POSTing the existing routine's data with a new name.
3. On success: show a toast "Program copied to your library" and optionally navigate to the trainer's programs list.
4. Handle loading state on the button to prevent double-clicks.

---