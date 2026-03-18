# Build & Development

This document describes build and development workflows.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## Development Server

Start the development server:

```bash
npm run dev
# or
bun run dev
```

Starts Vite dev server on port 4000 (or `process.env.PORT`).

### Features

- Hot Module Replacement (HMR)
- Fast refresh
- TypeScript support
- Path aliases (`@/` resolves to `src/`)

## Building for Production

Build optimized production bundle:

```bash
npm run build
# or
bun run build
```

Builds optimized production bundle to `dist/` directory.

### Build Output

- Optimized JavaScript bundles
- Minified CSS
- Tree-shaken dependencies
- Code splitting per route

## Preview Production Build

Preview the production build locally:

```bash
npm run serve
# or
bun run serve
```

## Code Quality

### Linting

```bash
npm run lint
```

Runs Biome linter to check for code issues.

### Formatting

```bash
npm run format
```

Formats code using Biome formatter.

### Check (Lint + Format)

```bash
npm run check
```

Runs both linting and formatting checks.

## Environment Variables

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_URL=http://localhost:4000
PORT=4000
```

### Environment Variable Usage

```typescript
// Access in code
const apiUrl = import.meta.env.VITE_API_URL;
const appUrl = import.meta.env.VITE_APP_URL;
```

**Note**: Only variables prefixed with `VITE_` are exposed to the client.

## API Client Generation

Regenerate API client after backend changes:

```bash
npm run generate
# or
bun run generate
```

This:
1. Fetches OpenAPI spec from `${VITE_API_URL}/openapi/json`
2. Generates client functions, hooks, and types
3. Outputs to `src/gen/` directory

## TypeScript

Type checking:

```bash
npm run build
# Includes TypeScript compilation
```

TypeScript configuration in `tsconfig.json`.

## Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    devtools(),              // TanStack Devtools
    tanstackRouter({         // TanStack Router plugin
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    viteReact(),             // React plugin
    tailwindcss(),           // Tailwind CSS plugin
    tsconfigPaths(),         // Path aliases
  ],
  build: {
    target: "es2022",
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4000,
    origin: process.env.VITE_APP_URL,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

## Development Tools

### TanStack Router Devtools

Router devtools are enabled in development:

```typescript
// Automatically included via vite plugin
```

### TanStack Query Devtools

Query devtools can be added to root route:

```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <Outlet />
  <ReactQueryDevtools />
</QueryClientProvider>
```

## Best Practices

- ✅ Run `npm run check` before committing
- ✅ Regenerate API client after backend changes
- ✅ Use environment variables for configuration
- ✅ Keep `.env` file out of version control
- ✅ Test production build locally before deploying
- ✅ Use TypeScript strict mode
- ✅ Follow Biome configuration
- ✅ Use path aliases (`@/`) for imports
- ✅ Keep build output (`dist/`) out of version control

