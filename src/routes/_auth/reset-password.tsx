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
import { createFileRoute } from "@tanstack/react-router";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_auth/reset-password")({
	component: ResetPasswordPage,
});

const forgotPasswordFormSchema = z
	.object({
		password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z
			.string()
			.min(8, "Senha deve ter pelo menos 8 caracteres"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type ForgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;

function ResetPasswordPage() {
	const { token } = Route.useSearch() as {
		token: string;
	};

	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<ForgotPasswordFormType>({
		resolver: zodResolver(forgotPasswordFormSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	if (!token) {
		navigate({ to: "/" });
	}

	const handleRequestPasswordReset = async (data: ForgotPasswordFormType) => {
		setIsLoading(true);
		try {
			await authClient.resetPassword(
				{
					newPassword: data.password,
					token,
				},
				{
					onSuccess: () => {
						toast.success("Senha resetada com sucesso");
						navigate({ to: "/sign-in" });
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
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">Resetar senha</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(handleRequestPasswordReset)}
								className="space-y-4"
							>
								<div className="grid gap-6">
									<div className="grid gap-6">
										<div className="grid gap-3">
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
										</div>

										<Button type="submit" className="w-full" disabled={isLoading}>
											{isLoading ? "Carregando..." : "Resetar senha"}
										</Button>
									</div>
									<div className="text-center text-sm">
										<Button type="button" variant="link" asChild>
											<Link to="/sign-in">Voltar para login</Link>
										</Button>
									</div>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
