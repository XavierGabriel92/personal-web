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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { sessionQueryKey } from "@/hooks/auth";
import { authClient, useSession } from "@/lib/auth-client";
import { queryClient } from "@/routes/__root";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useHookFormMask } from "use-mask-input";
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
		name: z.string().trim().min(1, "Nome é obrigatório"),
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
	const [googleLinking, setGoogleLinking] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: "", phone: "", password: "", confirm: "" },
	});

	const registerWithMask = useHookFormMask(form.register);

	const googleUser = data?.user?.email?.endsWith("@gmail.com");


	const linkGoogle = async () => {
		setGoogleLinking(true);
		try {
			await authClient.linkSocial(
				{
					provider: "google",
					callbackURL: `${window.location.origin}/client/home`,
				},
				{
					onError: (ctx) => {
						toast.error(
							ctx.error.message ?? "Não foi possível vincular o Google.",
						);
					},
				},
			);
		} finally {
			setGoogleLinking(false);
		}
	};

	const onSubmit = async (values: FormValues) => {
		setSubmitting(true);
		try {
			await authClient.$fetch("/client/set-initial-password", {
				method: "POST",
				throw: true,
				body: {
					name: values.name.trim(),
					phone: values.phone,
					newPassword: values.password,
				},
			});

			await queryClient.refetchQueries({ queryKey: sessionQueryKey });
			toast.success("Perfil completo! Bem-vindo ao Homug.");
			await navigate({ to: "/client/home", replace: true });
		} catch {
			toast.error("Não foi possível completar o perfil. Tente novamente.");
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
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{googleUser && <Button
							type="button"
							variant="outline"
							className="w-full"
							disabled={googleLinking || submitting}
							onClick={() => void linkGoogle()}
						>
							{googleLinking ? "Redirecionando..." : "Vincular conta Google"}
						</Button>}
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="flex flex-col gap-4 border-t pt-4"
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome</FormLabel>
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
