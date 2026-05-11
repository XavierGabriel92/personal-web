import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
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
import { Separator } from "@/components/ui/separator";
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

const baseTrainerFields = z.object({
	name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
	email: z.string().email("Email inválido"),
	phone: brazilianPhoneSchema.optional().or(z.literal("")),
});

const registerSchema = baseTrainerFields
	.extend({
		password: z.string().min(8, "Mínimo de 8 caracteres").max(128),
		confirm: z.string().min(8, "Mínimo de 8 caracteres"),
	})
	.refine((d) => d.password === d.confirm, {
		message: "As senhas não conferem",
		path: ["confirm"],
	});

type RegisterFormType = z.infer<typeof registerSchema>;

export default function RegisterForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);
	const router = useRouter();

	const form = useForm<RegisterFormType>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			password: "",
			confirm: "",
		},
	});

	const postTrainerIntent = async (data: {
		name: string;
		email: string;
		phone?: string;
	}) => {
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
			throw new Error(
				typeof json.error === "string"
					? json.error
					: "Não foi possível iniciar o cadastro.",
			);
		}
	};

	const handleEmailSignUp = async (data: RegisterFormType) => {
		setIsLoading(true);
		try {
			await postTrainerIntent({
				name: data.name,
				email: data.email,
				...(data.phone ? { phone: data.phone } : {}),
			});
			await authClient.signUp.email(
				{
					email: data.email,
					password: data.password,
					name: data.name.trim(),
					type: "trainer",
					...(data.phone?.trim() ? { phone: data.phone.trim() } : {}),
				} as Parameters<typeof authClient.signUp.email>[0],
				{
					onSuccess: () => {
						toast.success(
							"Enviamos um email de confirmação. Abra o link para ativar sua conta, depois entre com email e senha.",
						);
						void queryClient.invalidateQueries({ queryKey: sessionQueryKey });
						void router.navigate({ to: "/sign-in" });
					},
					onError: (ctx) => {
						toast.error(ctx.error.message ?? "Não foi possível criar a conta.");
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

	const handleGoogleSignUp = async () => {
		const raw = form.getValues();
		const step = baseTrainerFields.safeParse({
			name: raw.name,
			email: raw.email,
			phone: raw.phone,
		});
		if (!step.success) {
			const first = step.error.flatten().fieldErrors;
			const msg =
				first.name?.[0] ??
				first.email?.[0] ??
				first.phone?.[0] ??
				"Preencha nome e email corretamente.";
			toast.error(msg);
			return;
		}
		setGoogleLoading(true);
		try {
			await postTrainerIntent({
				name: step.data.name,
				email: step.data.email,
				...(step.data.phone ? { phone: step.data.phone } : {}),
			});
			await authClient.signIn.social(
				{
					provider: "google",
					callbackURL: `${window.location.origin}/`,
				},
				{
					onError: (ctx) => {
						toast.error(
							ctx.error.message ?? "Não foi possível cadastrar com Google.",
						);
					},
				},
			);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Erro ao registrar.";
			toast.error(msg);
		} finally {
			setGoogleLoading(false);
		}
	};

	return (
		<Card className="border-0 shadow-none gap-0 p-0">
			<CardHeader className="text-center p-0">
				<CardTitle className="text-2xl">Abra sua conta</CardTitle>
			</CardHeader>
			<CardContent className="mt-8 flex flex-col gap-4">
				<Button
					type="button"
					variant="outline"
					className="w-full"
					disabled={googleLoading || isLoading}
					onClick={() => void handleGoogleSignUp()}
				>
					{googleLoading ? "Redirecionando..." : "Continuar com Google"}
				</Button>
				<div className="flex items-center gap-4">
					<Separator className="flex-1" />
					<TypographySpanXSmall className="text-muted-foreground shrink-0">
						ou senha
					</TypographySpanXSmall>
					<Separator className="flex-1" />
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleEmailSignUp)}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col gap-4">
							<FormField
								control={form.control}
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
								control={form.control}
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
								control={form.control}
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
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Senha</FormLabel>
										<FormControl>
											<Input type="password" autoComplete="new-password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirm"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirmar senha</FormLabel>
										<FormControl>
											<Input type="password" autoComplete="new-password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading || googleLoading}>
							{isLoading ? "Criando conta..." : "Criar conta com email"}
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
