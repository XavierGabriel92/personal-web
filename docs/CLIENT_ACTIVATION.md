# Client activation

## Overview

When a trainer creates a client, the API provisions or links a Better Auth user (`type: client`) and can send an activation email. Account confirmation and roster activation are separate concepts:

- Auth/account linkage is represented by `userId`, `email`, and `emailVerified`.
- Client access to training content is controlled by `clients.active`.

Only clients with `clients.active = true` can access workouts and see the next workout in the client app. Inactive clients can still have an assigned active program, but workout access stays blocked until reactivation. On the web they complete profile and set a password (and may link Google); on the mobile app they sign in with email + password (see [AUTHENTICATION.md](./AUTHENTICATION.md)).

## Trainer flow

1. Trainer creates a client with email and optional goals.
2. The client may receive an email to confirm the account.
3. The trainer controls whether the student is `Ativo` or `Inativo`.
4. Inactive clients cannot access workouts or next-workout actions in the client app.

## API fields

Client list and detail responses include:

- `userId` — set for clients created with the new flow; omitted or null for legacy rows without an app account.
- `email`, `emailVerified` — from the linked auth user when present.
- `active` — roster status used to decide whether the client can access workouts in the client app.

The trainer clients list and client overview now surface only the roster status (`Ativo` / `Inativo`) instead of account/invite badges.

## Generated hook (resend)

```typescript
import { usePostApiClientByIdResendActivation } from '@/gen/hooks/usePostApiClientByIdResendActivation';

const { mutateAsync: resendActivation } = usePostApiClientByIdResendActivation();
await resendActivation({ id: clientId });
```

After OpenAPI changes:

```bash
pnpm run generate
```

## Client app access

- `active = true` — the client can access workouts and see the next workout when a routine is assigned.
- `active = false` — the client can sign in and still see the assigned program, but the app hides next-workout access and workout content.
