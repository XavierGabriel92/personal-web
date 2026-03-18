# API Client Generation

This document describes API client generation using Kubb and how to use the generated clients.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## Kubb Configuration

Kubb generates type-safe API clients from the OpenAPI spec:

```typescript
// kubb.config.ts
import "dotenv/config";
import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";

const baseURL = process.env.VITE_API_URL as string;

export default defineConfig({
  root: ".",
  input: {
    path: `${baseURL}/openapi/json`, // OpenAPI spec endpoint
  },
  output: {
    clean: true,
    path: "./src/gen",
  },
  plugins: [
    pluginOas(),              // Parse OpenAPI spec
    pluginTs(),               // Generate TypeScript types
    pluginClient({            // Generate API client functions
      importPath: "@/lib/client.ts",
    }),
    pluginReactQuery({        // Generate React Query hooks
      client: {
        importPath: "@/lib/client.ts",
      },
    }),
  ],
});
```

## Generated Output

Kubb generates three types of files:

### 1. Client Functions (`src/gen/clients/`)

Direct API call functions:

```typescript
// src/gen/clients/getApiRoutines.ts
import fetch from "@/lib/client.ts";

export function getApiRoutines(config?: RequestConfig) {
  return fetch<GetApiRoutinesQueryResponse>({
    url: "/api/routines",
    method: "get",
    ...config,
  });
}
```

### 2. React Query Hooks (`src/gen/hooks/`)

`useQuery` and `useMutation` hooks:

```typescript
// src/gen/hooks/useGetApiRoutines.ts
import { useQuery } from "@tanstack/react-query";
import { getApiRoutines } from "../clients/getApiRoutines";

export function useGetApiRoutines(options = {}) {
  return useQuery({
    queryKey: getApiRoutinesQueryKey(),
    queryFn: () => getApiRoutines(),
    ...options,
  });
}
```

### 3. TypeScript Types (`src/gen/types/`)

Request/response types:

```typescript
// src/gen/types/GetApiRoutines.ts
export type GetApiRoutinesQueryResponse = {
  routines: Routine[];
};
```

## API Client Setup

The generated clients use a custom axios instance:

```typescript
// src/lib/client.ts
import axios from "axios";
import type {
  RequestConfig,
  ResponseConfig,
  ResponseErrorConfig,
} from "@kubb/plugin-client/clients/axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

const personalClient = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  try {
    const response = await axiosInstance({
      ...config,
      withCredentials: true, // For cookie-based auth
    });

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number };
      code?: string;
    };

    // Handle 401 (unauthorized) and network errors
    if (
      axiosError?.response?.status === 401 ||
      axiosError?.code === "ERR_NETWORK"
    ) {
      window.location.href = "/";
    }

    throw error;
  }
};

export type { RequestConfig, ResponseConfig, ResponseErrorConfig };
export default personalClient;
```

## Regenerating API Client

After backend changes, regenerate the API client:

```bash
npm run generate
# or
bun run generate
```

This command:
1. Fetches the latest OpenAPI spec from `${VITE_API_URL}/openapi/json`
2. Generates client functions, hooks, and types
3. Outputs to `src/gen/` directory

## Using Generated Hooks

### Query Hooks

```typescript
import { useGetApiRoutines } from "@/gen";

function RoutinesList() {
  const { data, isLoading, error } = useGetApiRoutines();
  
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return (
    <div>
      {data?.routines.map((routine) => (
        <div key={routine.id}>{routine.name}</div>
      ))}
    </div>
  );
}
```

### Mutation Hooks

```typescript
import { usePostApiRoutineCreate } from "@/gen";

function CreateRoutine() {
  const { mutate, isPending } = usePostApiRoutineCreate({
    mutation: {
      onSuccess: () => {
        toast.success("Routine created!");
      },
    },
  });
  
  const handleSubmit = (data: RoutineFormData) => {
    mutate({ data });
  };
}
```

### Suspense Hooks

```typescript
import { useGetApiRoutineByIdSuspense } from "@/gen";

function RoutineDetail({ routineId }: { routineId: string }) {
  const { data } = useGetApiRoutineByIdSuspense(routineId);
  return <div>{data.name}</div>;
}
```

## Using Query Keys

Query keys are exported for cache management:

```typescript
import { getApiRoutinesQueryKey } from "@/gen";
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();
  
  const invalidateRoutines = () => {
    queryClient.invalidateQueries({
      queryKey: getApiRoutinesQueryKey(),
    });
  };
}
```

## Direct Client Functions

You can also use client functions directly (without React Query):

```typescript
import { getApiRoutines } from "@/gen/clients/getApiRoutines";

// In a non-React context or route loader
const routines = await getApiRoutines();
```

## Type Safety

All generated code is fully typed:

```typescript
import type { GetApiRoutinesQueryResponse } from "@/gen/types/GetApiRoutines";

function processRoutines(data: GetApiRoutinesQueryResponse) {
  // Fully typed
  data.routines.forEach((routine) => {
    console.log(routine.name); // TypeScript knows the structure
  });
}
```

## Best Practices

- ✅ Always regenerate API client after backend changes
- ✅ Use generated hooks instead of manual fetch calls
- ✅ Use Suspense hooks for route-level data loading
- ✅ Use query keys for cache invalidation
- ✅ Import from `@/gen` barrel export for convenience
- ✅ Check generated types when unsure about API structure
- ✅ Never manually edit generated files

