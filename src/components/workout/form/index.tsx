import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Simple deep equality check for WorkoutFormData
function isEqualWorkoutData(a: WorkoutFormData, b: WorkoutFormData): boolean {
  return (
    a.name === b.name &&
    (a.description || "") === (b.description || "")
  );
}

export const workoutFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export type WorkoutFormData = z.infer<typeof workoutFormSchema>;

interface WorkoutFormProps {
  onSubmit?: (data: WorkoutFormData) => void;
  onFormChange?: (data: WorkoutFormData) => void;
  initialValues?: WorkoutFormData;
}

export default function WorkoutForm({
  onSubmit,
  initialValues,
  onFormChange,
}: WorkoutFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isDirty },
  } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: initialValues ?? {
      name: "",
      description: "",
    },
  });

  const formValues = watch();

  const previousValuesRef = useRef<WorkoutFormData | null>(null);
  const isFirstRender = useRef(true);

  const handleFormChange = useCallback(
    (data: WorkoutFormData) => {
      if (onFormChange) {
        onFormChange(data);
      }
    },
    [onFormChange]
  );

  // Create debounced callback for onFormChange
  const debouncedOnFormChange = useDebounceCallback(handleFormChange, 500);

  // Debounced trigger for validation
  const debouncedTrigger = useDebounceCallback(
    () => {
      trigger();
    },
    500
  );

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousValuesRef.current = formValues as WorkoutFormData;
      return;
    }

    if (!isDirty) {
      return;
    }

    const currentValues = formValues as WorkoutFormData;
    const previousValues = previousValuesRef.current;

    // Check if values actually changed (deep comparison)
    if (previousValues && isEqualWorkoutData(previousValues, currentValues)) {
      return;
    }

    // Don't call onFormChange if values match initialValues (prevents loop after server update)
    if (initialValues) {
      const normalizedInitialValues: WorkoutFormData = {
        name: initialValues.name,
        description: initialValues.description || "",
      };
      if (isEqualWorkoutData(currentValues, normalizedInitialValues)) {
        previousValuesRef.current = currentValues;
        return;
      }
    }

    // Update previous values
    previousValuesRef.current = currentValues;

    const isValid = workoutFormSchema.safeParse(currentValues).success;
    if (isValid) {
      debouncedOnFormChange(currentValues);
    } else {
      // Trigger validation errors (debounced to avoid infinite loops)
      debouncedTrigger();
    }
  }, [formValues, isDirty, debouncedOnFormChange, debouncedTrigger, initialValues]);

  const handleSubmitForm = (data: WorkoutFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form id="workout-form" onSubmit={handleSubmit(handleSubmitForm)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">
            Nome <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              id="name"
              type="text"
              placeholder="Nome do treino"
              className="w-full"
              aria-invalid={errors.name ? "true" : "false"}
              {...register("name")}
            />
            {errors.name && (
              <FieldError errors={[{ message: errors.name.message }]} />
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Descrição</FieldLabel>
          <FieldContent>
            <Textarea
              id="description"
              placeholder="Descrição do treino"
              aria-invalid={errors.description ? "true" : "false"}
              {...register("description")}
            />
            {errors.description && (
              <FieldError errors={[{ message: errors.description.message }]} />
            )}
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  );
}

export function CreateWorkoutButton(
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) {
  return <Button type="submit" form="workout-form" {...props} />;
}

