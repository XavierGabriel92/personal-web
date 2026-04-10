import { Button, type buttonVariants } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VariantProps } from "class-variance-authority";
import { HelpCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const editClientFormSchema = z.object({
	goals: z.string().optional(),
	active: z.boolean().optional(),
});

const createClientFormSchema = z.object({
	email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
	goals: z.string().optional(),
});

export type CreateClientFormData = z.infer<typeof createClientFormSchema>;
export type EditClientFormData = z.infer<typeof editClientFormSchema>;

type ClientFormProps<M extends "create" | "edit"> = {
	mode: M;
	onSubmit: M extends "create"
		? (data: CreateClientFormData) => void
		: (data: EditClientFormData) => void;
} & (M extends "edit"
	? {
			initialValues?: Partial<EditClientFormData>;
			accountEmail?: string | null;
			clientName?: string;
			clientPhone?: string;
		}
	: { initialValues?: never; accountEmail?: undefined; clientName?: undefined; clientPhone?: undefined });

export default function ClientForm<M extends "create" | "edit">({
	mode,
	onSubmit,
	...rest
}: ClientFormProps<M>) {
	const editRest = rest as {
		initialValues?: Partial<EditClientFormData>;
		accountEmail?: string | null;
		clientName?: string;
		clientPhone?: string;
	};
	const initialValues = mode === "edit" ? editRest.initialValues : undefined;
	const accountEmail = mode === "edit" ? editRest.accountEmail : undefined;
	const clientName = mode === "edit" ? editRest.clientName : undefined;
	const clientPhone = mode === "edit" ? editRest.clientPhone : undefined;
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
				? { email: "", goals: "" }
				: { active: true, ...initialValues },
	});

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

				{mode === "edit" && (
					<>
						<Field>
							<FieldLabel htmlFor="client-name-display">Nome</FieldLabel>
							<FieldContent>
								<Input
									id="client-name-display"
									type="text"
									readOnly
									tabIndex={-1}
									value={clientName || ""}
									placeholder="Aguardando preenchimento pelo aluno"
									className="bg-muted"
								/>
							</FieldContent>
						</Field>

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

						<Field>
							<FieldLabel htmlFor="client-phone-display">Telefone</FieldLabel>
							<FieldContent>
								<Input
									id="client-phone-display"
									type="tel"
									readOnly
									tabIndex={-1}
									value={clientPhone || ""}
									placeholder="Aguardando preenchimento pelo aluno"
									className="bg-muted"
								/>
							</FieldContent>
						</Field>
					</>
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
