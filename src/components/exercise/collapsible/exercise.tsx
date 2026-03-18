import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH5, TypographySpan } from "@/components/ui/typography";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";
import type { WorkoutExercise } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, ChevronUpIcon, Copy, Plus, Trash } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const setSchema = z.object({
  type: z.enum(["warm-up", "valid"]).optional(),
  reps: z.number(),
  weight: z.number(),
  restTime: z.number(),
  order: z.number(),
});

const exerciseFormSchema = z.object({
  sets: z.array(setSchema),
  notes: z.string().optional(),
});

export type ExerciseFormData = z.infer<typeof exerciseFormSchema>;

// Simple deep equality check for ExerciseFormData
function isEqualExerciseData(a: ExerciseFormData, b: ExerciseFormData): boolean {
  if (a.notes !== b.notes) return false;
  if (a.sets.length !== b.sets.length) return false;

  for (let i = 0; i < a.sets.length; i++) {
    const setA = a.sets[i];
    const setB = b.sets[i];
    if (
      setA.type !== setB.type ||
      setA.reps !== setB.reps ||
      setA.weight !== setB.weight ||
      setA.restTime !== setB.restTime
    ) {
      return false;
    }
  }
  return true;
}

interface ExerciseCollapsibleProps {
  workoutId: string;
  exercise: WorkoutExercise;
  actions?: React.ReactNode;
  onSubmit?: (data: ExerciseFormData) => void;
  onFormChange?: (data: ExerciseFormData) => void;
}

