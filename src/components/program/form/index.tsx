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
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export const programFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  duration: z.number().min(0).max(50),
});

export type ProgramFormData = z.infer<typeof programFormSchema>;

interface ProgramFormProps {
  onSubmit: (data: ProgramFormData) => void;
  initialValues?: ProgramFormData;
}

export default function ProgramForm({
  onSubmit,
  initialValues,
}: ProgramFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programFormSchema),
    defaultValues: initialValues ?? {
      name: "",
      duration: 0,
      description: "",
    },
  });

  return (
    <form id="program-form" onSubmit={handleSubmit(onSubmit)}>
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

