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

### Workout Session
A logged instance of a client completing a workout. Captures actual performance data (sets done, reps, weight, duration) against the prescribed exercises.

### Client
A person training under a trainer. Stored with:
- Name and phone number (for WhatsApp)
- Active/inactive status
- Assigned routines

### Activity Feed
Rich, typed event records that capture significant client events (workout completed, weight logged, personal record, streak milestone, routine assigned). Used to display a timeline of client progress on the trainer dashboard.

---

## User Journeys

### Trainer onboarding
1. Sign up → arrive at trainer home dashboard
2. Create a training program (routine + workouts + exercises)
3. Invite a client (enter name + phone number)
4. Assign the program to the client
5. Client receives their plan via WhatsApp

### Trainer daily workflow
- Check trainer home: client stats, latest activity, weekly active chart
- Review individual client progress: weight history, performance charts, session log
- Adjust programs as needed

### Using ready-made programs
Trainers can browse a library of curated system programs at `/trainer/routines/homug-programs`. Programs are organized by category (beginner, intermediate, advanced, muscle-growth, strength, home). Clicking "Add to my programs" deep-clones the template into the trainer's own library, where it can be customized freely.

### Assigning a program to a client
From the routine detail page or client profile, the trainer assigns a routine to a client. This clones the routine into a client-specific copy (`clientId` set), so changes to the original don't affect the client's running program.

---

## Domain Model (simplified)

```
User (Trainer)
  ├── owns → Routine[] (trainer programs)
  │           ├── contains → Workout[]
  │           │               └── has → ExerciseWorkout[] → Exercise
  │           └── (isTemplate=true, ownerId=null) = system templates
  │
  └── manages → Client[]
                  └── assigned → Routine (client copy, clientId set)
                                  └── logs → WorkoutSession[]
                                               └── Activity events
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/trainer/home` | Dashboard: stats, latest activity, weekly chart |
| `/trainer/clients` | Client list with search and filters |
| `/trainer/clients/:id` | Client detail: program, progress charts, sessions |
| `/trainer/routines` | Trainer's program library |
| `/trainer/routines/:id` | Program editor: add/edit/reorder workouts and exercises |
| `/trainer/routines/homug-programs` | Browse system template programs |
| `/trainer/analytics` | Analytics: client activity counts, active/inactive breakdown by period |

---

## Key Design Decisions

**WhatsApp as primary client channel**: Clients don't need an account. The platform generates shareable workout plan links delivered via WhatsApp. This lowers the barrier for client adoption.

**Template vs. owned routine distinction**: System templates use `ownerId = null` + `isTemplate = true`. This means they're naturally invisible to trainer program lists (which filter by `ownerId = trainer.id`), and the FK `ON DELETE SET NULL` ensures templates survive if an owner user were ever deleted.

**Client routine isolation**: When a trainer assigns a program to a client, a deep clone is made. This decouples the client's running program from the trainer's master template, allowing the trainer to evolve their templates without accidentally changing what a client is currently following.

**Kubb codegen**: The frontend never writes API call code by hand. All API clients and React Query hooks are generated from the backend's OpenAPI spec via `bun run generate`. This keeps the frontend/backend contract always in sync.
