import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { useCallback, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Simple deep equality check for RoutineFormData
function isEqualRoutineData(a: RoutineFormData, b: RoutineFormData): boolean {
  return (
    a.name === b.name &&
    a.duration === b.duration &&
    (a.description || "") === (b.description || "")
  );
}

export const routineFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  duration: z.number().min(0).max(50),
});

export type RoutineFormData = z.infer<typeof routineFormSchema>;

interface RoutineFormProps {
  onSubmit?: (data: RoutineFormData) => void;
  onFormChange?: (data: RoutineFormData) => void;
  initialValues?: RoutineFormData;
}

export default function RoutineForm({
  onSubmit,
  initialValues,
  onFormChange,
}: RoutineFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, isDirty },
  } = useForm<RoutineFormData>({
    resolver: zodResolver(routineFormSchema),
    defaultValues: initialValues ?? {
      name: "",
      duration: 0,
      description: "",
    },
  });

  const formValues = watch();

  const previousValuesRef = useRef<RoutineFormData | null>(null);
  const isFirstRender = useRef(true);

  const handleFormChange = useCallback(
    (data: RoutineFormData) => {
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
      previousValuesRef.current = formValues as RoutineFormData;
      return;
    }

    if (!isDirty) {
      return;
    }

    const currentValues = formValues as RoutineFormData;
    const previousValues = previousValuesRef.current;

    // Check if values actually changed (deep comparison)
    if (previousValues && isEqualRoutineData(previousValues, currentValues)) {
      return;
    }

    // Don't call onFormChange if values match initialValues (prevents loop after server update)
    if (initialValues) {
      const normalizedInitialValues: RoutineFormData = {
        name: initialValues.name,
        description: initialValues.description || "",
        duration: initialValues.duration,
      };
      if (isEqualRoutineData(currentValues, normalizedInitialValues)) {
        previousValuesRef.current = currentValues;
        return;
      }
    }

    // Update previous values
    previousValuesRef.current = currentValues;

    const isValid = routineFormSchema.safeParse(currentValues).success;
    if (isValid) {
      debouncedOnFormChange(currentValues);
    } else {
      // Trigger validation errors (debounced to avoid infinite loops)
      debouncedTrigger();
    }
  }, [formValues, isDirty, debouncedOnFormChange, debouncedTrigger, initialValues]);

  const handleSubmitForm = (data: RoutineFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form id="program-form" onSubmit={handleSubmit(handleSubmitForm)}>
      <FieldGroup>
        <div className="flex flex-col sm:flex-row gap-4">
          <Field className="flex-1 min-w-0">
            <FieldLabel htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                id="name"
                type="text"
                placeholder="Nome do programa"
                className="w-full"
                aria-invalid={errors.name ? "true" : "false"}
                {...register("name")}
              />
              {errors.name && (
                <FieldError errors={[{ message: errors.name.message }]} />
              )}
            </FieldContent>
          </Field>

          <Field className="flex-1 min-w-0">
            <FieldLabel htmlFor="duration">Duração do programa</FieldLabel>
            <FieldContent>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() ?? "0"}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="duration" className="w-full">
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Ilimitado</SelectItem>
                      {Array.from({ length: 50 }, (_, i) => i + 1).map((week) => (
                        <SelectItem key={week} value={week.toString()}>
                          {week} {week === 1 ? "semana" : "semanas"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.duration && (
                <FieldError
                  errors={[{ message: errors.duration.message }]}
                />
              )}
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="description">Descrição</FieldLabel>
          <FieldContent>
            <Textarea
              id="description"
              placeholder="Descrição do programa"
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

export function CreateProgramButton(
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) {
  return <Button type="submit" form="program-form" {...props} />;
}

