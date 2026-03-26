# Product Overview

This document describes the product, its users, core business concepts, and domain model. It provides context for understanding why the code is structured the way it is.

---

## What is this product?

A **personal trainer management platform** that helps fitness trainers run their client base efficiently. Trainers use a web app to build training programs, assign them to clients, and track client progress. Clients receive their programs and workout instructions primarily via **WhatsApp**.

---

## Users

### Trainer
The primary user. A personal trainer who:
- Manages a roster of clients
- Builds and organizes training programs (routines)
- Assigns programs to clients
- Monitors client activity and progress
- Communicates with clients via WhatsApp

### Client
A trainer's client. Currently a **passive recipient** — clients receive workout plans via WhatsApp and log their sessions, but do not have a full web app login. Future versions may include a client-facing web/mobile app.

---

## Core Business Concepts

### Exercise
The atomic unit of training. A pre-defined movement (e.g., "Bench Press", "Squat") with metadata:
- Primary and secondary muscle groups targeted
- Equipment required
- Instructions and media
- System-defined (not per-trainer) — shared across all trainers

### Workout
A single training session composed of multiple exercises. Each exercise has a sets prescription (reps, weight, rest, type). A workout belongs to a routine and has an order within it.

Examples: "Day 1 — Push", "Leg Day", "Full Body A"

### Routine (Program)
A collection of workouts organized into a training program with a duration (in days). Routines are the main artifact a trainer creates and assigns to clients.

Examples: "PPL Beginner 12 weeks", "Hypertrophy Block", "5/3/1 Strength"

**Types of routines:**
- **Trainer routines**: Owned by a trainer (`ownerId = trainer.id`), used as templates for assigning to clients
- **Client routines**: A copy of a trainer routine assigned to a specific client (`clientId` set) — these are the "live" programs a client follows
- **System templates**: Pre-built programs (`isTemplate = true`, `ownerId = null`) provided by the platform that trainers can browse and clone into their library

### Anamnesis
A health-intake questionnaire that a trainer creates and can assign to clients. Each anamnesis has a name, optional description, and an ordered list of free-text questions.

**Types:**
- **Trainer anamneses**: Created by a trainer (`ownerId = trainer.id`), managed in the trainer's library
- **System templates**: Pre-built questionnaires (`isTemplate = true`, `category` set) provided by the platform; trainers clone them into their own library

Key properties:
- `id`, `name`, `description?`, `ownerId?`, `isTemplate?`, `category?`
- `questions: AnamnesisQuestion[]` — ordered list of questions, each with `id`, `text`, `order`

### Client Anamnesis
When a trainer assigns an anamnesis from their library to a client, a **client anamnesis** record is created. This is a copy of the library anamnesis scoped to that client.

Key properties:
- `id`, `name`, `description?`, `status: "PENDING" | "COMPLETED"`, `questions[]`
- While `PENDING`, the trainer can add, reorder (drag-and-drop), and delete questions from the client's copy via the client anamnesis tab
- Managed via `/api/client/:id/anamnesis` and related endpoints

### Workout Session
A logged instance of a client completing a workout. Captures actual performance data (sets done, reps, weight, duration) against the prescribed exercises.

### Client
A person training under a trainer. Stored with:
- Name and phone number (for WhatsApp)
- Active/inactive status
- Assigned routines

### Billing Plan
Each trainer account is on a billing plan that determines how many clients they can have active at once.

**Plan tiers** (exposed via `GET /api/billing/plan`):

| Plan | Client limit |
|------|-------------|
| `free` | Small limit (trial) |
| `starter` | 3–25 clients |
| `pro` | 25–50 clients |
| `elite` | Unlimited |

Key fields returned by the billing endpoint:
```ts
{
  plan: "free" | "starter" | "pro" | "elite";
  clientCount: number;      // how many clients the trainer currently has
  clientLimit: number | null; // null for elite (unlimited)
  remainingClients: number | null; // null for elite
}
```

The billing plan gates **client creation**: when `remainingClients <= 0`, the "Criar aluno" trigger opens `UpgradePlanDialog` instead of the creation sheet. The same dialog is shown if the API returns `plan_limit_reached` on a create attempt. The sidebar `NavPlan` widget surfaces this usage with a progress bar and an upgrade button.

### Activity Feed
Rich, typed event records that capture significant client events (workout completed, weight logged, personal record, streak milestone, routine assigned). Used to display a timeline of client progress on the trainer dashboard.

---

## User Journeys

### Trainer onboarding
1. Sign up → arrive at trainer home dashboard
2. If no phone on file → redirected to `/trainer/phone-setup` to add a Brazilian phone number before accessing any other page
3. Create a training program (routine + workouts + exercises)
4. Invite a client (enter name + phone number)
5. Assign the program to the client
6. Client receives their plan via WhatsApp

### Trainer daily workflow
- Check trainer home: client stats, latest activity, weekly active chart
- Review individual client progress: weight history, performance charts, session log
- Adjust programs as needed

