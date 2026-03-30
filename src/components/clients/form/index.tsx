import { Button, type buttonVariants } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { useHookFormMask } from "use-mask-input";

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
		},
	);

const editClientFormSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	phone: brazilianPhoneSchema,
	goals: z.string().optional(),
	active: z.boolean().optional(),
});

const createClientFormSchema = editClientFormSchema
	.omit({ active: true })
	.extend({
		email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
	});

export type CreateClientFormData = z.infer<typeof createClientFormSchema>;
export type EditClientFormData = z.infer<typeof editClientFormSchema>;

type ClientFormProps<M extends "create" | "edit"> = {
	mode: M;
	onSubmit: M extends "create"
		? (data: CreateClientFormData) => void
		: (data: EditClientFormData) => void;
} & (M extends "edit"
	? { initialValues?: Partial<EditClientFormData>; accountEmail?: string | null }
	: { initialValues?: never; accountEmail?: undefined });

export default function ClientForm<M extends "create" | "edit">({
	mode,
	onSubmit,
	...rest
}: ClientFormProps<M>) {
	const initialValues =
		mode === "edit"
			? (rest as { initialValues?: Partial<EditClientFormData>; accountEmail?: string | null }).initialValues
			: undefined;
	const accountEmail =
		mode === "edit"
			? (rest as { initialValues?: Partial<EditClientFormData>; accountEmail?: string | null }).accountEmail
			: undefined;
	const schema = mode === "create" ? createClientFormSchema : editClientFormSchema;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<CreateClientFormData | EditClientFormData>({
		resolver: zodResolver(schema),
		defaultValues:
			mode === "create"
				? { name: "", phone: "", email: "", goals: "" }
				: { active: true, ...initialValues },
	});

	const registerWithMask = useHookFormMask(register);

	return (
		<form
			id="client-form"
			onSubmit={handleSubmit((data) => {
				if (mode === "create") {
					(onSubmit as (d: CreateClientFormData) => void)(data as CreateClientFormData);
				} else {
					(onSubmit as (d: EditClientFormData) => void)(data as EditClientFormData);
				}
			})}
		>
			<FieldGroup>
				{mode === "edit" && (
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
												Clientes inativos ficam ocultos nos filtros de ativos e podem ter menos funcionalidades até você reativar.
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
				)}

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

				{mode === "edit" && (
					<Field>
						<FieldLabel htmlFor="client-account-email">Email da conta</FieldLabel>
						<FieldContent>
							<Input
								id="client-account-email"
								type="email"
								readOnly
								tabIndex={-1}
								autoComplete="off"
								value={accountEmail?.trim() ? accountEmail : ""}
								placeholder="Não cadastrado — aluno sem conta no app"
								className="bg-muted"
							/>
						</FieldContent>
					</Field>
				)}

				{mode === "create" && (
					<Field>
						<FieldLabel htmlFor="email">
							Email <span className="text-destructive">*</span>
						</FieldLabel>
						<FieldContent>
							<Input
								id="email"
								type="email"
								autoComplete="email"
								placeholder="aluno@email.com"
								aria-invalid={(errors as { email?: { message?: string } }).email ? "true" : "false"}
								{...register("email")}
							/>
							{(errors as { email?: { message?: string } }).email && (
								<FieldError
									errors={[
										{
											message: (errors as { email?: { message?: string } }).email?.message,
										},
									]}
								/>
							)}
						</FieldContent>
					</Field>
				)}

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
							{...registerWithMask("phone", ["(99)99999-9999", "(99)9999-9999"], {
								required: true,
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

export function CreateClientButton(
	props: React.ComponentProps<"button"> &
		VariantProps<typeof buttonVariants> & {
			asChild?: boolean;
		},
) {
	return <Button type="submit" form="client-form" {...props} />;
}
