# Authentication

This document describes authentication patterns using Better Auth.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## Better Auth Setup

```typescript
// src/lib/auth-client.ts
import {
  customSessionClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),      // Organization support
    customSessionClient(),     // Custom session handling
    inferAdditionalFields({   // Custom user fields
      user: {
        type: {
          type: "string",
          enum: ["trainer", "member"],
          defaultValue: "trainer",
        },
        onboardingFinished: {
          type: "boolean",
          defaultValue: false,
        },
      },
    }),
  ],
  baseURL: import.meta.env.VITE_API_URL,
  basePath: "/auth/api",
});

export const {
  getSession,
  useSession,
  signIn,
  signUp,
  signOut,
  requestPasswordReset,
  resetPassword,
  revokeSession,
  organization,
} = authClient;
```

## Authentication Flow

1. **Sign In**: User submits credentials → Better Auth handles session → Cookie set
2. **Session Check**: Routes use `cachedSession()` in `beforeLoad`
3. **Redirect**: If no session, redirect to `/sign-in`
4. **User Type**: Redirect based on `user.type` ("trainer" or "member")

## Sign In

```typescript
import { signIn } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";

function SignInForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (data: SignInFormData) => {
    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });
    
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    
    // Redirect based on user type
    const redirectTo = result.data.user.type === "member" 
      ? "/client/home" 
      : "/trainer/home";
    
    navigate({ to: redirectTo });
  };
}
```

## Sign Up

```typescript
import { signUp } from "@/lib/auth-client";

function SignUpForm() {
  const handleSubmit = async (data: SignUpFormData) => {
    const result = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });
    
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    
    toast.success("Account created!");
    // Redirect to sign in or dashboard
  };
}
```

## Sign Out

```typescript
import { signOut } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";

function UserMenu() {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/sign-in" });
  };
  
  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
```

## Session Management

### Using useSession Hook

```typescript
import { useSession } from "@/lib/auth-client";

function UserProfile() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <Spinner />;
  if (!session) return null;
  
  return (
    <div>
      <p>Welcome, {session.user.name}</p>
      <p>Type: {session.user.type}</p>
    </div>
  );
}
```

### Cached Session (for Route Guards)

```typescript
// src/hooks/auth.ts
import { getSession } from "@/lib/auth-client";
import { queryClient } from "@/routes/__root";
import { useSuspenseQuery } from "@tanstack/react-query";

export const sessionQueryKey = ["session"];

const fetchSession = async () => {
  const session = await getSession();
  return session.data;
};

export const cachedSession = () => {
  return queryClient.fetchQuery({
    queryKey: sessionQueryKey,
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCachedSession = () => {
  return useSuspenseQuery({
    queryKey: sessionQueryKey,
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
  });
};
```

## Route Protection

### Protected Route Example

```typescript
// src/routes/trainer/route.tsx
import { cachedSession } from "@/hooks/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/trainer")({
  component: TrainerDashboardLayout,
  beforeLoad: async () => {
    const data = await cachedSession();
    if (!data?.session) {
      throw redirect({ to: "/sign-in" });
    }
  },
});
```

### Auth Layout (Redirect if Authenticated)

```typescript
// src/routes/_auth/route.tsx
import { cachedSession } from "@/hooks/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: Layout,
  beforeLoad: async () => {
    const data = await cachedSession();
    if (data?.session) {
      // Redirect based on user type
      const redirectTo =
        data.user?.type === "member" ? "/client/home" : "/trainer/home";
      throw redirect({ to: redirectTo });
    }
  },
});
```

## Password Reset

### Request Password Reset

```typescript
import { requestPasswordReset } from "@/lib/auth-client";

function RequestResetForm() {
  const handleSubmit = async (data: { email: string }) => {
    const result = await requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password",
    });
    
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    
    toast.success("Check your email for reset instructions");
  };
}
```

### Reset Password

```typescript
import { resetPassword } from "@/lib/auth-client";

function ResetPasswordForm({ token }: { token: string }) {
  const handleSubmit = async (data: { password: string }) => {
    const result = await resetPassword({
      token,
      password: data.password,
    });
    
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    
    toast.success("Password reset successfully");
    navigate({ to: "/sign-in" });
  };
}
```

## User Type Handling

The application supports two user types: "trainer" and "member".

### Checking User Type

```typescript
import { useSession } from "@/lib/auth-client";

function MyComponent() {
  const { data: session } = useSession();
  
  if (!session) return null;
  
  const isTrainer = session.user.type === "trainer";
  const isMember = session.user.type === "member";
  
  return (
    <div>
      {isTrainer && <TrainerContent />}
      {isMember && <MemberContent />}
    </div>
  );
}
```

### Redirecting Based on Type

```typescript
const redirectTo = session.user.type === "member" 
  ? "/client/home" 
  : "/trainer/home";
```

## Custom Session Fields

The session user object includes both BetterAuth built-in fields (`id`, `name`, `email`, `image`) and custom fields declared via `inferAdditionalFields`.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Trainer's display name (built-in) |
| `type` | `"trainer" \| "member"` | User role |
| `onboardingFinished` | `boolean` | Whether the trainer completed the onboarding checklist |

### `onboardingFinished`

Set to `true` once a trainer completes all 3 onboarding steps (create a routine, invite a client, assign a routine to a client). Used by `OnboardingChecklist` to skip API calls for trainers who have already finished:

```typescript
// Component returns null immediately — no API calls — for completed trainers
if (session?.user.onboardingFinished) return null;
```

The flag is set via `PATCH /api/trainer/onboarding-finished` and the session is invalidated immediately after.

### Onboarding step detection

The checklist derives each step's completion from existing data — no dedicated sessions endpoint is needed:

```typescript
const hasRoutine = (routinesData?.routines?.length ?? 0) > 0;
const hasClient  = (clientsData?.clients?.length ?? 0) > 0;
// Step 3: a routine has been assigned when any client has an activeRoutineId
const hasSession = (clientsData?.clients ?? []).some(c => c.activeRoutineId);
```

## Best Practices

- ✅ Always check session in route `beforeLoad` for protected routes
- ✅ Use `cachedSession()` for route guards (cached for 5 minutes)
- ✅ Use `useSession()` hook in components for reactive session data
- ✅ Handle loading states when checking session
- ✅ Redirect authenticated users away from auth pages
- ✅ Redirect unauthenticated users to sign-in page
- ✅ Use user type to determine dashboard/features
- ✅ Handle errors gracefully with user-friendly messages
