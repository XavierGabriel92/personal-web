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
import { useRouter } from "@tanstack/react-router";
import { parsePhoneNumberWithError } from "libphonenumber-js";

import { Input } from "@/components/ui/input";
import { sessionQueryKey } from "@/hooks/auth";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/routes/__root";
import { Route } from "@/routes/_auth/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
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
		{ message: "Telefone deve ser um número brasileiro válido" }
	);

const signUpFormSchema = z
	.object({
		name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
		email: z.string().email("Email inválido"),
		phone: brazilianPhoneSchema.optional().or(z.literal("")),
		password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z
			.string()
			.min(8, "Senha deve ter pelo menos 8 caracteres"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type SignUpFormType = z.infer<typeof signUpFormSchema>;

export default function RegisterForm() {
	const params = Route.useSearch() as {
		organizationId?: string;
		email?: string;
	};

	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const form = useForm<SignUpFormType>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			name: "",
			email: params.email || "",
			phone: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleSignUp = async (data: SignUpFormType) => {
		setIsLoading(true);
		try {
			await authClient.signUp.email(
				{
					email: data.email,
					password: data.password,
					name: data.name,
					type: params.organizationId ? "member" : "trainer",
					...(data.phone ? { phone: data.phone } : {}),
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
		} catch (_) {
			toast.error("Erro ao fazer login com Google");
		}
	};

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">
					{params.organizationId
						? "Finalize o cadastro para acessar seus treinos"
						: "Abra sua conta"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSignUp)}
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
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Registrar com Google
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
									{!params.organizationId && (
										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Telefone</FormLabel>
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
									)}
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Senha</FormLabel>
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
									<FormField
										control={form.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirmar Senha</FormLabel>
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
									{isLoading ? "Registrando..." : "Registrar"}
								</Button>
							</div>
							<div className="text-center text-sm">
								Já tem uma conta?
								<Button type="button" variant="link" asChild>
									<Link
										to="/sign-in"
										search={{ organizationId: params.organizationId }}
									>
										Login
									</Link>
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
