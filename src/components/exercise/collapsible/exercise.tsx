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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TypographyH5, TypographySpan } from "@/components/ui/typography";
import type { Exercise } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, ChevronUpIcon, Copy, HelpCircle, Plus, Trash } from "lucide-react";
import { useState } from "react";
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

interface ExerciseCollapsibleProps {
  workoutId: string;
  exercise: Exercise;
  actions?: React.ReactNode;
  onSubmit?: (data: ExerciseFormData) => void;
}

export default function ExerciseCollapsible({ workoutId, exercise, actions, onSubmit }: ExerciseCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: {
      sets: exercise.sets.map((set) => ({
        type: set.type as "warm-up" | "valid" | undefined,
        reps: set.reps ?? 0,
        weight: set.weight ?? 0,
        restTime: set.restTime ?? 0,
        order: set.order ?? 0,
      })),
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "sets",
  });

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
            <AvatarImage src={exercise.img} alt={exercise.name} />
            <AvatarFallback>{exercise.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <TypographyH5 className="">{exercise.name}</TypographyH5>
          <TypographySpan className="text-muted-foreground">{fields.length} séries</TypographySpan>
          <CollapsibleTrigger>
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
                            {...repsField}
                            value={repsField.value ?? ""}
                            onChange={(e) =>
                              repsField.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                            }
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
                            {...weightField}
                            value={weightField.value ?? ""}
                            onChange={(e) =>
                              weightField.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                            }
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
                            {...restTimeField}
                            value={restTimeField.value ?? ""}
                            onChange={(e) =>
                              restTimeField.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                            }
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

