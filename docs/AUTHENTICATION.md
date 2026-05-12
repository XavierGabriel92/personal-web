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
          enum: ["trainer", "client"],
          defaultValue: "trainer",
        },
        onboardingFinished: {
          type: "boolean",
          defaultValue: false,
        },
        phone: {
          type: "string",
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
4. **User Type**: Redirect based on `user.type` ("trainer" or "client")

## Sign Up Flow (Access Code Gate)

The sign-up page (`src/pages/auth/sign-up.tsx`) has a two-step flow controlled by a `codeVerified` state:

1. **Code step** (`AskCodeForm`): User enters an access code validated client-side against `VITE_SIGNUP_CODE`. If invalid, an error is shown inline. If the user doesn't have a code, they can switch to the waitlist view.
2. **Register step** (`RegisterForm`): Shown only after the code is verified.

```tsx
// src/pages/auth/sign-up.tsx
export default function SignUp() {
  const [codeVerified, setCodeVerified] = useState(false);

  return (
    // ...
    <main>
      {codeVerified ? (
        <RegisterForm />
      ) : (
        <AskCodeForm onCodeVerified={() => setCodeVerified(true)} />
      )}
    </main>
  );
}
```

### AskCodeForm Views

`AskCodeForm` has three internal views managed by local `useState`:

| View | Description |
|------|-------------|
| `"code"` | Default — user enters the access code |
| `"waitlist"` | User submits name/email/phone to join the waitlist via `POST /api/lead` |
| `"success"` | Shown after a successful waitlist submission |

Code validation is purely client-side:

```typescript
const handleCodeSubmit = (data: CodeFormType) => {
  const validCode = import.meta.env.VITE_SIGNUP_CODE;
  if (data.code === validCode) {
    onCodeVerified();
  } else {
    setCodeError("Código inválido. Verifique e tente novamente.");
  }
};
```

Waitlist submission uses a direct axios call (not a generated hook) since it's a public endpoint:

```typescript
await axios.post(
  `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/lead`,
  { name, email, phone },
  { withCredentials: true },
);
```

A 409 response means the email is already on the waitlist — handled as a field-level error on the email field.

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
    const redirectTo = result.data.user.type === "client" 
      ? "/client/home" 
      : "/trainer/home";
    
    navigate({ to: redirectTo });
  };
}
```

## Sign Up (Registration Form)

The `RegisterForm` is only rendered after code verification (see [Sign Up Flow](#sign-up-flow-access-code-gate) above).

### Trainer (no `organizationId`)

- Submits **name**, **email**, optional **phone**, and **password** (or uses **Google** with the same email as in the form).
- Calls **`POST /api/trainer/magic-signup/intent`** with the same invite code as `VITE_SIGNUP_CODE` (`accessCode`); the API validates against **`TRAINER_SIGNUP_ACCESS_CODE`** (must match in production).
- Then either **`authClient.signUp.email`** with `type: "trainer"` (and optional `phone`) or **`authClient.signIn.social`** with `provider: "google"`. The API **`databaseHooks.user.create.before`** requires a valid, non-expired intent row for every **new** trainer user (including Google), then **`after`** merges optional **phone** from the consumed intent row, billing, and default anamneses.
- With `requireEmailVerification`, email/password sign-up does not finish until the user confirms the verification email; Google sign-up typically marks the email verified immediately.

### Organization client (`organizationId` in search)

- Still uses **`authClient.signUp.email`** with password and `callbackURL` to `/email-verified`.
- With `requireEmailVerification`, **sign-up does not create a session** until email is verified; the app toasts and navigates to **`/sign-in`**.

```typescript
import { signUp } from "@/lib/auth-client";

// Org client only — trainers use intent + email/Google as above
function OrgClientSignUpForm() {
  const handleSubmit = async (data: SignUpFormData) => {
    const result = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      type: "client",
      callbackURL: `${window.location.origin}/email-verified`,
    });

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    toast.success("Check your email to verify, then sign in with Google or password");
    navigate({ to: "/sign-in" });
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

The trainer layout route performs two checks in `beforeLoad`: authentication and trainer role.

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

    if (data.user?.type !== "trainer") {
      throw redirect({ to: "/client/home" });
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
        data.user?.type === "client" ? "/client/home" : "/trainer/home";
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

The application supports two user types: "trainer" and "client".

### Checking User Type

```typescript
import { useSession } from "@/lib/auth-client";

function MyComponent() {
  const { data: session } = useSession();
  
  if (!session) return null;
  
  const isTrainer = session.user.type === "trainer";
  const isClientUser = session.user.type === "client";
  
  return (
    <div>
      {isTrainer && <TrainerContent />}
      {isClientUser && <ClientContent />}
    </div>
  );
}
```

### Redirecting Based on Type

```typescript
const redirectTo = session.user.type === "client" 
  ? "/client/home" 
  : "/trainer/home";
```

## Sign-in (Google or email + password)

The sign-in page ([`src/pages/auth/forms/login-form.tsx`](src/pages/auth/forms/login-form.tsx)) uses **`authClient.signIn.social`** (`provider: "google"`) and **`authClient.signIn.email`** with `callbackURL` set to the app origin. There is no magic-link / passwordless email flow.

Clients invited by a trainer confirm via the activation link, then complete profile on [`/client/set-password`](src/pages/client/set-password.tsx) with a domain-based rule:
- invited `@gmail.com` email: can complete without password (Google path) or define password for email+password login.
- invited non-`@gmail.com` email: must define password to complete activation.

For mobile access, email+password remains supported. Google is available on the web flow for invited `@gmail.com` accounts.

## Custom Session Fields

The session user object includes both BetterAuth built-in fields (`id`, `name`, `email`, `image`) and custom fields declared via `inferAdditionalFields`.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Trainer's display name (built-in) |
| `type` | `"trainer" \| "client"` | User role |
| `onboardingFinished` | `boolean` | Whether the trainer completed the onboarding checklist |
| `phone` | `string \| undefined` | Brazilian phone number; required to access trainer routes |

### `onboardingFinished`

Set to `true` once a trainer completes all 3 onboarding steps (create a routine, invite a client, assign a routine to a client). Used by `OnboardingChecklist` to skip API calls for trainers who have already finished:

```typescript
// Component returns null immediately — no API calls — for completed trainers
if (session?.user.onboardingFinished) return null;
```

The flag is set via `PATCH /api/trainer/onboarding-finished` and the session is invalidated immediately after.

### `phone`

A Brazilian phone number stored on the user account. Validated with `libphonenumber-js` on both the registration form (optional for trainers, hidden for organization client sign-up) and the account settings dialog.

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
- ✅ When a route guard has multiple conditions (auth + profile completeness), always exclude the destination route from its own guard to prevent redirect loops
- ✅ Gate sign-up behind `AskCodeForm` — validate `VITE_SIGNUP_CODE` client-side before showing `RegisterForm`
