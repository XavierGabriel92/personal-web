# Styling

This document describes styling patterns using Tailwind CSS v4.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## Tailwind CSS v4

The application uses **Tailwind CSS v4** with the Vite plugin.

## Configuration

```typescript
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(), // Tailwind Vite plugin
    // ...
  ],
});
```

## Utility Functions

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

The `cn` function:
- Merges Tailwind classes intelligently
- Handles conditional classes
- Resolves conflicts (later classes override earlier ones)

## Usage Pattern

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  anotherCondition && "more-classes"
)}>
```

### Example

```typescript
<Button
  className={cn(
    "px-4 py-2",
    isActive && "bg-primary text-primary-foreground",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
>
  Click me
</Button>
```

## Theme Provider

Dark/light mode support:

```typescript
// src/components/theme-provider/index.tsx
import { ThemeProvider } from "@/components/theme-provider";

<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
  <App />
</ThemeProvider>
```

### Using Theme

```typescript
import { useTheme } from "@/components/theme-provider";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </Button>
  );
}
```

## Component Variants

Using `class-variance-authority` for component variants:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## Responsive Design

Tailwind's responsive breakpoints:

```typescript
<div className="
  text-sm          // Mobile (default)
  md:text-base     // Tablet (768px+)
  lg:text-lg       // Desktop (1024px+)
  xl:text-xl       // Large desktop (1280px+)
">
```

## Common Patterns

### Flexbox Layouts

```typescript
<div className="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

### Grid Layouts

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

### Spacing

```typescript
<div className="space-y-4"> {/* Vertical spacing */}
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div className="flex gap-4"> {/* Horizontal spacing */}
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Colors

```typescript
// Using theme colors
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-muted text-muted-foreground">
<div className="text-destructive">Error text</div>
```

## Best Practices

- ✅ Use `cn()` utility for conditional classes
- ✅ Use Tailwind's responsive breakpoints
- ✅ Use theme colors for consistency
- ✅ Use component variants (CVA) for reusable components
- ✅ Keep utility classes readable
- ✅ Use semantic color names (primary, destructive, etc.)
- ✅ Leverage Tailwind's spacing scale
- ✅ Use Tailwind's typography scale
- ✅ Avoid inline styles when possible
- ✅ Use CSS variables for theme customization

