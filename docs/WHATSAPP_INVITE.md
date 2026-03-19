# WhatsApp Invite

## Overview

Trainers can share a WhatsApp invite link with a client to bind the client's phone number to their account. The link opens a pre-filled WhatsApp message that the client sends to the bot.

There are two places where a trainer can generate this link:

| Where | When |
|-------|------|
| `CreateClientSheet` | Right after creating a new client |
| Client detail page (`/trainer/clients/:id`) | At any time — to re-invite or after the client changes their WhatsApp number |

## Invite URL Format

```
https://wa.me/<VITE_WHATSAPP_BOT_PHONE>?text=Oi!%20Meu%20código%20é%20<token>
```

The bot phone number comes from the `VITE_WHATSAPP_BOT_PHONE` environment variable.

## Client Detail Page Button

Located in `src/pages/trainer/client/layout.tsx`.

The **"Convidar via WhatsApp"** button:

1. Calls `POST /api/client/:id/whatsapp-invite` via `usePostApiClientByIdWhatsappInvite`
2. Backend upserts a new token in `whatsapp_bindings` (creates if none exists, resets phone and token if one already exists)
3. On success, opens the wa.me link in a new tab

This replaces any existing binding — if the client had previously confirmed their WhatsApp, the old phone link is cleared and they must re-bind with the new token.

## Generated Hook

```typescript
import { usePostApiClientByIdWhatsappInvite } from '@/gen/hooks/usePostApiClientByIdWhatsappInvite';

const { mutateAsync: generateInvite } = usePostApiClientByIdWhatsappInvite();
const { whatsappToken } = await generateInvite({ id: clientId });
```

After backend changes run:

```bash
bun run generate
```

## Create Client Flow

`src/components/clients/sheet/create-client.tsx` shows the invite link immediately after a client is created. The token comes directly from the `POST /api/client/create` response (`whatsappToken` field) — no extra call needed.
