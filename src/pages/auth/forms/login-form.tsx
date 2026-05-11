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
import { Separator } from "@/components/ui/separator";
import { TypographySpanXSmall } from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(1, "Senha é obrigatória"),
});

type FormValues = z.infer<typeof schema>;

const appCallbackUrl = () => `${window.location.origin}/client`;

export default function LoginForm() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (data: FormValues) => {
		setIsLoading(true);
		try {
			await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
					callbackURL: appCallbackUrl(),
				},
				{
					onSuccess: async () => {
						toast.success("Login realizado.");
						await navigate({ to: "/client" });
					},
					onError: (ctx) => {
						toast.error(ctx.error.message ?? "Não foi possível entrar.");
					},
				},
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogle = async () => {
		setGoogleLoading(true);
		try {
			await authClient.signIn.social(
				{
					provider: "google",
					callbackURL: appCallbackUrl(),
				},
				{
					onError: (ctx) => {
						toast.error(ctx.error.message ?? "Não foi possível entrar com Google.");
					},
				},
			);
		} finally {
			setGoogleLoading(false);
		}
	};

	return (
		<Card className="border-0 shadow-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Bem vindo de volta</CardTitle>
				<CardDescription>Faça login para continuar</CardDescription>
			</CardHeader>
			<CardContent className="mt-8 flex flex-col gap-4">
				<Button
					type="button"
					variant="outline"
					className="w-full"
					disabled={googleLoading || isLoading}
					onClick={() => void handleGoogle()}
				>
					{googleLoading ? "Redirecionando..." : "Continuar com Google"}
				</Button>
				<div className="flex items-center gap-4">
					<Separator className="flex-1" />
					<TypographySpanXSmall className="text-muted-foreground shrink-0">
						ou email
					</TypographySpanXSmall>
					<Separator className="flex-1" />
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
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
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Senha</FormLabel>
									<FormControl>
										<Input
											type="password"
											autoComplete="current-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={isLoading || googleLoading}>
							{isLoading ? "Entrando..." : "Entrar"}
						</Button>
					</form>
				</Form>
				<TypographySpanXSmall className="text-center text-muted-foreground">
					<Button type="button" variant="link" className="h-auto p-0" asChild>
						<Link to="/forgot-password">
							<TypographySpanXSmall>Esqueci minha senha</TypographySpanXSmall>
						</Link>
					</Button>
				</TypographySpanXSmall>
				<TypographySpanXSmall className="text-center text-muted-foreground">
					Não tem uma conta?{" "}
					<Button type="button" variant="link" className="h-auto p-0" asChild>
						<Link to="/sign-up">
							<TypographySpanXSmall>Registrar</TypographySpanXSmall>
						</Link>
					</Button>
				</TypographySpanXSmall>
			</CardContent>
		</Card>
	);
}
