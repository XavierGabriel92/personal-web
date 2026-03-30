# Client email activation (legacy filename)

> This doc previously described the WhatsApp invite flow, which has been removed. The file name is kept so existing links from `CLAUDE.md` and hooks still resolve.

## Overview

When a trainer creates a client, the API provisions a Better Auth user (`type: client`), links the roster row via `userId`, and sends a verification email. The client confirms the email; the backend then sets `clients.active` to true. Clients sign in with a **magic link** (see [AUTHENTICATION.md](./AUTHENTICATION.md)).

## Trainer flow

1. Trainer creates a client with **name**, **email**, **phone**, and optional goals.
2. The client receives an email to confirm the account.
3. If needed, the trainer uses **Reenviar email de ativação** on the client profile (`POST /api/client/:id/resend-activation`).

## API fields

Client list and detail responses include:

- `userId` — set for clients created with the new flow; omitted or null for legacy rows without an app account.
- `email`, `emailVerified` — from the linked auth user when present.

Legacy clients without `userId` show as **Sem app** in the trainer UI.

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

## Client list

The **Conta no app** column shows:

- **Sem app** — no linked auth user (legacy).
- **Email pendente** — account exists, email not verified yet.
- **Confirmado** — email verified; client can use magic link sign-in.
