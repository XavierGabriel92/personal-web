import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import ImgFileUploader from "@/components/ui/img-file-uploader";
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
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { PlusIcon, XIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// Mock exercise types
const EXERCISE_TYPES = [
  { value: "strength", label: "Força" },
  { value: "cardio", label: "Cardio" },
  { value: "flexibility", label: "Flexibilidade" },
  { value: "balance", label: "Equilíbrio" },
  { value: "plyometric", label: "Pliométrico" },
  { value: "power", label: "Potência" },
  { value: "endurance", label: "Resistência" },
];

// Mock equipment data
const MOCK_EQUIPMENT = [
  { value: "none", label: "Nenhum" },
  { value: "barbell", label: "Barra" },
  { value: "dumbbell", label: "Halteres" },
  { value: "cable", label: "Cabo" },
  { value: "machine", label: "Máquina" },
  { value: "bodyweight", label: "Peso corporal" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "resistance-band", label: "Faixa elástica" },
  { value: "smith-machine", label: "Smith Machine" },
];

// Mock muscles data
const MOCK_MUSCLES: Option[] = [
  { value: "chest", label: "Peito" },
  { value: "back", label: "Costas" },
  { value: "shoulders", label: "Ombros" },
  { value: "biceps", label: "Bíceps" },
  { value: "triceps", label: "Tríceps" },
  { value: "forearms", label: "Antebraços" },
  { value: "abs", label: "Abdômen" },
  { value: "quadriceps", label: "Quadríceps" },
  { value: "hamstrings", label: "Posteriores" },
  { value: "glutes", label: "Glúteos" },
  { value: "calves", label: "Panturrilhas" },
  { value: "traps", label: "Trapézios" },
];

export const exerciseFormSchema = z.object({
  img: z.union([z.instanceof(File), z.string()]).optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  equipment: z.string().min(1, "Equipamento é obrigatório"),
  primaryMuscle: z.string().min(1, "Músculo primário é obrigatório"),
  otherMuscles: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
  video: z.union([z.instanceof(File), z.string()]).optional(),
});

export type ExerciseFormData = z.infer<typeof exerciseFormSchema>;

interface ExerciseFormProps {
  onSubmit: (data: ExerciseFormData) => void;
  initialValues?: ExerciseFormData;
}

export default function ExerciseForm({
  onSubmit,
  initialValues,
}: ExerciseFormProps) {
  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: initialValues ?? {
      img: undefined,
      name: "",
      type: "",
      equipment: "none",
      primaryMuscle: "",
      otherMuscles: [],
      instructions: [],
      video: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "instructions" as never,
  });

  return (
    <form id="exercise-form" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldContent>
            <Controller
              name="img"
              control={control}
              render={({ field }) => (
                <ImgFileUploader
                  value={field.value ?? null}
                  onChange={(file) => {
                    field.onChange(file ?? undefined);
                  }}
                />
              )}
            />
          </FieldContent>
        </Field>

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

        <Field className="flex-1 min-w-0">
          <FieldLabel htmlFor="type">
            Tipo <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXERCISE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <FieldError errors={[{ message: errors.type.message }]} />
            )}
          </FieldContent>
        </Field>

        <Field className="flex-1 min-w-0">
          <FieldLabel htmlFor="equipment">
            Equipamento <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="equipment"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="equipment" className="w-full">
                    <SelectValue placeholder="Selecione o equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_EQUIPMENT.map((equipment) => (
                      <SelectItem key={equipment.value} value={equipment.value}>
                        {equipment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.equipment && (
              <FieldError errors={[{ message: errors.equipment.message }]} />
            )}
          </FieldContent>
        </Field>

        <Field className="flex-1 min-w-0">
          <FieldLabel htmlFor="primaryMuscle">
            Músculo Primário <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="primaryMuscle"
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
                    {MOCK_MUSCLES.map((muscle) => (
                      <SelectItem key={muscle.value} value={muscle.value}>
                        {muscle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.primaryMuscle && (
              <FieldError
                errors={[{ message: errors.primaryMuscle.message }]}
              />
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="otherMuscles">Outros Músculos</FieldLabel>
          <FieldContent>
            <Controller
              name="otherMuscles"
              control={control}
              render={({ field }) => {
                const selectedOptions =
                  field.value
                    ?.map((v) => MOCK_MUSCLES.find((m) => m.value === v))
                    .filter((opt): opt is Option => opt !== undefined) || [];

                return (
                  <MultipleSelector
                    value={selectedOptions}
                    onChange={(options) => {
                      field.onChange(options.map((opt) => opt.value));
                    }}
                    options={MOCK_MUSCLES}
                    placeholder="Selecione outros músculos"
                    emptyIndicator={
                      <p className="text-center text-sm text-muted-foreground">
                        Nenhum músculo encontrado.
                      </p>
                    }
                  />
                );
              }}
            />
            {errors.otherMuscles && (
              <FieldError
                errors={[{ message: errors.otherMuscles.message }]}
              />
            )}
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
                  value={field.value ?? null}
                  onChange={(file) => {
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

