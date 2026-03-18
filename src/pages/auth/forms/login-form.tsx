import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

	const handleSignInWithGoogle = async () => {
		try {
			await authClient.signIn.social(
				{
					provider: "google",
					callbackURL: `${import.meta.env.VITE_APP_URL as string}/trainer/home`,
				},
				{
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
				},
			);
		} catch (e) {
			toast.error("Erro ao fazer login com Google");
		}
	};

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Bem vindo de volta</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSignIn)}
						className="space-y-4"
					>
						<div className="grid gap-6">
							<div className="flex flex-col gap-4">
								<Button
									variant="outline"
									type="button"
									className="w-full"
									onClick={handleSignInWithGoogle}
								>
									{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										aria-label="Google logo"
									>
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Entrar com Google
								</Button>
							</div>
							<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
								<span className="bg-card text-muted-foreground relative z-10 px-2">
									Ou continue com
								</span>
							</div>
							<div className="grid gap-6">
								<div className="grid gap-3">
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
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<div className="flex items-center justify-between">
													<FormLabel>Senha</FormLabel>
													<Button type="button" variant="link">
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
								</div>
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Entrando..." : "Login"}
								</Button>
							</div>
							<TypographySpanXSmall className="text-end">
								Não tem uma conta?
								<Button type="button" variant="link" asChild>
									<Link to="/sign-up">
										<TypographySpanXSmall>Registrar</TypographySpanXSmall>
									</Link>
								</Button>
							</TypographySpanXSmall>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
