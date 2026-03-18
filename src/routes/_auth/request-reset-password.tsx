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
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_auth/request-reset-password")({
	component: RequestResetPasswordPage,
});

const forgotPasswordFormSchema = z.object({
	email: z.string().email("Email inválido"),
});

type ForgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;

function RequestResetPasswordPage() {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<ForgotPasswordFormType>({
		resolver: zodResolver(forgotPasswordFormSchema),
		defaultValues: {
			email: "",
		},
	});

	const navigate = useNavigate();

	const handleRequestPasswordReset = async (data: ForgotPasswordFormType) => {
		setIsLoading(true);
		try {
			await authClient.requestPasswordReset(
				{
					email: data.email,
					redirectTo: "/reset-password",
				},
				{
					onSuccess: () => {
						navigate({ to: "/sign-in" });
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
				},
			);

			toast.success("Email de recuperação de senha enviado");
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
