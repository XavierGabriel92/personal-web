import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useHookFormMask } from 'use-mask-input';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { HelpCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Custom refinement for Brazilian phone validation
const brazilianPhoneSchema = z
  .string()
  .min(1, "Telefone é obrigatório")
  .refine(
    (phone) => {
      try {
        const phoneNumber = parsePhoneNumberWithError(phone, "BR");
        return phoneNumber.isValid();
      } catch {
        return false;
      }
    },
    {
      message: "Telefone deve ser um número brasileiro válido",
    }
  );

const clientFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: brazilianPhoneSchema,
  goals: z.string().optional(),
  active: z.boolean().optional(),
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
    control,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { active: true, ...initialValues },
  });

  const registerWithMask = useHookFormMask(register);


  return (
    <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label htmlFor="client-active">
                  {field.value ? "Ativo" : "Inativo"}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Somente clientes ativos recebem comunicações via WhatsApp
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                id="client-active"
                checked={field.value ?? true}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />

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
          <FieldLabel htmlFor="phone">
            Telefone <span className="text-destructive">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              id="phone"
              type="tel"
              placeholder="(99)99999-9999"
              aria-invalid={errors.phone ? "true" : "false"}
              {...registerWithMask("phone", ['(99)99999-9999', '(99)9999-9999'], {
                required: true
              })}
            />
            {errors.phone && (
              <FieldError errors={[{ message: errors.phone.message }]} />
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="goals">Objetivos</FieldLabel>
          <FieldContent>
            <Input
              id="goals"
              type="text"
              placeholder="Objetivos do aluno"
              aria-invalid={errors.goals ? "true" : "false"}
              {...register("goals")}
            />
            {errors.goals && (
              <FieldError errors={[{ message: errors.goals.message }]} />
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