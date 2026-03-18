# Forms & Validation

This document describes form management patterns using React Hook Form and Zod validation.

For general architecture patterns, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## React Hook Form + Zod

All forms use React Hook Form with Zod validation for type-safe form handling.

## Basic Form Setup

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define schema
const exerciseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  equipmentIds: z.array(z.string()).optional(),
  primaryMuscleId: z.string().optional(),
  secondaryMuscleIds: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
  video: z.union([z.instanceof(File), z.string()]).optional(),
});

type ExerciseFormData = z.infer<typeof exerciseFormSchema>;

// Use in component
function ExerciseForm({ onSubmit }: { onSubmit: (data: ExerciseFormData) => void }) {
  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: {
      name: "",
      equipmentIds: [],
      primaryMuscleId: undefined,
      secondaryMuscleIds: [],
      instructions: [],
      video: undefined,
    },
  });
  
  const { register, handleSubmit, control, formState: { errors } } = form;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Field Components

Custom field components for consistent form styling:

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

## Controlled Components

For complex inputs (Select, MultiSelect), use Controller:

```typescript
import { Controller } from "react-hook-form";
import { MultipleSelector } from "@/components/ui/multi-select";

<Controller
  name="equipmentIds"
  control={control}
  render={({ field }) => {
    const selectedOptions =
      field.value
        ?.map((v) => equipmentOptions.find((eq) => eq.value === v))
        .filter((opt): opt is Option => opt !== undefined) || [];

    return (
      <MultipleSelector
        value={selectedOptions}
        onChange={(options) => {
          field.onChange(options.map((opt) => opt.value));
        }}
        options={equipmentOptions}
      />
    );
  }}
/>
```

## Field Arrays

For dynamic lists (e.g., instructions):

```typescript
import { useFieldArray } from "react-hook-form";

const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "instructions",
});

{fields.map((field, index) => (
  <div key={field.id} className="flex gap-2">
    <Input
      {...register(`instructions.${index}`)}
      placeholder={`Instruction ${index + 1}`}
    />
    <Button
      type="button"
      onClick={() => remove(index)}
      variant="ghost"
      size="icon"
    >
      <XIcon className="h-4 w-4" />
    </Button>
  </div>
))}
```

## Input Masking

For phone numbers and other formatted inputs:

```typescript
import { useHookFormMask } from "use-mask-input";

const registerWithMask = useHookFormMask(register);

<Input
  {...registerWithMask("phone", ["(99)99999-9999", "(99)9999-9999"], {
    required: true,
  })}
  placeholder="(99)99999-9999"
/>
```

## Custom Validation

Zod refinements for complex validation:

```typescript
import { parsePhoneNumberWithError } from "libphonenumber-js";

const brazilianPhoneSchema = z
  .string()
  .min(1, "Phone is required")
  .refine(
    (phone) => {
      try {
        const phoneNumber = parsePhoneNumberWithError(phone, "BR");
        return phoneNumber.isValid();
      } catch {
        return false;
      }
    },
    { message: "Phone must be a valid Brazilian number" }
  );

const clientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: brazilianPhoneSchema,
  goals: z.string().optional(),
});
```

## Debounced Form Changes

For real-time form updates without excessive API calls:

```typescript
import { useDebounceCallback } from "@/hooks/use-debounce-callback";
import { useEffect, useRef } from "react";

function MyForm({ onFormChange }: { onFormChange?: (data: FormData) => void }) {
  const form = useForm<FormData>({ /* ... */ });
  const formValues = watch();
  const previousValuesRef = useRef<FormData | null>(null);
  const isFirstRender = useRef(true);

  const handleFormChange = useCallback(
    (data: FormData) => {
      if (onFormChange) {
        onFormChange(data);
      }
    },
    [onFormChange]
  );

  const debouncedOnFormChange = useDebounceCallback(handleFormChange, 500);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    debouncedOnFormChange(formValues);
  }, [formValues, debouncedOnFormChange]);
}
```

## Form Submission with Mutations

```typescript
import { usePostApiRoutineCreate } from "@/gen";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function CreateRoutineForm() {
  const queryClient = useQueryClient();
  const form = useForm<RoutineFormData>({ /* ... */ });
  
  const { mutate, isPending } = usePostApiRoutineCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiRoutinesQueryKey(),
        });
        toast.success("Routine created!");
        form.reset(); // Reset form after success
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create routine");
      },
    },
  });
  
  const handleSubmit = (data: RoutineFormData) => {
    mutate({ data });
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Form fields */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
```

## Form with Initial Values

```typescript
function EditExerciseForm({ exercise }: { exercise: Exercise }) {
  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: exerciseToFormData(exercise), // Convert exercise to form data
  });
  
  // Form will be pre-filled with exercise data
}
```

## Helper: Convert Entity to Form Data

```typescript
export function exerciseToFormData(exercise: Exercise): ExerciseFormData {
  return {
    name: exercise.name,
    equipmentIds: exercise.equipments.map((eq) => eq.id),
    primaryMuscleId: exercise.primaryMuscle?.id,
    secondaryMuscleIds: exercise.secondaryMuscles.map((m) => m.id) ?? [],
    instructions: exercise.instructions ?? [],
    video: exercise.videoUrl ?? undefined,
  };
}
```

## Best Practices

- ✅ Always use Zod schemas for validation
- ✅ Use React Hook Form for form state management
- ✅ Provide clear error messages
- ✅ Use Field components for consistent styling
- ✅ Use Controller for complex inputs (Select, MultiSelect)
- ✅ Use useFieldArray for dynamic lists
- ✅ Debounce form changes for real-time updates
- ✅ Reset form after successful submission
- ✅ Handle loading states during submission
- ✅ Show validation errors inline
- ✅ Use input masking for formatted inputs (phone, etc.)
- ✅ Export types from schemas: `type FormData = z.infer<typeof schema>`

