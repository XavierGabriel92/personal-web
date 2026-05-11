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
import { TypographySpanXSmall } from "@/components/ui/typography";
import { sessionQueryKey } from "@/hooks/auth";
import { authClient, useSession } from "@/lib/auth-client";
import { clientRegistrationCompleteQueryKey } from "@/lib/client-registration-complete";
import { queryClient } from "@/routes/__root";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { Suspense, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useHookFormMask } from "use-mask-input";
import { z } from "zod";

const brazilianPhoneSchema = z
	.string()
	.optional()
	.or(z.literal(""))
	.refine(
		(phone) => {
			if (!phone || phone.trim().length === 0) return true;
			try {
				const phoneNumber = parsePhoneNumberWithError(phone, "BR");
				return phoneNumber.isValid();
			} catch {
				return false;
			}
		},
		{ message: "Telefone deve ser um número brasileiro válido" },
	);

const passwordField = z.string().max(128).optional().or(z.literal(""));

const buildSchema = (googleUser: boolean) =>
	z
		.object({
			name: z.string().trim().min(1, "Nome é obrigatório"),
			phone: brazilianPhoneSchema,
			password: passwordField,
			confirm: passwordField,
		})
		.superRefine((data, ctx) => {
			const password = data.password?.trim() ?? "";
			const confirm = data.confirm?.trim() ?? "";
			const wantsPassword = password.length > 0 || confirm.length > 0 || !googleUser;

			if (!wantsPassword) return;

			if (password.length < 8) {
				ctx.addIssue({
					code: "custom",
					message: "Mínimo de 8 caracteres",
					path: ["password"],
				});
			}

			if (confirm.length < 8) {
				ctx.addIssue({
					code: "custom",
					message: "Mínimo de 8 caracteres",
					path: ["confirm"],
				});
			}

			if (password !== confirm) {
				ctx.addIssue({
					code: "custom",
					message: "As senhas não conferem",
					path: ["confirm"],
				});
			}
		});

type InviteLookup =
	| {
			ok: true;
			email: string;
			trainerName: string;
	  }
	| {
			ok: false;
			message: string;
	  };

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

const inviteQueryKey = (token: string) => ["client-invite", token];

async function fetchInvite(token: string): Promise<InviteLookup> {
	const apiUrl = import.meta.env.VITE_API_URL as string;
	try {
		const res = await fetch(
			`${apiUrl}/auth/api/client/invite/${encodeURIComponent(token)}`,
			{
				method: "GET",
				credentials: "include",
			},
		);

		const json = (await res.json()) as
			| {
					email?: string;
					trainerName?: string;
					message?: string;
			  }
			| undefined;

		if (!res.ok || !json?.email || !json?.trainerName) {
			return {
				ok: false,
				message: json?.message ?? "Convite inválido ou expirado.",
			};
		}

		return {
			ok: true,
			email: json.email,
			trainerName: json.trainerName,
		};
	} catch {
		return {
			ok: false,
			message: "Não foi possível carregar o convite. Tente novamente.",
		};
	}
}

function getErrorMessage(error: unknown, fallback: string) {
	if (error instanceof Error && error.message.trim().length > 0) {
		return error.message;
	}
	return fallback;
}

async function markClientRegistrationComplete() {
	queryClient.setQueryData(clientRegistrationCompleteQueryKey, true);
	await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
}

function MissingTokenState() {
	return (
		<div className="flex min-h-svh flex-col">
			<header className="flex items-center gap-1 border-b px-2">
				<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
				<span className="font-semibold text-xl">Homug</span>
			</header>
			<main className="flex flex-1 items-center justify-center px-6 py-8 md:px-10">
				<Card className="w-full max-w-md shrink-0">
					<CardHeader>
						<CardTitle>Convite inválido</CardTitle>
						<CardDescription>Abra novamente o link enviado pelo seu personal.</CardDescription>
					</CardHeader>
				</Card>
			</main>
		</div>
	);
}

