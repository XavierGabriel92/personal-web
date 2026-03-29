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
import { sessionQueryKey } from "@/hooks/auth";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/routes/__root";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signInFormSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

type SignInFormType = z.infer<typeof signInFormSchema>;

export default function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const form = useForm<SignInFormType>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSignIn = async (data: SignInFormType) => {
		setIsLoading(true);
		try {
			await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
				},
				{
					onSuccess: async () => {
						toast.success("Login realizado com sucesso");
						await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
						router.navigate({ to: "/" });
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
						onSubmit={form.handleSubmit(handleSignIn)}
						className="flex flex-col gap-8"
					>
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
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center justify-between">
										<FormLabel>Senha</FormLabel>
										<Button type="button" variant="link" className="h-auto p-0" asChild>
											<Link to="/request-reset-password">
												<TypographySpanXSmall>
													Esqueceu sua senha?
												</TypographySpanXSmall>
											</Link>
										</Button>
									</div>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												{...field}
												className="pr-10"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Entrando..." : "Login"}
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
