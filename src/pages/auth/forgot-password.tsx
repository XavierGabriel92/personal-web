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
import { TypographySpanXSmall } from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
	email: z.string().email("Email inválido"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { email: "" },
	});

	const onSubmit = async (data: FormValues) => {
		setIsLoading(true);
		try {
			await authClient.requestPasswordReset(
				{
					email: data.email,
					redirectTo: `${window.location.origin}/reset-password`,
				},
				{
					onSuccess: () => {
						toast.success(
							"Se o email existir em nossa base, você receberá instruções para redefinir a senha.",
						);
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
				},
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-svh flex-col">
			<header className="flex items-center gap-1 border-b px-2">
				<img src="/homug_gorilla_logo.svg" alt="homug" className="h-16 w-16" />
				<span className="font-semibold text-xl">Homug</span>
			</header>
			<main className="mt-14 flex flex-1 justify-center p-6 md:p-10">
				<div className="w-full max-w-sm">
					<Card className="border-0 shadow-none">
						<CardHeader className="text-center">
							<CardTitle className="text-2xl">Esqueci minha senha</CardTitle>
							<CardDescription>
								Digite seu email e enviaremos um link para definir uma nova
								senha.
							</CardDescription>
						</CardHeader>
						<CardContent className="mt-8">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="flex flex-col gap-8"
								>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input type="email" autoComplete="email" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit" className="w-full" disabled={isLoading}>
										{isLoading ? "Enviando..." : "Resetar minha senha"}
									</Button>
									<TypographySpanXSmall className="text-center text-muted-foreground">
										<Button
											type="button"
											variant="link"
											className="h-auto p-0"
											asChild
										>
											<Link to="/sign-in">
												<TypographySpanXSmall>
													Voltar para entrar
												</TypographySpanXSmall>
											</Link>
										</Button>
									</TypographySpanXSmall>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			</main>
			<footer className="flex items-center justify-center gap-4 border-t px-6 py-4 text-xs text-muted-foreground">
				<div>
					© {new Date().getFullYear()} homug. Todos os direitos reservados.
				</div>
			</footer>
		</div>
	);
}
