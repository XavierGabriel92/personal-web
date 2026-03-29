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
import { useRouter } from "@tanstack/react-router";
import { parsePhoneNumberWithError } from "libphonenumber-js";

import { Input } from "@/components/ui/input";
import { TypographySpanXSmall } from "@/components/ui/typography";
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
		{ message: "Telefone deve ser um número brasileiro válido" },
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
				// @ts-expect-error - phone is optional at runtime; better-auth's type is overly strict
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

	return (
		<Card className="border-0 shadow-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">
					{params.organizationId
						? "Finalize o cadastro para acessar seus treinos"
						: "Abra sua conta"}
				</CardTitle>
				<CardDescription>
					{params.organizationId
						? "Crie sua senha para continuar"
						: "Preencha seus dados para começar"}
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSignUp)}
						className="flex flex-col gap-8"
					>
						<div className="flex flex-col gap-4">
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
						<TypographySpanXSmall className="text-center text-muted-foreground">
							Já tem uma conta?{" "}
							<Button type="button" variant="link" className="h-auto p-0" asChild>
								<Link
									to="/sign-in"
									search={{ organizationId: params.organizationId }}
								>
									<TypographySpanXSmall>Login</TypographySpanXSmall>
								</Link>
							</Button>
						</TypographySpanXSmall>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
