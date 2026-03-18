# Testing

This document describes testing patterns and setup.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## Vitest

The application uses **Vitest** for unit and integration testing.

## Test Setup

```typescript
// vitest.config.ts (if exists)
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

## Testing Library

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

## Component Testing

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
  
  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Testing with React Query

Mock React Query hooks:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe("RoutinesList", () => {
  it("renders routines", () => {
    renderWithQueryClient(<RoutinesList />);
    // Test implementation
  });
});
```

## Testing Forms

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import MyForm from "./MyForm";

describe("MyForm", () => {
  it("submits form data", async () => {
    const onSubmit = vi.fn();
    render(<MyForm onSubmit={onSubmit} />);
    
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Name"), "Test Name");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Test Name",
      });
    });
  });
  
  it("shows validation errors", async () => {
    render(<MyForm onSubmit={vi.fn()} />);
    
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Submit" }));
    
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });
});
```

## Running Tests

```bash
npm run test
# or
bun run test
```

## Test Coverage

```bash
npm run test -- --coverage
```

## Best Practices

- ✅ Write tests for components
- ✅ Test user interactions (clicks, form submissions)
- ✅ Test error states
- ✅ Test loading states
- ✅ Mock API calls
- ✅ Use Testing Library queries (getByRole, getByText, etc.)
- ✅ Use userEvent for interactions
- ✅ Use waitFor for async operations
- ✅ Keep tests focused and isolated
- ✅ Use descriptive test names
- ✅ Test accessibility (ARIA labels, keyboard navigation)

