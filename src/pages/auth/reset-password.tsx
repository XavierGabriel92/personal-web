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
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
	.object({
		password: z.string().min(8, "Mínimo de 8 caracteres").max(128),
		confirm: z.string().min(8, "Mínimo de 8 caracteres"),
	})
	.refine((d) => d.password === d.confirm, {
		message: "As senhas não conferem",
		path: ["confirm"],
	});

type FormValues = z.infer<typeof schema>;

type ResetPasswordPageProps = {
	token?: string;
	error?: string;
};

function invalidTokenMessage(error: string | undefined): string | null {
	if (!error) return null;
	if (error === "INVALID_TOKEN") {
		return "Este link expirou ou não é válido. Solicite um novo email de redefinição pelo app.";
	}
	return "Não foi possível validar o link. Solicite um novo email de redefinição pelo app.";
}

export default function ResetPasswordPage({
	token,
	error,
}: ResetPasswordPageProps) {
	const navigate = useNavigate();
	const [submitting, setSubmitting] = useState(false);
	const invalidMessage = invalidTokenMessage(error);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { password: "", confirm: "" },
	});

	const onSubmit = async (values: FormValues) => {
		if (!token) {
			toast.error("Link inválido. Abra o endereço enviado por email.");
			return;
		}
		setSubmitting(true);
		try {
			const { error: resetError } = await authClient.resetPassword({
				newPassword: values.password,
				token,
			});
			if (resetError) {
				toast.error(
					resetError.message ?? "Não foi possível salvar a nova senha.",
				);
				return;
			}
			toast.success(
				"Senha atualizada. Você já pode entrar no app com a nova senha.",
			);
			await navigate({ to: "/", replace: true });
		} finally {
			setSubmitting(false);
		}
	};

	const showForm = Boolean(token) && !invalidMessage;

	return (
		<div className="flex min-h-svh flex-col">
			<header className="flex items-center gap-1 border-b px-2">
				<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
				<span className="font-semibold text-xl">Homug</span>
			</header>
			<main className="mt-14 flex flex-1 justify-center p-6 md:p-10">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						{invalidMessage || !token ? (
							<>
								<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
									<AlertCircle className="h-6 w-6" aria-hidden />
								</div>
								<CardTitle>Não foi possível redefinir</CardTitle>
								<CardDescription>
									{invalidMessage ??
										"Abra o link completo enviado por email ou solicite uma nova redefinição pelo app."}
								</CardDescription>
							</>
						) : (
							<>
								<CardTitle>Nova senha</CardTitle>
								<CardDescription>
									Defina uma nova senha para sua conta. Depois, entre no app
									Homug com email e senha.
								</CardDescription>
							</>
						)}
					</CardHeader>
					<CardContent>
						{showForm ? (
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="flex flex-col gap-4"
								>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nova senha</FormLabel>
												<FormControl>
													<Input
														type="password"
														autoComplete="new-password"
														{...field}
													/>
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
													<Input
														type="password"
														autoComplete="new-password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="submit"
										className="w-full"
										disabled={submitting}
									>
										{submitting ? "Salvando..." : "Salvar nova senha"}
									</Button>
								</form>
							</Form>
						) : (
							<Button asChild className="w-full">
								<Link to="/sign-in">Ir para entrar</Link>
							</Button>
						)}
					</CardContent>
				</Card>
			</main>
			<footer className="flex items-center justify-center gap-4 border-t px-6 py-4 text-xs text-muted-foreground">
				<div>
					© {new Date().getFullYear()} homug. Todos os direitos reservados.
				</div>
			</footer>
		</div>
	);
}