### Using ready-made programs
Trainers can browse a library of curated system programs at `/trainer/routines/homug-programs`. Programs are organized by category (beginner, intermediate, advanced, muscle-growth, strength, home). Clicking "Add to my programs" deep-clones the template into the trainer's own library, where it can be customized freely.

### Assigning a program to a client
From the routine detail page or client profile, the trainer assigns a routine to a client. This clones the routine into a client-specific copy (`clientId` set), so changes to the original don't affect the client's running program.

### Managing anamneses
Trainers create and edit questionnaires at `/trainer/anamnesis`. They can:
- Create a blank anamnesis via a dialog (`CreateAnamnesisDialog`)
- Add, reorder (drag-and-drop), and delete questions on the detail page

### Assigning an anamnesis to a client
From the client profile (or after client creation), the trainer opens `SelectAnamnesisForClientDialog`:
1. Lists all anamneses from the trainer's library
2. Trainer selects one and clicks "Confirmar" → a client anamnesis record is created with `status: PENDING`
3. While the client anamnesis is `PENDING`, the trainer can adjust its questions from the client's anamnesis tab (`/trainer/clients/:id/anamnesis`)

### Upgrading a plan
When a trainer hits their client limit, `UpgradePlanDialog` opens (either from the sidebar widget, the account page, or automatically when attempting to create a client past the limit). The trainer selects a plan tier and confirms; access is granted immediately and payment is confirmed separately.

---

## Domain Model (simplified)

```
User (Trainer)
  ├── owns → Routine[] (trainer programs)
  │           ├── contains → Workout[]
  │           │               └── has → ExerciseWorkout[] → Exercise
  │           └── (isTemplate=true, ownerId=null) = system templates
  │
  ├── owns → Anamnesis[] (trainer questionnaires)
  │           └── has → AnamnesisQuestion[] (ordered)
  │           └── (isTemplate=true, ownerId=null) = system templates
  │
  ├── has → BillingPlan (plan tier + client count/limit)
  │
  └── manages → Client[]
                  ├── assigned → Routine (client copy, clientId set)
                  │               └── logs → WorkoutSession[]
                  │                            └── Activity events
                  └── assigned → ClientAnamnesis[] (status: PENDING | COMPLETED)
                                  └── has → AnamnesisQuestion[] (ordered, editable while PENDING)
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/trainer/home` | Dashboard: stats, latest activity, weekly chart |
| `/trainer/phone-setup` | Forced phone setup — shown when trainer has no phone on file |
| `/trainer/clients` | Client list with search and filters |
| `/trainer/clients/:id` | Client detail: program, progress charts, sessions |
| `/trainer/clients/:id/anamnesis` | Client's assigned anamneses; edit questions while PENDING |
| `/trainer/routines` | Trainer's program library |
| `/trainer/routines/:id` | Program editor: add/edit/reorder workouts and exercises |
| `/trainer/routines/homug-programs` | Browse system template programs |
| `/trainer/analytics` | Analytics: client activity counts, active/inactive breakdown by period |
| `/trainer/anamnesis` | Trainer's anamnesis library |
| `/trainer/anamnesis/:anamnesisId` | Anamnesis detail: edit name/description, manage questions |
| `/trainer/account` | Account settings modal: edit display name and phone, view billing plan, trigger upgrade |

---

## Key Design Decisions

**WhatsApp as primary client channel**: Clients don't need an account. The platform generates shareable workout plan links delivered via WhatsApp. This lowers the barrier for client adoption.

**Template vs. owned routine distinction**: System templates use `ownerId = null` + `isTemplate = true`. This means they're naturally invisible to trainer program lists (which filter by `ownerId = trainer.id`), and the FK `ON DELETE SET NULL` ensures templates survive if an owner user were ever deleted. The same convention applies to Anamnesis templates.

**Client routine isolation**: When a trainer assigns a program to a client, a deep clone is made. This decouples the client's running program from the trainer's master template, allowing the trainer to evolve their templates without accidentally changing what a client is currently following.

**Client anamnesis isolation**: When a trainer assigns an anamnesis to a client, a client anamnesis record is created (not a pointer to the library item). The trainer can then add, reorder, and delete questions on that client's copy independently of the library anamnesis.

**Billing plan gates client creation**: Before opening the create-client sheet, the frontend reads the cached billing plan from TanStack Query (`queryClient.getQueryData`) to avoid an extra network call. If `remainingClients <= 0`, the upgrade dialog opens immediately without ever showing the create form.

**Phone required to access trainer area**: The `/trainer` route guard checks `data.user?.phone` and redirects to `/trainer/phone-setup` when it is absent. This ensures every trainer account has a valid Brazilian phone number before they can interact with the rest of the app.

**Kubb codegen**: The frontend never writes API call code by hand. All API clients and React Query hooks are generated from the backend's OpenAPI spec via `bun run generate`. This keeps the frontend/backend contract always in sync.
