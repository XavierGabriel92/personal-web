import { Button, type buttonVariants } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const programFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  active: z.boolean(),
  programExpiration: z.date().optional(),
});

export type ProgramFormData = z.infer<typeof programFormSchema>;

interface ProgramFormProps {
  onSubmit: (data: ProgramFormData) => void;
  initialValues?: Partial<ProgramFormData>;
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
    defaultValues: {
      active: true,
      ...initialValues,
    },
  });

  return (
    <form id="program-form" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex gap-4 items-start">
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

          <Field className="w-fit">
            <FieldLabel htmlFor="active">Ativo</FieldLabel>
            <FieldContent>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={errors.active ? "true" : "false"}
                  />
                )}
              />
              {errors.active && (
                <FieldError errors={[{ message: errors.active.message }]} />
              )}
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="programExpiration">Vencimento do programa</FieldLabel>
          <FieldContent>
            <Controller
              name="programExpiration"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="programExpiration"
                  date={field.value}
                  setDate={field.onChange}
                />
              )}
            />
            {errors.programExpiration && (
              <FieldError
                errors={[{ message: errors.programExpiration.message }]}
              />
            )}
          </FieldContent>
        </Field>

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

