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

const magicLinkFormSchema = z.object({
	email: z.string().email("Email inválido"),
});

type MagicLinkFormType = z.infer<typeof magicLinkFormSchema>;

export default function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<MagicLinkFormType>({
		resolver: zodResolver(magicLinkFormSchema),
		defaultValues: { email: "" },
	});

	const handleMagicLink = async (data: MagicLinkFormType) => {
		setIsLoading(true);
		try {
			await authClient.signIn.magicLink(
				{
					email: data.email,
					callbackURL: `${window.location.origin}/`,
				},
				{
					onSuccess: () => {
						toast.success(
							"Enviamos um link para o seu email. Abra a mensagem para concluir o login.",
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
		<Card className="border-0 shadow-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Bem vindo de volta</CardTitle>
				<CardDescription>Faça login para continuar</CardDescription>
			</CardHeader>
			<CardContent className="mt-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleMagicLink)}
						className="flex flex-col gap-8"
					>
						<p className="text-sm text-muted-foreground">
							Use o email da sua conta. Enviaremos um link para entrar sem senha.
						</p>
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
							{isLoading ? "Enviando..." : "Entrar com email"}
						</Button>
						<TypographySpanXSmall className="text-center text-muted-foreground">
							Não tem uma conta?{" "}
							<Button type="button" variant="link" className="h-auto p-0" asChild>
								<Link to="/sign-up">
									<TypographySpanXSmall>Registrar</TypographySpanXSmall>
								</Link>
							</Button>
						</TypographySpanXSmall>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
