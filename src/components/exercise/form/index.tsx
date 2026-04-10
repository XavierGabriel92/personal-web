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
import VideoFileUploader from "@/components/ui/video-file-uploader";
import { useGetApiExercisesFilters } from "@/gen";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { Exercise } from "../schemas";

export const exerciseFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  equipment: z.string().optional(),
  primaryMuscle: z.string().optional(),
  secondaryMuscle: z.string().optional(),
  howTo: z.string().optional(),
  video: z.union([z.instanceof(File), z.string()]).optional(),
});

export type ExerciseFormData = z.infer<typeof exerciseFormSchema>;

export function exerciseToFormData(exercise: Exercise): ExerciseFormData {
  return {
    name: exercise.name,
    category: exercise.category,
    equipment: exercise.equipment ?? "",
    primaryMuscle: exercise.primaryMuscle ?? "",
    secondaryMuscle: exercise.secondaryMuscle ?? "",
    howTo: exercise.howTo ?? "",
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
      category: "",
      equipment: "",
      primaryMuscle: "",
      secondaryMuscle: "",
      howTo: "",
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

  const categories = filtersData?.categories ?? [];
  const equipmentList = filtersData?.equipment ?? [];

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
          <FieldLabel htmlFor="category">
            Categoria <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              id="category"
              type="text"
              list="exercise-category-suggestions"
              placeholder="Ex.: Peito, Costas"
              className="w-full"
              aria-invalid={errors.category ? "true" : "false"}
              {...register("category")}
            />
            <datalist id="exercise-category-suggestions">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.category && (
              <FieldError errors={[{ message: errors.category.message }]} />
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="equipment">Equipamento</FieldLabel>
          <FieldContent>
            <Input
              id="equipment"
              type="text"
              list="exercise-equipment-suggestions"
              placeholder="Ex.: Barra, Halteres"
              className="w-full"
              {...register("equipment")}
            />
            <datalist id="exercise-equipment-suggestions">
              {equipmentList.map((eq) => (
                <option key={eq} value={eq} />
              ))}
            </datalist>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="primaryMuscle">Músculo primário</FieldLabel>
          <FieldContent>
            <Input
              id="primaryMuscle"
              type="text"
              placeholder="Ex.: Peito"
              className="w-full"
              {...register("primaryMuscle")}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="secondaryMuscle">Músculo secundário</FieldLabel>
          <FieldContent>
            <Input
              id="secondaryMuscle"
              type="text"
              placeholder="Ex.: Tríceps (opcional)"
              className="w-full"
              {...register("secondaryMuscle")}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="howTo">Como fazer</FieldLabel>
          <FieldContent>
            <Textarea
              id="howTo"
              placeholder="Passo a passo ou dicas (texto livre)"
              className="min-h-24 w-full resize-y"
              aria-invalid={errors.howTo ? "true" : "false"}
              {...register("howTo")}
            />
            {errors.howTo && (
              <FieldError errors={[{ message: errors.howTo.message }]} />
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="video">Vídeo do exercício</FieldLabel>
          <FieldContent>
            <Controller
              name="video"
              control={control}
              render={({ field }) => (
                <VideoFileUploader
                  value={videoValue ?? null}
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
    },
) {
  return <Button type="submit" form="exercise-form" {...props} />;
}
