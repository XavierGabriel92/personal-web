# Best Practices

This document describes best practices and coding standards for the application.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## Component Organization

- ✅ Group components by feature/domain
- ✅ Keep components small and focused
- ✅ Extract reusable logic into custom hooks
- ✅ Use TypeScript for all components
- ✅ One component per file
- ✅ Use PascalCase for component names
- ✅ Export components as default or named exports consistently

## Type Safety

- ✅ Use generated types from Kubb
- ✅ Define Zod schemas for all forms
- ✅ Export types from schemas: `type FormData = z.infer<typeof schema>`
- ✅ Use TypeScript strict mode
- ✅ Avoid `any` type
- ✅ Use type assertions sparingly
- ✅ Leverage TypeScript's type inference

## Data Fetching

- ✅ Use generated React Query hooks
- ✅ Use Suspense queries for route-level data
- ✅ Implement optimistic updates for better UX
- ✅ Invalidate queries after mutations
- ✅ Use query keys consistently
- ✅ Handle loading and error states
- ✅ Use staleTime to reduce unnecessary refetches

## Forms

- ✅ Always use Zod schemas for validation
- ✅ Use React Hook Form for form state
- ✅ Provide clear error messages
- ✅ Debounce form changes for real-time updates
- ✅ Use controlled components for complex inputs
- ✅ Reset form after successful submission
- ✅ Handle loading states during submission

## Error Handling

- ✅ Handle API errors gracefully
- ✅ Show user-friendly error messages (toasts)
- ✅ Rollback optimistic updates on error
- ✅ Handle network errors (redirect to login)
- ✅ Log errors for debugging
- ✅ Provide fallback UI for error states

## Performance

- ✅ Use React.memo for expensive components
- ✅ Use useCallback for event handlers passed to children
- ✅ Use useMemo for expensive computations
- ✅ Implement code splitting (automatic with TanStack Router)
- ✅ Debounce search/filter inputs
- ✅ Lazy load heavy components
- ✅ Optimize images and assets

## Accessibility

- ✅ Use semantic HTML
- ✅ Provide ARIA labels where needed
- ✅ Ensure keyboard navigation works
- ✅ Test with screen readers
- ✅ Use proper heading hierarchy
- ✅ Provide alt text for images
- ✅ Ensure sufficient color contrast

## Code Style

- ✅ Follow Biome configuration
- ✅ Use consistent naming conventions
- ✅ Keep functions small and focused
- ✅ Add comments for complex logic
- ✅ Use meaningful variable names
- ✅ Use destructuring for props and state
- ✅ Prefer const over let
- ✅ Use template literals for strings

## API Integration

- ✅ Always regenerate API client after backend changes
- ✅ Use generated hooks instead of manual fetch calls
- ✅ Handle loading and error states
- ✅ Implement retry logic where appropriate
- ✅ Use Suspense queries for route data
- ✅ Invalidate queries after mutations

## State Management

- ✅ Use TanStack Query for server state
- ✅ Use React state for local UI state
- ✅ Use URL state for shareable/filterable state
- ✅ Avoid prop drilling (use context if needed)
- ✅ Keep state as close to where it's used as possible
- ✅ Lift state up only when necessary

## Routing

- ✅ Use file-based routing structure
- ✅ Protect routes with `beforeLoad` guards
- ✅ Use Suspense queries for route-level data loading
- ✅ Leverage type-safe navigation
- ✅ Use route parameters for dynamic segments
- ✅ Use search parameters for filters/pagination

## Styling

- ✅ Use `cn()` utility for conditional classes
- ✅ Use Tailwind's responsive breakpoints
- ✅ Use theme colors for consistency
- ✅ Use component variants (CVA) for reusable components
- ✅ Keep utility classes readable
- ✅ Avoid inline styles when possible

## Testing

- ✅ Write tests for components
- ✅ Test user interactions
- ✅ Test error states
- ✅ Test loading states
- ✅ Mock API calls
- ✅ Use Testing Library queries
- ✅ Keep tests focused and isolated

## Git & Version Control

- ✅ Write clear commit messages
- ✅ Keep commits focused and atomic
- ✅ Use meaningful branch names
- ✅ Review code before merging
- ✅ Keep `.env` files out of version control
- ✅ Keep generated files (`src/gen/`) in version control

## Documentation

- ✅ Document complex logic
- ✅ Add JSDoc comments for functions
- ✅ Keep README up to date
- ✅ Document component props
- ✅ Document API integration patterns

