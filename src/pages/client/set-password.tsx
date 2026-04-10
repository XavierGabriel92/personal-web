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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { sessionQueryKey } from "@/hooks/auth";
import { queryClient } from "@/routes/__root";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
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

const schema = z
	.object({
		name: z.string().min(1, "Nome é obrigatório"),
		phone: brazilianPhoneSchema,
		password: z.string().min(8, "Mínimo de 8 caracteres").max(128),
		confirm: z.string().min(8, "Mínimo de 8 caracteres"),
	})
	.refine((d) => d.password === d.confirm, {
		message: "As senhas não conferem",
		path: ["confirm"],
	});

type FormValues = z.infer<typeof schema>;

export default function ClientSetPasswordPage() {
	const navigate = useNavigate();
	const { data, isPending } = useSession();
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: "", phone: "", password: "", confirm: "" },
	});

	const registerWithMask = useHookFormMask(form.register);

	const user = data?.user as { type?: string } | undefined;

	const onSubmit = async (values: FormValues) => {
		setSubmitting(true);
		const apiUrl = import.meta.env.VITE_API_URL as string;
		try {
			const res = await fetch(`${apiUrl}/auth/api/client/set-initial-password`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: values.name.trim(),
					phone: values.phone,
					newPassword: values.password,
				}),
			});
			const json = (await res.json()) as { ok?: boolean; message?: string };
			if (!res.ok || !json.ok) {
				toast.error(json.message ?? "Não foi possível completar o perfil.");
				return;
			}
			await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
			toast.success("Perfil completo! Bem-vindo ao Homug.");
			await navigate({ to: "/client/welcome" });
		} catch {
			toast.error("Erro de rede. Tente novamente.");
		} finally {
			setSubmitting(false);
		}
	};

	if (isPending) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<Spinner className="size-8" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex min-h-svh flex-col">
				<header className="flex items-center gap-1 border-b px-2">
					<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
					<span className="font-semibold text-xl">Homug</span>
				</header>
				<main className="flex flex-1 items-center justify-center px-6 py-8 md:px-10">
					<Card className="w-full max-w-md shrink-0">
						<CardHeader>
							<CardTitle>Sessão necessária</CardTitle>
							<CardDescription>
								Abra o link do convite no email e confirme seu endereço. Depois
								você poderá completar seu perfil aqui.
							</CardDescription>
						</CardHeader>
					</Card>
				</main>
			</div>
		);
	}

	if (user.type !== "client") {
		return (
			<div className="flex min-h-svh flex-col">
				<header className="flex items-center gap-1 border-b px-2">
					<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
					<span className="font-semibold text-xl">Homug</span>
				</header>
				<main className="flex flex-1 items-center justify-center px-6 py-8 md:px-10">
					<Card className="w-full max-w-md shrink-0">
						<CardHeader>
							<CardTitle>Página para alunos</CardTitle>
							<CardDescription>
								Esta etapa é só para contas de aluno convidadas pelo personal.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild className="w-full">
								<Link to="/sign-in">Ir para entrar</Link>
							</Button>
						</CardContent>
					</Card>
				</main>
			</div>
		);
	}

	return (
		<div className="flex min-h-svh flex-col">
			<header className="flex items-center gap-1 border-b px-2">
				<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
				<span className="font-semibold text-xl">Homug</span>
			</header>
			<main className="flex flex-1 items-center justify-center px-6 py-8 md:px-10">
				<Card className="w-full max-w-md shrink-0">
					<CardHeader>
						<CardTitle>Complete seu perfil</CardTitle>
						<CardDescription>
							Preencha seus dados e escolha uma senha para entrar no app Homug.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="flex flex-col gap-4"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome completo</FormLabel>
											<FormControl>
												<Input
													type="text"
													autoComplete="name"
													placeholder="Seu nome"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={() => (
										<FormItem>
											<FormLabel>Telefone</FormLabel>
											<FormControl>
												<Input
													type="tel"
													placeholder="(99)99999-9999"
													{...registerWithMask(
														"phone",
														["(99)99999-9999", "(99)9999-9999"],
														{ required: true },
													)}
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
								<Button type="submit" disabled={submitting} className="w-full">
									{submitting ? (
										<span className="flex items-center justify-center gap-2">
											<Spinner className="size-4" />
											<span>Salvando...</span>
										</span>
									) : (
										"Completar perfil"
									)}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
