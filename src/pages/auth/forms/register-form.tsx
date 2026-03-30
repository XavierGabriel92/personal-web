import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useRouter } from "@tanstack/react-router";
import { parsePhoneNumberWithError } from "libphonenumber-js";

import { Input } from "@/components/ui/input";
import { TypographySpanXSmall } from "@/components/ui/typography";
import { sessionQueryKey } from "@/hooks/auth";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/routes/__root";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
		{ message: "Telefone deve ser um número brasileiro válido" },
	);

const trainerMagicFields = z.object({
	name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
	email: z.string().email("Email inválido"),
	phone: brazilianPhoneSchema.optional().or(z.literal("")),
});

type TrainerMagicFormType = z.infer<typeof trainerMagicFields>;

export default function RegisterForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const trainerForm = useForm<TrainerMagicFormType>({
		resolver: zodResolver(trainerMagicFields),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
	});

	const postTrainerIntent = async (data: TrainerMagicFormType) => {
		const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
		const accessCode = import.meta.env.VITE_SIGNUP_CODE ?? "";
		const res = await fetch(`${baseURL}/api/trainer/magic-signup/intent`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				accessCode,
				name: data.name,
				email: data.email,
				...(data.phone ? { phone: data.phone } : {}),
			}),
		});
		const json = (await res.json()) as { ok?: boolean; error?: string };
		if (!res.ok) {
			throw new Error(json.error || "Não foi possível iniciar o cadastro.");
		}
	};

	const handleTrainerMagicSignUp = async (data: TrainerMagicFormType) => {
		setIsLoading(true);
		try {
			await postTrainerIntent(data);
			await authClient.signIn.magicLink(
				{
					email: data.email,
					name: data.name,
					callbackURL: `${window.location.origin}/`,
					newUserCallbackURL: `${window.location.origin}/`,
				},
				{
					onSuccess: () => {
						toast.success(
							"Enviamos um link para o seu email. Abra a mensagem para criar a conta e entrar.",
						);
						void queryClient.invalidateQueries({ queryKey: sessionQueryKey });
						router.navigate({ to: "/sign-in" });
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
				},
			);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Erro ao registrar.";
			toast.error(msg);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="border-0 shadow-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Abra sua conta</CardTitle>
				<CardDescription>
					Você recebe um link por email para confirmar e entrar. Use o mesmo
					email neste passo e ao abrir o link.
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-8">
				<Form {...trainerForm}>
					<form
						onSubmit={trainerForm.handleSubmit(handleTrainerMagicSignUp)}
						className="flex flex-col gap-8"
					>
						<div className="flex flex-col gap-4">
							<FormField
								control={trainerForm.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={trainerForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={trainerForm.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Telefone (opcional)</FormLabel>
										<FormControl>
											<Input
												type="tel"
												placeholder="(99)99999-9999"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Enviando..." : "Enviar link de cadastro"}
						</Button>
						<TypographySpanXSmall className="text-center text-muted-foreground">
							Já tem uma conta?{" "}
							<Button type="button" variant="link" className="h-auto p-0" asChild>
								<Link to="/sign-in">
									<TypographySpanXSmall>Login</TypographySpanXSmall>
								</Link>
							</Button>
						</TypographySpanXSmall>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