function ClientSetPasswordContent({ token }: { token: string }) {
	const navigate = useNavigate();
	const { data: sessionData } = useSession();
	const inviteQuery = useSuspenseQuery({
		queryKey: inviteQueryKey(token),
		queryFn: () => fetchInvite(token),
	});
	const invite = inviteQuery.data.ok ? inviteQuery.data : null;
	const inviteErrorMessage = inviteQuery.data.ok
		? "Convite inválido ou expirado."
		: inviteQuery.data.message;
	const googleUser = invite?.email.endsWith("@gmail.com") ?? false;
	const schema = useMemo(() => buildSchema(googleUser), [googleUser]);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: "", phone: "", password: "", confirm: "" },
	});

	const registerWithMask = useHookFormMask(form.register);

	if (!invite) {
		return (
			<div className="flex min-h-svh flex-col">
				<header className="flex items-center gap-1 border-b px-2">
					<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
					<span className="font-semibold text-xl">Homug</span>
				</header>
				<main className="flex flex-1 items-center justify-center px-6 py-8 md:px-10">
					<Card className="w-full max-w-md shrink-0">
						<CardHeader>
							<CardTitle>Convite indisponível</CardTitle>
							<CardDescription>{inviteErrorMessage}</CardDescription>
						</CardHeader>
					</Card>
				</main>
			</div>
		);
	}

	const acceptInviteMutation = useMutation({
		mutationFn: async (values: FormValues) => {
			return authClient.$fetch("/client/accept-invite", {
				method: "POST",
				throw: true,
				body: {
					token,
					name: values.name.trim(),
					...(values.phone?.trim() ? { phone: values.phone.trim() } : {}),
					...(values.password?.trim()
						? { password: values.password.trim() }
						: {}),
				},
			});
		},
		onSuccess: async () => {
			await markClientRegistrationComplete();
			toast.success("Perfil completo! Bem-vindo ao Homug.");
			await navigate({ to: "/client/home", replace: true });
		},
		onError: (error) => {
			toast.error(
				getErrorMessage(error, "Não foi possível completar o perfil. Tente novamente."),
			);
		},
	});

	const googleMutation = useMutation({
		mutationFn: async (values: FormValues) => {
			const hasSession = Boolean(sessionData?.session);
			if (!hasSession) {
				await authClient.$fetch("/client/accept-invite", {
					method: "POST",
					throw: true,
					body: {
						token,
						name: values.name.trim(),
						...(values.phone?.trim() ? { phone: values.phone.trim() } : {}),
					},
				});
			}

			await markClientRegistrationComplete();

			await authClient.linkSocial(
				{
					provider: "google",
					callbackURL: `${window.location.origin}/client/home`,
				},
				{
					onError: (ctx) => {
						throw new Error(
							ctx.error.message ?? "Não foi possível vincular o Google.",
						);
					},
				},
			);
		},
		onSuccess: () => {},
		onError: (error) => {
			toast.error(getErrorMessage(error, "Não foi possível continuar com Google."));
		},
	});

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
							{invite.trainerName} convidou você para acessar seus treinos no Homug.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{googleUser ? (
							<Button
								type="button"
								variant="outline"
								className="w-full"
								disabled={googleMutation.isPending || acceptInviteMutation.isPending}
								onClick={async () => {
									const valid = await form.trigger(["name", "phone"]);
									if (!valid) return;
									await googleMutation.mutateAsync(form.getValues());
								}}
							>
								{googleMutation.isPending
									? "Redirecionando..."
									: "Continuar com Google"}
							</Button>
						) : null}
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit((values) =>
									acceptInviteMutation.mutate(values),
								)}
								className="flex flex-col gap-4 border-t pt-4"
							>
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input value={invite.email} disabled readOnly />
									</FormControl>
								</FormItem>
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
											<FormLabel>Telefone (opcional)</FormLabel>
											<FormControl>
												<Input
													type="tel"
													placeholder="(99)99999-9999"
													{...registerWithMask(
														"phone",
														["(99)99999-9999", "(99)9999-9999"],
														{ required: false },
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
											<FormLabel>
												{googleUser ? "Senha (opcional)" : "Senha"}
											</FormLabel>
											<FormControl>
												<Input type="password" autoComplete="new-password" {...field} />
											</FormControl>
											{googleUser ? (
												<TypographySpanXSmall className="text-muted-foreground">
													Se preferir, você pode continuar apenas com Google.
												</TypographySpanXSmall>
											) : null}
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
								<Button
									type="submit"
									disabled={acceptInviteMutation.isPending || googleMutation.isPending}
									className="w-full"
								>
									{acceptInviteMutation.isPending ? (
										<span className="flex items-center justify-center gap-2">
											<Spinner className="size-4" />
											<span>Salvando...</span>
										</span>
									) : (
										googleUser ? "Continuar com senha" : "Completar perfil"
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

export default function ClientSetPasswordPage() {
	const token = useMemo(
		() => new URLSearchParams(window.location.search).get("token")?.trim() ?? "",
		[],
	);

	if (!token) {
		return <MissingTokenState />;
	}

	return (
		<Suspense
			fallback={
				<div className="flex min-h-svh items-center justify-center">
					<Spinner className="size-8" />
				</div>
			}
		>
			<ClientSetPasswordContent token={token} />
		</Suspense>
	);
}
