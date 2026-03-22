# UI Components

This document describes the UI component library and component patterns.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## Component Library: shadcn/ui

The application uses **shadcn/ui**, a collection of reusable components built on Radix UI primitives.

## Component Structure

```
components/ui/
├── button.tsx          # Button component
├── input.tsx           # Input component
├── select.tsx          # Select component
├── field.tsx           # Form field components
├── card.tsx            # Card component
├── dialog.tsx          # Dialog/Modal component
├── alert-dialog.tsx    # Confirmation/alert dialog component
├── sheet.tsx           # Side sheet component
├── table.tsx           # Table component
├── form.tsx            # Form wrapper
├── toast.tsx           # Toast notifications
├── alert.tsx           # Alert component
├── badge.tsx           # Badge component
├── avatar.tsx          # Avatar component
├── dropdown-menu.tsx   # Dropdown menu
├── tabs.tsx            # Tabs component
└── ...                 # More components
```

## Component Usage Pattern

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            {/* Dialog content */}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
```

## Field Components

Custom field components for consistent form styling:

```typescript
// components/ui/field.tsx
export {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldDescription,
  FieldSeparator,
  FieldTitle,
  FieldLegend,
  FieldSet,
};
```

### Field Component Usage

```typescript
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

<FieldGroup>
  <Field>
    <FieldLabel htmlFor="name">
      Name <span className="text-destructive">*</span>
    </FieldLabel>
    <FieldContent>
      <Input
        id="name"
        {...register("name")}
        aria-invalid={errors.name ? "true" : "false"}
      />
      {errors.name && (
        <FieldError errors={[{ message: errors.name.message }]} />
      )}
    </FieldContent>
  </Field>
</FieldGroup>
```

## Button Component

```typescript
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// States
<Button disabled>Disabled</Button>
<Button isLoading>Loading...</Button>
```

## Dialog Component

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogHeader>
        {/* Dialog content */}
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## AlertDialog Component

Use `AlertDialog` for non-dismissable confirmations or error messages that require explicit user acknowledgement. Unlike `Dialog`, it is not closable by clicking outside.

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function MyAlertDialog() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### AlertDialog for API error feedback

When a mutation returns a known API error (e.g. a duplicate-record conflict), use a controlled `AlertDialog` instead of a toast so the user must explicitly acknowledge the issue:

```typescript
const [duplicatePhoneError, setDuplicatePhoneError] = useState(false);

await createClient(data, {
  onError: (error: unknown) => {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    if (message === "Phone number already exists") {
      setDuplicatePhoneError(true);
    } else {
      toast.error("Erro ao criar aluno. Tente novamente.");
    }
  },
});

<AlertDialog open={duplicatePhoneError} onOpenChange={setDuplicatePhoneError}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Número já cadastrado</AlertDialogTitle>
      <AlertDialogDescription>
        Já existe um aluno cadastrado com esse número de telefone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction>Entendi</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Sheet Component

Side sheet for mobile-friendly modals:

```typescript
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

function MySheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet description</SheetDescription>
        </SheetHeader>
        {/* Sheet content */}
      </SheetContent>
    </Sheet>
  );
}
```

## Toast Notifications

```typescript
import { toast } from "sonner";

// Success
toast.success("Operation completed successfully!");

// Error
toast.error("Something went wrong");

// Info
toast.info("Here's some information");

// Loading
const toastId = toast.loading("Processing...");
toast.success("Done!", { id: toastId });
```

Toast provider is set up in root route:

```typescript
// src/routes/__root.tsx
import { Toaster } from "@/components/ui/sonner";

<QueryClientProvider client={queryClient}>
  <Toaster richColors />
  <Outlet />
</QueryClientProvider>
```

## Select Component

```typescript
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

## Multi-Select Component

```typescript
import MultipleSelector, { type Option } from "@/components/ui/multi-select";

const options: Option[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
];

<MultipleSelector
  value={selectedOptions}
  onChange={setSelectedOptions}
  options={options}
  placeholder="Select options"
  onSearchSync={(search) => {
    if (!search) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }}
/>
```

## Adding New Components

Use shadcn CLI to add components:

```bash
pnpx shadcn@latest add button
pnpx shadcn@latest add dialog
pnpx shadcn@latest add alert-dialog
pnpx shadcn@latest add table
```

Components are added to `src/components/ui/` and can be customized.

## Component Variants

Components use `class-variance-authority` for variants:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "base-button-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        destructive: "destructive-classes",
        outline: "outline-classes",
        ghost: "ghost-classes",
      },
      size: {
        default: "default-size",
        sm: "small-size",
        lg: "large-size",
        icon: "icon-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## Best Practices

- ✅ Use shadcn/ui components for consistency
- ✅ Customize components in `src/components/ui/` as needed
- ✅ Use Field components for form inputs
- ✅ Use Dialog for desktop modals
- ✅ Use AlertDialog for errors or confirmations requiring explicit acknowledgement
- ✅ Use Sheet for mobile-friendly modals
- ✅ Use Toast for transient, non-blocking notifications; use AlertDialog for errors the user must acknowledge
- ✅ Follow component composition patterns
- ✅ Keep components focused and reusable
- ✅ Use TypeScript for all components
- ✅ Export component types for consumers
