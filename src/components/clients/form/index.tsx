import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { useForm } from "react-hook-form";
import { z } from "zod";

const clientFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  phone: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialValues?: ClientFormData;
}
export default function ClientForm({ onSubmit, initialValues }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialValues,
  });


  return (
    <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">
            Nome <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              id="name"
              type="text"
              placeholder="Nome do aluno"
              aria-invalid={errors.name ? "true" : "false"}
              {...register("name")}
            />
            {errors.name && (
              <FieldError errors={[{ message: errors.name.message }]} />
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">
            Email <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="Email do aluno"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email")}
            />
            {errors.email && (
              <FieldError errors={[{ message: errors.email.message }]} />
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Telefone</FieldLabel>
          <FieldContent>
            <Input
              id="phone"
              type="tel"
              placeholder="Telefone do aluno"
              aria-invalid={errors.phone ? "true" : "false"}
              {...register("phone")}
            />
            {errors.phone && (
              <FieldError errors={[{ message: errors.phone.message }]} />
            )}
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  );
}


export function CreateClientButton(props: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  return <Button type="submit" form="client-form" {...props} />
}