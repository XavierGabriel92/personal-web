import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import MultipleSelector, { type Option } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VideoFileUploader from "@/components/ui/video-file-uploader";
import { useGetApiExercisesFilters } from "@/gen";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { PlusIcon, XIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import type { Exercise } from "../schemas";

export const exerciseFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  equipmentIds: z.array(z.string()).optional(),
  primaryMuscleId: z.string().optional(),
  secondaryMuscleIds: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
  video: z.union([z.instanceof(File), z.string()]).optional(),
});

export type ExerciseFormData = z.infer<typeof exerciseFormSchema>;

// Helper function to convert Exercise to form data
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

interface ExerciseFormProps {
  onSubmit: (data: ExerciseFormData) => void;
  initialValues?: ExerciseFormData | Exercise;
}

export default function ExerciseForm({
  onSubmit,
  initialValues,
}: ExerciseFormProps) {
  const { data: filtersData } = useGetApiExercisesFilters();

  const formInitialValues = initialValues
    ? "exerciseId" in initialValues
      ? exerciseToFormData(initialValues)
      : initialValues
    : undefined;

  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: formInitialValues ?? {
      name: "",
      equipmentIds: [],
      primaryMuscleId: undefined,
      secondaryMuscleIds: [],
      instructions: [],
      video: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

  const videoValue = watch("video");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "instructions" as never,
  });

  // Convert API data to Option format for selects
  const equipmentOptions: Option[] =
    filtersData?.equipments.map((eq) => ({
      value: eq.id,
      label: eq.name,
    })) ?? [];

  const muscleOptions: Option[] =
    filtersData?.muscles.map((m) => ({
      value: m.id,
      label: m.name,
    })) ?? [];

  return (
    <form id="exercise-form" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">
            Nome <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              id="name"
              type="text"
              placeholder="Nome do exercício"
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
          <FieldLabel htmlFor="equipments">
            Equipamentos
          </FieldLabel>
          <FieldContent>
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
                    onSearchSync={(search) => {
                      // Always return all options when search is empty, filtered options when searching
                      if (!search || search.trim() === '') {
                        return equipmentOptions;
                      }
                      const searchLower = search.toLowerCase().trim();
                      return equipmentOptions.filter((option) =>
                        option.label.toLowerCase().includes(searchLower)
                      );
                    }}
                    placeholder="Selecione os equipamentos"
                    emptyIndicator={
                      <p className="text-center text-sm text-muted-foreground">
                        Nenhum equipamento encontrado.
                      </p>
                    }
                  />
                );
              }}
            />
          </FieldContent>
        </Field>

        <Field className="flex-1 min-w-0">
          <FieldLabel htmlFor="primaryMuscle">
            Músculo Primário
          </FieldLabel>
          <FieldContent>
            <Controller
              name="primaryMuscleId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="primaryMuscle" className="w-full">
                    <SelectValue placeholder="Selecione o músculo primário" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleOptions.map((muscle) => (
                      <SelectItem key={muscle.value} value={muscle.value}>
                        {muscle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="secondaryMuscles">Músculos Secundários</FieldLabel>
          <FieldContent>
            <Controller
              name="secondaryMuscleIds"
              control={control}
              render={({ field }) => {
                const selectedOptions =
                  field.value
                    ?.map((v) => muscleOptions.find((m) => m.value === v))
                    .filter((opt): opt is Option => opt !== undefined) || [];

                return (
                  <MultipleSelector
                    value={selectedOptions}
                    onChange={(options) => {
                      field.onChange(options.map((opt) => opt.value));
                    }}
                    options={muscleOptions}
                    onSearchSync={(search) => {
                      // Always return all options when search is empty, filtered options when searching
                      if (!search || search.trim() === '') {
                        return muscleOptions;
                      }
                      const searchLower = search.toLowerCase().trim();
                      return muscleOptions.filter((option) =>
                        option.label.toLowerCase().includes(searchLower)
                      );
                    }}
                    placeholder="Selecione os músculos secundários"
                    emptyIndicator={
                      <p className="text-center text-sm text-muted-foreground">
                        Nenhum músculo encontrado.
                      </p>
                    }
                  />
                );
              }}
            />
          </FieldContent>
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-0">
            <FieldLabel htmlFor="instructions">Instruções</FieldLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append("")}
              className="h-8 w-8 p-0"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <FieldContent>
            <div className="flex flex-col gap-1 pl-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`instructions.${index}` as const)}
                    placeholder={`Instrução ${index + 1}`}
                    aria-invalid={
                      errors.instructions?.[index] ? "true" : "false"
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 shrink-0"
                    aria-label="Remover instrução"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.instructions && (
              <FieldError
                errors={[
                  {
                    message:
                      errors.instructions.message ||
                      "Erro nas instruções",
                  },
                ]}
              />
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="video">Vídeo do Exercício</FieldLabel>
          <FieldContent>
            <Controller
              name="video"
              control={control}
              render={({ field }) => (
                <VideoFileUploader
                  value={videoValue ?? null}
                  onChange={(file) => {
                    // Convert null to undefined to match schema validation (File | string | undefined)
                    field.onChange(file ?? undefined);
                  }}
                />
              )}
            />
            {errors.video && (
              <FieldError errors={[{ message: errors.video.message }]} />
            )}
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  );
}

export function CreateExerciseButton(
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) {
  return <Button type="submit" form="exercise-form" {...props} />;
}