export default function ExerciseCollapsible({ workoutId, exercise, actions, onSubmit, onFormChange }: ExerciseCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    watch,
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: {
      sets: Array.isArray(exercise.sets) && exercise.sets.length > 0
        ? exercise.sets.map((set, index) => ({
          type: set.type as "warm-up" | "valid" | undefined,
          reps: set.reps ?? 0,
          weight: set.weight ?? 0,
          restTime: set.rest ?? 0,
          order: index,
        }))
        : [],
      notes: "",
    },
  });

  const previousValuesRef = useRef<ExerciseFormData | null>(null);
  const isFirstRender = useRef(true);

  const handleFormChange = useCallback(
    (data: ExerciseFormData) => {
      if (onFormChange) {
        onFormChange(data);
      }
    },
    [onFormChange]
  );

  // Create debounced callback for onFormChange
  const debouncedOnFormChange = useDebounceCallback(handleFormChange, 750);

  // Use subscription to watch all form values - this detects nested changes
  useEffect(() => {
    const subscription = watch((value) => {
      const currentValues = value as ExerciseFormData;

      // Skip first render
      if (isFirstRender.current) {
        isFirstRender.current = false;
        previousValuesRef.current = currentValues;
        return;
      }

      const previousValues = previousValuesRef.current;

      // Check if values actually changed (deep comparison)
      if (previousValues && isEqualExerciseData(previousValues, currentValues)) {
        return;
      }

      // Update previous values
      previousValuesRef.current = currentValues;

      // Always validate and trigger onFormChange if valid
      // This ensures changes in nested fields are detected
      const isValid = exerciseFormSchema.safeParse(currentValues).success;
      if (isValid) {
        debouncedOnFormChange(currentValues);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedOnFormChange]);

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "sets",
  });

  // Helper function to trigger form change manually
  const triggerFormChange = useCallback(() => {
    const currentValues = getValues();
    const isValid = exerciseFormSchema.safeParse(currentValues).success;
    if (isValid) {
      debouncedOnFormChange(currentValues);
    }
  }, [getValues, debouncedOnFormChange]);

  const handleCopySet = (index: number) => {
    const currentSet = getValues(`sets.${index}`);
    insert(index + 1, {
      ...currentSet,
      order: index + 1,
    });
  };

  const handleDeleteSet = (index: number) => {
    remove(index);
  };

  const handleAddSet = () => {
    append({
      type: undefined,
      reps: 0,
      weight: 0,
      restTime: 0,
      order: fields.length,
    });
  };

  const onFormSubmit = (data: ExerciseFormData) => {
    onSubmit?.(data);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={exercise.exerciseData.thumbnailUrl} alt={exercise.exerciseData.name} />
            <AvatarFallback>{exercise.exerciseData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <TypographyH5 className="">{exercise.exerciseData.name}</TypographyH5>
          <TypographySpan className="text-muted-foreground">{fields.length} séries</TypographySpan>
          <CollapsibleTrigger className="cursor-pointer">
            {isOpen ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
          </CollapsibleTrigger>
        </div>
        {actions}
      </div>
      <CollapsibleContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 flex flex-col gap-2">

          <Controller
            name="notes"
            control={control}
            render={({ field: notesField }) => (
              <Field>
                <FieldLabel htmlFor="notes">Observações</FieldLabel>
                <FieldContent>
                  <Textarea
                    placeholder="Digite aqui as observações do exercício"
                    {...notesField}
                    className="w-full"
                  />
                </FieldContent>
              </Field>
            )}
          />
          <FieldGroup className="gap-1">
            <Field className="gap-1">
              <FieldContent>
                <div className="space-y-2">
                  {fields.length > 0 && (
                    <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-1 sm:gap-2 items-start">
                      <div className="text-sm text-muted-foreground w-[42px]">
                        <span>Tipo</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="hidden sm:inline">Repetições</span>
                        <span className="sm:hidden">Reps</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="hidden sm:inline">Peso (kg)</span>
                        <span className="sm:hidden">Peso(kg)</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="hidden sm:inline">Descanso (s)</span>
                        <span className="sm:hidden">Desc(s)</span>
                      </div>
                      <div className="w-20" />
                    </div>
                  )}

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-1 sm:gap-2 items-start"
                    >
                      <Controller
                        name={`sets.${index}.type`}
                        control={control}
                        render={({ field: typeField }) => {
                          const [open, setOpen] = useState(false);

                          const getTypeDisplay = (value?: string) => {
                            switch (value) {
                              case "warm-up":
                                return { icon: "A", label: "Aquecimento", color: "text-yellow-500" };
                              case "failure":
                                return { icon: "F", label: "Falha", color: "text-red-500" };
                              case "drop-set":
                                return { icon: "D", label: "Drop Set", color: "text-blue-500" };
                              default:
                                return { icon: "V", label: "Válida", color: "text-gray-400" };
                            }
                          };

                          const currentDisplay = getTypeDisplay(typeField.value);

                          const typeOptions = [
                            { value: "warm-up", icon: "A", label: "Aquecimento", color: "text-yellow-500" },
                            { value: "valid", icon: "V", label: "Válida", color: "text-gray-400" },
                            { value: "failure", icon: "F", label: "Falha", color: "text-red-500" },
                            { value: "drop-set", icon: "D", label: "Drop Set", color: "text-blue-500" },
                          ];

                          return (
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={` ${currentDisplay.color}  text-xs w-fit`}
                                >
                                  {currentDisplay.icon}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2" align="start">
                                <div className="flex flex-col gap-1 items-start">
                                  {typeOptions.map((option) => (
                                    <Button
                                      key={option.value || "none"}
                                      type="button"
                                      variant="ghost"
                                      onClick={() => {
                                        typeField.onChange(option.value);
                                        setOpen(false);
                                        // Manually trigger form change
                                        setTimeout(() => triggerFormChange(), 0);
                                      }}
                                      className={`${option.color} h-10 w-full items-center flex justify-start hover:${option.color}`}
                                    >
                                      <div className="border rounded-md px-2 py-1">
                                        {option.icon}
                                      </div>
                                      <span className="text-sm">{option.label}</span>
                                    </Button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          );
                        }}
                      />

                      <Controller
                        name={`sets.${index}.reps`}
                        control={control}
                        render={({ field: repsField }) => (
                          <Input
                            type="number"
                            placeholder="Reps"
                            min="0"
                            value={repsField.value === 0 ? "" : repsField.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                repsField.onChange(0);
                              } else {
                                const numValue = Number(value);
                                if (!Number.isNaN(numValue)) {
                                  repsField.onChange(numValue);
                                }
                              }
                              // Manually trigger form change
                              setTimeout(() => triggerFormChange(), 0);
                            }}
                            onBlur={repsField.onBlur}
                          />
                        )}
                      />

                      <Controller
                        name={`sets.${index}.weight`}
                        control={control}
                        render={({ field: weightField }) => (
                          <Input
                            type="number"
                            placeholder="Peso"
                            min="0"
                            step="0.5"
                            value={weightField.value === 0 ? "" : weightField.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                weightField.onChange(0);
                              } else {
                                const numValue = Number(value);
                                if (!Number.isNaN(numValue)) {
                                  weightField.onChange(numValue);
                                }
                              }
                              // Manually trigger form change
                              setTimeout(() => triggerFormChange(), 0);
                            }}
                            onBlur={weightField.onBlur}
                          />
                        )}
                      />

                      <Controller
                        name={`sets.${index}.restTime`}
                        control={control}
                        render={({ field: restTimeField }) => (
                          <Input
                            type="number"
                            placeholder="Descanso"
                            min="0"
                            value={restTimeField.value === 0 ? "" : restTimeField.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                restTimeField.onChange(0);
                              } else {
                                const numValue = Number(value);
                                if (!Number.isNaN(numValue)) {
                                  restTimeField.onChange(numValue);
                                }
                              }
                              // Manually trigger form change
                              setTimeout(() => triggerFormChange(), 0);
                            }}
                            onBlur={restTimeField.onBlur}
                          />
                        )}
                      />

                      <div className="flex gap-0 sm:gap-2 items-center justify-center flex-row">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopySet(index)}
                          aria-label="Copiar série"
                        >
                          <Copy />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteSet(index)}
                          aria-label="Deletar série"
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleAddSet}
                  >
                    <Plus />
                    Adicionar série
                  </Button>
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>
        </form >
      </CollapsibleContent >
    </Collapsible >
  )
}

