# Project Architecture Overview

This document provides an overview of the personal-web frontend application architecture. For detailed documentation on specific topics, see the [documentation files](./docs/) in the `docs/` directory.

## Quick Links

- [Product Overview](./docs/PRODUCT.md) - What the product does, users, domain model, key decisions
- [Routing](./docs/ROUTING.md) - TanStack Router patterns and route configuration
- [Data Fetching](./docs/DATA_FETCHING.md) - TanStack Query patterns and server state management
- [API Client](./docs/API_CLIENT.md) - Kubb configuration and generated API clients
- [Authentication](./docs/AUTHENTICATION.md) - Better Auth setup and session management
- [Forms](./docs/FORMS.md) - React Hook Form and Zod validation patterns
- [UI Components](./docs/UI_COMPONENTS.md) - shadcn/ui component library
- [Styling](./docs/STYLING.md) - Tailwind CSS patterns and utilities
- [State Management](./docs/STATE_MANAGEMENT.md) - State management strategies
- [Drag & Drop](./docs/DRAG_DROP.md) - Drag and drop implementation patterns
- [Testing](./docs/TESTING.md) - Testing setup and patterns
- [Build & Development](./docs/BUILD_DEVELOPMENT.md) - Development workflows
- [Best Practices](./docs/BEST_PRACTICES.md) - Coding standards and best practices
- [Client-Routine Integration](./docs/CLIENT_ROUTINE.md) - Assigning and cloning routines for clients
- [Client email activation](./docs/WHATSAPP_INVITE.md) - Verify email, resend activation, magic-link client login

---

## Architecture Overview

The application follows a **modern React architecture** with:

- **File-based routing** using TanStack Router
- **Type-safe API client** generated from OpenAPI spec via Kubb
- **Server state management** using TanStack Query (React Query)
- **Form management** with React Hook Form and Zod validation
- **Component library** built on Radix UI primitives (shadcn/ui)
- **Utility-first CSS** with Tailwind CSS

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser                               │
│  (React 19 + TanStack Router + TanStack Query)          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │ (Axios with credentials)
┌────────────────────▼────────────────────────────────────┐
│              personal-ai-api                             │
│  (ElysiaJS Backend with Better Auth)                    │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Core Framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server

### Routing
- **TanStack Router**: File-based routing with type safety
- **TanStack Router Devtools**: Development debugging

### Data Fetching & State
- **TanStack Query (React Query)**: Server state management, caching, synchronization
- **TanStack Query Devtools**: Development debugging
- **Axios**: HTTP client for API requests

### API Client Generation
- **Kubb**: Generate type-safe API clients from OpenAPI spec
- **@kubb/plugin-react-query**: Generate React Query hooks
- **@kubb/plugin-client**: Generate API client functions

### Authentication
- **Better Auth**: Authentication library with React integration
- **Better Auth Plugins**: Organization support, custom sessions

### Forms & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation and type inference
- **@hookform/resolvers**: Zod resolver for React Hook Form

### UI Components
- **Radix UI**: Headless component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### Styling
- **Tailwind CSS v4**: Utility-first CSS framework
- **@tailwindcss/vite**: Vite plugin for Tailwind
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Merge Tailwind classes intelligently
- **clsx**: Conditional class names

### Drag & Drop
- **@hello-pangea/dnd**: Drag and drop functionality (React DnD fork)

### Utilities
- **date-fns**: Date manipulation
- **libphonenumber-js**: Phone number validation
- **lodash.debounce**: Debounce utilities
- **use-mask-input**: Input masking for forms
- **recharts**: Chart library

### Development Tools
- **Biome**: Linting and formatting
- **Vitest**: Testing framework
- **@testing-library/react**: React testing utilities

---

## Project Structure

