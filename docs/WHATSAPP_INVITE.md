# WhatsApp Invite

## Overview

Trainers send a WhatsApp activation message directly to the client's phone via the bot. The client just needs to reply — no token, no link copying.

## Flow

```
1. Trainer creates client (name, phone, goals)
2. Trainer clicks "Enviar convite" on the client profile
3. Bot sends message to client's phone:
   "Olá {name}! Seu personal trainer {trainer} te adicionou ao Homug 💪
    Responda esta mensagem para ativar seu acesso."
4. Client replies with anything → phone activated
5. Client profile shows "WhatsApp conectado"
```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/client/:id/send-invite` | Sends activation message via bot. Client replies to activate. |

## `whatsappConnected` field

All client responses (`GET /api/clients`, `GET /api/client/:id`, `PUT /api/client/:id`) now include:

```ts
whatsappConnected: boolean  // true when binding exists and activated = true
```

## Phone number change

If the trainer changes the client's phone number (`PUT /api/client/:id`), the backend automatically resets the WhatsApp binding. The client will need to be re-invited via "Enviar convite".

The edit-client sheet shows a warning when editing a connected client's phone.

## Generated Hook

```typescript
import { usePostApiClientByIdSendInvite } from '@/gen/hooks/usePostApiClientByIdSendInvite';

const { mutateAsync: sendInvite } = usePostApiClientByIdSendInvite();
await sendInvite({ id: clientId });
```

After backend changes run:

```bash
bun run generate
```

## Client List

The client list shows a **WhatsApp** column with:
- **Conectado** (green) — client has replied and activated
- **Pendente** (gray) — invite not yet sent or client hasn't replied
