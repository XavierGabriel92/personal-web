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
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const workoutFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export type WorkoutFormData = z.infer<typeof workoutFormSchema>;

interface WorkoutFormProps {
  onSubmit: (data: WorkoutFormData) => void;
  initialValues?: WorkoutFormData;
}

export default function WorkoutForm({
  onSubmit,
  initialValues,
}: WorkoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: initialValues ?? {
      name: "",
      description: "",
    },
  });

  return (
    <form id="workout-form" onSubmit={handleSubmit(onSubmit)}>
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