```
personal-web/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   ├── exercise/     # Exercise-specific components
│   │   ├── workout/      # Workout-specific components
│   │   ├── routine/      # Routine-specific components
│   │   ├── clients/      # Client-specific components
│   │   ├── trainer/      # Trainer dashboard components
│   │   └── activities/   # Activity components
│   ├── gen/              # Generated code (Kubb)
│   │   ├── clients/      # API client functions
│   │   ├── hooks/        # React Query hooks
│   │   └── types/        # TypeScript types
│   ├── routes/           # TanStack Router routes
│   │   ├── __root.tsx   # Root layout
│   │   ├── _auth/       # Auth routes (sign-in, sign-up)
│   │   ├── trainer/     # Trainer routes
│   │   └── client/      # Client routes
│   ├── pages/           # Page components (legacy, migrating to routes)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   │   ├── client.ts     # Axios instance
│   │   ├── auth-client.ts # Better Auth client
│   │   ├── utils.ts     # Utility functions
│   │   └── date.ts      # Date utilities
│   ├── schemas/         # Shared Zod schemas
│   ├── styles.css       # Global styles
│   └── main.tsx         # Application entry point
├── docs/                # Architecture documentation
│   ├── ROUTING.md
│   ├── DATA_FETCHING.md
│   ├── API_CLIENT.md
│   ├── AUTHENTICATION.md
│   ├── FORMS.md
│   ├── UI_COMPONENTS.md
│   ├── STYLING.md
│   ├── STATE_MANAGEMENT.md
│   ├── DRAG_DROP.md
│   ├── TESTING.md
│   ├── BUILD_DEVELOPMENT.md
│   └── BEST_PRACTICES.md
├── vite.config.ts       # Vite configuration
├── kubb.config.ts       # Kubb configuration
├── tsconfig.json        # TypeScript configuration
├── biome.json           # Biome configuration
└── package.json         # Dependencies
```

---

## Key Concepts

### Type-Safe API Integration

The application uses **Kubb** to generate type-safe API clients from the backend's OpenAPI specification. This ensures:

- Type-safe API calls
- Auto-completion in IDEs
- Compile-time error checking
- Automatic React Query hook generation

See [API_CLIENT.md](./docs/API_CLIENT.md) for details.

### File-Based Routing

Routes are defined as files in `src/routes/`, providing:

- Type-safe navigation
- Automatic code splitting
- Route guards for authentication
- Data loading before render

See [ROUTING.md](./docs/ROUTING.md) for details.

### Server State Management

All server state is managed by **TanStack Query**, providing:

- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

See [DATA_FETCHING.md](./docs/DATA_FETCHING.md) for details.

### Form Management

Forms use **React Hook Form** with **Zod** validation:

- Type-safe form data
- Runtime validation
- Performance optimized
- Easy error handling

See [FORMS.md](./docs/FORMS.md) for details.

---

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Building

```bash
npm run build
```

### Code Quality

```bash
npm run check  # Lint + format
npm run lint   # Lint only
npm run format # Format only
```

### API Client Generation

```bash
npm run generate  # Regenerate API client from OpenAPI spec
```

---

## Documentation Structure

The architecture documentation is split into focused files:

- **ROUTING.md**: Routing patterns, route configuration, navigation
- **DATA_FETCHING.md**: TanStack Query patterns, hooks, mutations
- **API_CLIENT.md**: Kubb setup, generated clients, type safety
- **AUTHENTICATION.md**: Better Auth setup, session management, route protection
- **FORMS.md**: React Hook Form patterns, Zod validation, field components
- **UI_COMPONENTS.md**: shadcn/ui components, component patterns
- **STYLING.md**: Tailwind CSS patterns, utilities, theming
- **STATE_MANAGEMENT.md**: State management strategies, patterns
- **DRAG_DROP.md**: Drag and drop implementation, optimistic updates
- **TESTING.md**: Testing setup, patterns, best practices
- **BUILD_DEVELOPMENT.md**: Development workflows, build process
- **BEST_PRACTICES.md**: Coding standards, conventions, guidelines

Each file is self-contained and focuses on a specific aspect of the architecture, making it easier to find relevant information and enabling agents to access only what they need.

---

## Summary

The personal-web application demonstrates:

1. **Modern React architecture**: React 19 with latest patterns
2. **Type safety**: Full TypeScript + Zod validation
3. **Type-safe API integration**: Kubb-generated clients from OpenAPI
4. **Excellent DX**: TanStack Router + Query Devtools
5. **Form management**: React Hook Form + Zod
6. **Component library**: shadcn/ui built on Radix UI
7. **Styling**: Tailwind CSS v4 with utility functions
8. **Authentication**: Better Auth with session management
9. **Performance**: Code splitting, optimistic updates, caching
10. **Developer experience**: Biome, Vitest, Vite

Use these patterns and practices when building new features to ensure consistency and quality across the codebase.

For detailed information on any topic, refer to the specific documentation files in the [docs/](./docs/) directory.
